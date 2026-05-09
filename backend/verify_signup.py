import asyncio
import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from app.services import service
from app.schemas.schemas import UserCreate, UserRole
from app.models.models import User, Provider

async def verify_signup():
    print("STARTING verification of user signup...")
    
    async with AsyncSessionLocal() as db:
        # 1. Test Customer Signup
        test_phone = "03001112223"
        print(f"--- Testing signup for customer with phone: {test_phone}")
        
        # Check if already exists and delete for clean test
        existing = await service.get_user_by_phone(db, test_phone)
        if existing:
            from sqlalchemy import delete
            await db.execute(delete(User).where(User.phone == test_phone))
            await db.commit()
            print("[CLEANUP] Cleaned up existing test user.")

        user_in = UserCreate(
            name="Test Customer",
            phone=test_phone,
            password="securepassword123",
            role=UserRole.CUSTOMER,
            city="Lahore"
        )
        
        new_user = await service.create_user_in_db(db, user_in)
        print(f"[SUCCESS] Created user ID: {new_user.id}")
        
        # Verify in DB
        fetched = await service.get_user_by_phone(db, test_phone)
        if fetched and fetched.id == new_user.id:
            print(f"[SUCCESS] Verified user persistence: {fetched.name} ({fetched.role})")
        else:
            print("[FAILURE] User persistence verification failed!")
            return

        # 2. Test Provider Signup
        provider_phone = "03004445556"
        print(f"\n--- Testing signup for provider with phone: {provider_phone}")
        
        # Clean up
        existing_p = await service.get_user_by_phone(db, provider_phone)
        if existing_p:
            from sqlalchemy import delete
            await db.execute(delete(User).where(User.phone == provider_phone))
            await db.commit()
            print("[CLEANUP] Cleaned up existing test provider.")

        provider_in = UserCreate(
            name="Test Provider",
            phone=provider_phone,
            password="providerpassword123",
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

        print("\n=== ALL TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(verify_signup())
