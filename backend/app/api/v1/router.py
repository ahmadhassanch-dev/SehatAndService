from fastapi import APIRouter
from app.api.v1.endpoints import main as endpoints_router

api_router = APIRouter()

# Include all endpoints
api_router.include_router(endpoints_router.router, prefix="/api/v1", tags=["Sehat & Service"])