import asyncio
import json
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
from sqlalchemy import text

async def repair_json_data():
    engine = create_async_engine(settings.DATABASE_URL)
    AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncSessionLocal() as db:
        print("🔧 Repairing Provider JSON data...")
        
        # Fetch all providers
        result = await db.execute(text("SELECT id, skills, service_areas FROM providers"))
        providers = result.fetchall()
        
        for p_id, skills, areas in providers:
            updates = {}
            
            # Repair skills
            if skills and skills.startswith("[") and "'" in skills:
                try:
                    # Convert Python string representation to valid JSON
                    repaired = json.dumps(eval(skills))
                    updates["skills"] = repaired
                except:
                    pass

            # Repair service_areas
            if areas and areas.startswith("[") and "'" in areas:
                try:
                    repaired = json.dumps(eval(areas))
                    updates["service_areas"] = repaired
                except:
                    pass
            
            if updates:
                set_clause = ", ".join([f"{k} = :{k}" for k in updates.keys()])
                await db.execute(
                    text(f"UPDATE providers SET {set_clause} WHERE id = :id"),
                    {"id": p_id, **updates}
                )
        
        await db.commit()
        print("✅ Data repair complete!")
        
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(repair_json_data())
