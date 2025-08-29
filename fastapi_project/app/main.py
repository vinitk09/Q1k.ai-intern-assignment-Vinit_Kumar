import os
from datetime import datetime
from typing import List, Optional, Any
from enum import Enum

from fastapi import FastAPI, HTTPException, Body, Query, Path, status
from fastapi.middleware.cors import CORSMiddleware
# --- Imports updated for Pydantic V2 ---
from pydantic import BaseModel, Field, ConfigDict
from pydantic_core import core_schema
from pydantic.json_schema import GetJsonSchemaHandler
# ---
from pymongo import MongoClient
from bson import ObjectId

# --- Application Setup ---

app = FastAPI(
    title="Task Management API",
    description="A robust API for managing tasks and viewing dashboard stats using FastAPI and MongoDB.",
    version="1.1.0"
)

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Connection ---
# UPDATED: Connection string now points to your MongoDB Atlas cluster.
# For production, it's highly recommended to set this as an environment variable
# instead of hardcoding it.
MONGO_DETAILS = os.environ.get(
    "MONGO_DETAILS", 
    "mongodb+srv://vinitkumar8092:Vinit6203@cluster0.jig31l3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
client = MongoClient(MONGO_DETAILS)
db = client["task_manager"] # Your database name
task_collection = db["tasks"] # Your collection name

# --- Custom ObjectId Type for Pydantic V2 ---
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetJsonSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema(
                [
                    core_schema.is_instance_schema(ObjectId),
                    core_schema.chain_schema(
                        [
                            core_schema.str_schema(),
                            core_schema.no_info_plain_validator_function(cls.validate),
                        ]
                    ),
                ]
            ),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)


# --- Pydantic Models (Data Schemas) ---

class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TaskBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100, description="The title of the task.")
    description: str = Field(..., min_length=3, max_length=500, description="A detailed description of the task.")
    status: TaskStatus = Field(default=TaskStatus.pending, description="The current status of the task.")
    priority: TaskPriority = Field(default=TaskPriority.medium, description="The priority level of the task.")
    due_date: Optional[datetime] = Field(None, description="The date by which the task should be completed.")
    model_config = ConfigDict(use_enum_values=True)

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, min_length=3, max_length=500)
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: PyObjectId = Field(alias="_id", description="The unique identifier of the task.")
    created_at: datetime = Field(..., description="The timestamp when the task was created.")
    updated_at: datetime = Field(..., description="The timestamp when the task was last updated.")
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "title": "Develop new feature",
                "description": "Implement user authentication using JWT.",
                "status": "in_progress",
                "priority": "high",
                "due_date": "2025-09-15T10:00:00Z",
                "_id": "60d5ec49f7b4c6a3b0a0a0a0",
                "created_at": "2025-08-29T12:00:00Z",
                "updated_at": "2025-08-29T14:30:00Z"
            }
        }
    )

class DashboardStats(BaseModel):
    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int


# --- API Endpoints ---

@app.get("/api/dashboard/stats", response_model=DashboardStats, tags=["Dashboard"])
async def get_dashboard_stats():
    try:
        total_tasks = task_collection.count_documents({})
        pending_tasks = task_collection.count_documents({"status": "pending"})
        in_progress_tasks = task_collection.count_documents({"status": "in_progress"})
        completed_tasks = task_collection.count_documents({"status": "completed"})
        return {
            "total_tasks": total_tasks,
            "pending_tasks": pending_tasks,
            "in_progress_tasks": in_progress_tasks,
            "completed_tasks": completed_tasks
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching dashboard stats: {e}"
        )

@app.post("/api/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, tags=["Tasks"])
async def create_task(task: TaskCreate = Body(...)):
    task_data = task.model_dump(exclude_unset=True)
    now = datetime.utcnow()
    task_data["created_at"] = now
    task_data["updated_at"] = now
    result = task_collection.insert_one(task_data)
    created_task = task_collection.find_one({"_id": result.inserted_id})
    return created_task

@app.get("/api/tasks", response_model=List[TaskResponse], tags=["Tasks"])
async def get_all_tasks(
    status_filter: Optional[TaskStatus] = Query(None, alias="status"),
    priority_filter: Optional[TaskPriority] = Query(None, alias="priority"),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    query = {}
    if status_filter:
        query["status"] = status_filter.value
    if priority_filter:
        query["priority"] = priority_filter.value
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    tasks = list(task_collection.find(query).skip(skip).limit(limit))
    return tasks

@app.get("/api/tasks/{id}", response_model=TaskResponse, tags=["Tasks"])
async def get_task_by_id(id: str = Path(...)):
    try:
        task = task_collection.find_one({"_id": ObjectId(id)})
        if task is not None:
            return task
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with ID {id} not found")
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with ID {id} not found")

@app.put("/api/tasks/{id}", response_model=TaskResponse, tags=["Tasks"])
async def update_task(id: str, task_update: TaskUpdate = Body(...)):
    update_data = task_update.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No update data provided")
    update_data["updated_at"] = datetime.utcnow()
    result = task_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with ID {id} not found")
    updated_task = task_collection.find_one({"_id": ObjectId(id)})
    return updated_task

@app.delete("/api/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Tasks"])
async def delete_task(id: str):
    result = task_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with ID {id} not found")
    return

@app.get("/", tags=["Task Check"])
async def health_check():
    return {"status": "ok", "message": "Welcome to the Task Management API!"}
