from fastapi import APIRouter

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("/")
async def get_tasks():
    return {"message": "Tasks endpoint working - implement CRUD operations here"}