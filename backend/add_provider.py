import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
from app.models.models import User, Provider, UserRole
from app.core.database import Base

async def add_manual_provider():
    engine = create_async_engine(settings.DATABASE_URL)
    AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncSessionLocal() as db:
        print("--- Adding Manual Provider ---")
        
        # 1. Create User
        provider_user = User(
            name="Manual Tech Expert",
            phone="03112233445",
            email="manual@example.com",
            role=UserRole.PROVIDER,
            city="Lahore",
            is_verified=True
        )
        db.add(provider_user)
        await db.commit()
        await db.refresh(provider_user)
        print(f"User created with ID: {provider_user.id}")
        
        # 2. Create Provider Profile
        provider_profile = Provider(
            user_id=provider_user.id,
            category="ac-repair",
            bio="I am a manual tech expert with years of experience in AC repair and maintenance.",
            price_min=1000,
            price_max=10000,
            rating=5.0,
            review_count=1,
            verified=True,
            response_time="10 min",
            skills=json.dumps(["Manual repair", "Quick fix", "Expert"]),
            service_areas=json.dumps(["Lahore", "Gulberg"])
        )
        db.add(provider_profile)
        await db.commit()
        print(f"Provider profile created!")
        
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(add_manual_provider())
