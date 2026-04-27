import asyncio
import random
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
from app.models.models import User, Provider, UserRole, Category
from app.core.database import Base

# Pakistani Data Arrays
CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"]
NAMES = [
    "Ahmed Khan", "Muhammad Ali", "Farhan Sheikh", "Usman Tech", "Sajid Mehmood",
    "Zeeshan Butt", "Hamza Malik", "Bilal Qureshi", "Dr. Aisha Malik", "Fatima Batool",
    "Kashif Hussain", "Irfaan Haider", "Noman Shah", "Adnan Jameel", "Omer Farooq",
    "Rizwan Ahmed", "Yasir Arafat", "Junaid Jamshed", "Asim Azhar", "Atif Aslam"
]

CATEGORIES = [
    {"name": "AC Repair", "name_urdu": "اے سی مرمت", "slug": "ac-repair", "icon": "snowflake"},
    {"name": "Plumbing", "name_urdu": "پلمبنگ", "slug": "plumbing", "icon": "droplet"},
    {"name": "Electrician", "name_urdu": "الیکٹریشین", "slug": "electrician", "icon": "zap"},
    {"name": "Carpenter", "name_urdu": "کارپینٹر", "slug": "carpenter", "icon": "hammer"},
    {"name": "Appliance Repair", "name_urdu": "ایپلائنس مرمت", "slug": "appliance-repair", "icon": "washing-machine"},
    {"name": "Cleaning", "name_urdu": "کلیننگ", "slug": "cleaning", "icon": "sparkles"},
    {"name": "Moving", "name_urdu": "موونگ", "slug": "moving", "icon": "truck"},
    {"name": "Tutoring", "name_urdu": "ٹیوشن", "slug": "tutoring", "icon": "graduation-cap"},
    {"name": "Beauty", "name_urdu": "بیوٹی", "slug": "beauty", "icon": "scissors"},
    {"name": "Tech Help", "name_urdu": "ٹیک ہیلپ", "slug": "tech-help", "icon": "laptop"},
]

BIOS = [
    "Expert service with 10+ years experience. Quality guaranteed.",
    "Certified professional providing reliable and fast service in your area.",
    "Specialized in all major brands. Affordable rates and best performance.",
    "Your trusted local expert for all your home maintenance needs.",
    "Safety first approach. I provide comprehensive repairs and installations."
]

SKILLS_MAP = {
    "ac-repair": ["Split AC", "Window AC", "Gas Refill", "Maintenance"],
    "plumbing": ["Pipe fitting", "Leak repair", "Bathroom fixtures", "Drainage"],
    "electrician": ["Wiring", "UPS Setup", "Panel Repair", "CCTV"],
    "carpenter": ["Furniture making", "Furniture repair", "Polishing", "Door fitting"],
    "tutoring": ["Math", "Physics", "Chemistry", "English", "Urdu"],
    "tech-help": ["Laptop repair", "Software install", "Networking", "Data recovery"]
}

async def seed_database():
    engine = create_async_engine(settings.DATABASE_URL)
    AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncSessionLocal() as db:
        print("🚀 Starting Super Seed Script...")
        
        # 1. Seed Categories
        print("--- Seeding Categories ---")
        for cat_data in CATEGORIES:
            existing = await db.execute(Category.__table__.select().where(Category.slug == cat_data["slug"]))
            if not existing.scalar():
                cat = Category(**cat_data)
                db.add(cat)
        await db.commit()
        print("✅ Categories seeded.")

        # 2. Seed Providers (20 providers)
        print("--- Seeding 20 Providers ---")
        for i in range(20):
            name = NAMES[i % len(NAMES)]
            city = CITIES[i % len(CITIES)]
            phone = f"03{random.randint(100, 499)}{random.randint(1000000, 9999999)}"
            cat_obj = CATEGORIES[i % len(CATEGORIES)]
            slug = cat_obj["slug"]
            
            # Create User
            user = User(
                name=f"{name} {i}",
                phone=phone,
                email=f"provider{i}@sehatservice.pk",
                role=UserRole.PROVIDER,
                city=city,
                is_verified=True
            )
            db.add(user)
            await db.flush() # Get ID without committing
            
            # Create Provider Profile
            skills = SKILLS_MAP.get(slug, ["Expert", "Reliable", "Fast"])
            
            provider = Provider(
                user_id=user.id,
                category=slug,
                bio=random.choice(BIOS),
                price_min=random.randint(300, 1000),
                price_max=random.randint(2000, 15000),
                rating=round(random.uniform(4.0, 5.0), 1),
                review_count=random.randint(10, 500),
                verified=True,
                is_approved=True,
                response_time=f"{random.randint(5, 60)} min",
                skills=json.dumps(skills),
                service_areas=json.dumps([city, "Nearby Areas"])
            )
            db.add(provider)
            
        await db.commit()
        print("✅ 20 Pakistani providers seeded successfully.")
        
    await engine.dispose()
    print("\n🌟 Super Seed Complete! Your marketplace is now populated.")

if __name__ == "__main__":
    asyncio.run(seed_database())
