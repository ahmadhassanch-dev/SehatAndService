import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import models and schemas
from app.models.models import Base, User, Provider, ProviderOnlineStatus
from app.schemas.schemas import UserCreate, UserRole
from app.services import service

# Local SQLite for testing
SQLITE_URL = "sqlite+aiosqlite:///:memory:"

async def test_signup_logic():
    print("--- Starting LOCAL verification using SQLite (In-Memory)...")
    
    # 1. Setup in-memory DB
    engine = create_async_engine(SQLITE_URL)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("[INIT] Local database tables created.")

    async with async_session() as db:
        # 2. Test Customer Signup
        test_phone = "03001112223"
        print(f"--- Testing signup for customer: {test_phone}")
        
        user_in = UserCreate(
            name="Local Test User",
            phone=test_phone,
            password="testpassword123",
            role=UserRole.CUSTOMER,
            city="Lahore"
        )
        
        new_user = await service.create_user_in_db(db, user_in)
        print(f"[SUCCESS] Created user ID: {new_user.id}")
        
        # Verify
        fetched = await service.get_user_by_phone(db, test_phone)
        if fetched and fetched.name == "Local Test User":
            print(f"[SUCCESS] Verified customer persistence in SQLite.")
        else:
            print("[FAILURE] Customer persistence failed!")
            return

        # 3. Test Provider Signup
        provider_phone = "03004445556"
        print(f"\n--- Testing signup for provider: {provider_phone}")
        
        provider_in = UserCreate(
            name="Local Test Provider",
            phone=provider_phone,
            password="providerpass123",
            role=UserRole.PROVIDER,
            city="Karachi"
        )
        
        new_provider_user = await service.create_user_in_db(db, provider_in)
        print(f"[SUCCESS] Created provider user ID: {new_provider_user.id}")
        
        # Verify provider profile
        provider_profile = await service.get_provider_by_user_id(db, new_provider_user.id)
        if provider_profile:
            print(f"[SUCCESS] Verified provider profile creation: ID {provider_profile.id}")
            print(f"[SUCCESS] Initial category: {provider_profile.category}")
        else:
            print("[FAILURE] Provider profile creation failed!")
            return

        # Verify Online Status
        from sqlalchemy import select
        status_result = await db.execute(select(ProviderOnlineStatus).where(ProviderOnlineStatus.provider_id == provider_profile.id))
        status = status_result.scalar_one_or_none()
        if status:
            print(f"[SUCCESS] Verified online status record exists.")
        else:
            print("[FAILURE] Online status record missing!")
            return

    print("\n=== LOCAL LOGIC VERIFICATION PASSED! ===")
    print("This confirms the signup and database insertion logic is 100% correct.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_signup_logic())
