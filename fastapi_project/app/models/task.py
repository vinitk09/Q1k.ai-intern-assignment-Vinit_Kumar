
from bson import ObjectId
from datetime import datetime
from app.database import get_task_collection

class TaskModel:
    @staticmethod
    async def get_all_tasks(skip: int = 0, limit: int = 10, status: str = None, priority: str = None, search: str = None):
        collection = get_task_collection()
        query = {}
        
        if status:
            query["status"] = status
        if priority:
            query["priority"] = priority
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
            
        tasks = await collection.find(query).skip(skip).limit(limit).to_list(limit)
        total = await collection.count_documents(query)
        
        return tasks, total

    @staticmethod
    async def get_task_by_id(task_id: str):
        collection = get_task_collection()
        task = await collection.find_one({"_id": ObjectId(task_id)})
        return task

    @staticmethod
    async def create_task(task_data: dict):
        collection = get_task_collection()
        task_data["created_at"] = datetime.utcnow()
        task_data["updated_at"] = datetime.utcnow()
        result = await collection.insert_one(task_data)
        return await collection.find_one({"_id": result.inserted_id})

    @staticmethod
    async def update_task(task_id: str, task_data: dict):
        collection = get_task_collection()
        task_data["updated_at"] = datetime.utcnow()
        await collection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": task_data}
        )
        return await collection.find_one({"_id": ObjectId(task_id)})

    @staticmethod
    async def delete_task(task_id: str):
        collection = get_task_collection()
        result = await collection.delete_one({"_id": ObjectId(task_id)})
        return result.deleted_count > 0

    @staticmethod
    async def get_task_stats():
        collection = get_task_collection()
        
        total_tasks = await collection.count_documents({})
        
        status_pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        status_stats = await collection.aggregate(status_pipeline).to_list(None)
        
        priority_pipeline = [
            {"$match": {"priority": "high"}},
            {"$count": "high_priority_count"}
        ]
        high_priority_result = await collection.aggregate(priority_pipeline).to_list(None)
        high_priority_count = high_priority_result[0]["high_priority_count"] if high_priority_result else 0
        
        recent_tasks = await collection.find().sort("created_at", -1).limit(5).to_list(5)
        
        return {
            "total_tasks": total_tasks,
            "status_stats": {stat["_id"]: stat["count"] for stat in status_stats},
            "high_priority_count": high_priority_count,
            "recent_tasks": recent_tasks
        }