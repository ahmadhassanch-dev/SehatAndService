import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.models.models import Base

async def reset_database():
    print("⚠️  WARNING: This will drop all data in the database!")
    engine = create_async_engine(settings.DATABASE_URL)
    
    async with engine.begin() as conn:
        print("🗑️  Dropping all tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("🏗️  Creating all tables with updated schema...")
        await conn.run_sync(Base.metadata.create_all)
        
    print("✅ Database reset successfully!")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(reset_database())
