import asyncio
import random
import json
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
from app.models.models import User, Provider, UserRole, Category, ProviderService, Booking, Review, BookingStatus
from app.core.database import Base

# Pakistani Data Arrays
CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"]
NAMES = [
    "Ahmed Khan", "Muhammad Ali", "Farhan Sheikh", "Usman Tech", "Sajid Mehmood",
    "Zeeshan Butt", "Hamza Malik", "Bilal Qureshi", "Dr. Aisha Malik", "Fatima Batool",
    "Kashif Hussain", "Irfaan Haider", "Noman Shah", "Adnan Jameel", "Omer Farooq",
    "Rizwan Ahmed", "Yasir Arafat", "Junaid Jamshed", "Asim Azhar", "Atif Aslam",
    "Saira Banu", "Hina Rabbani", "Mehwish Hayat", "Fawad Khan", "Mahira Khan"
]

CUSTOMER_NAMES = [
    "Ali Raza", "Sara Ahmed", "Zainab Bibi", "Omar Khalid", "Hassan Nawaz",
    "Ayesha Gul", "Bilal Siddiqui", "Mariam Malik", "Mustafa Kamal", "Sana Mir"
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

SERVICES_BY_CAT = {
    "ac-repair": [
        {"name": "General Service", "name_urdu": "جنرل سروس", "price": 1500, "desc": "Standard AC maintenance"},
        {"name": "Gas Refill", "name_urdu": "گیس ری فل", "price": 4500, "desc": "Full gas charging for 1.5 ton AC"},
        {"name": "Installation", "name_urdu": "انسٹالیشن", "price": 3000, "desc": "New AC indoor/outdoor setup"}
    ],
    "plumbing": [
        {"name": "Leakage Repair", "name_urdu": "لیکیج مرمت", "price": 500, "desc": "Fixing pipe leaks"},
        {"name": "Bathroom Fitting", "name_urdu": "باتھ روم فٹنگ", "price": 2500, "desc": "Complete toilet/sink install"},
        {"name": "Water Tank Cleaning", "name_urdu": "پانی کی ٹنکی کی صفائی", "price": 1500, "desc": "Deep cleaning of tank"}
    ],
    "electrician": [
        {"name": "Wiring Repair", "name_urdu": "وائرنگ مرمت", "price": 1000, "desc": "Short circuit fixing"},
        {"name": "Fan Installation", "name_urdu": "پنکھا لگانا", "price": 400, "desc": "Ceiling or wall fan install"},
        {"name": "UPS Setup", "name_urdu": "یو پی ایس سیٹ اپ", "price": 1500, "desc": "Battery and inverter config"}
    ],
    "carpenter": [
        {"name": "Door Repair", "name_urdu": "دروازہ مرمت", "price": 800, "desc": "Lock/hinge repair"},
        {"name": "Sofa Polishing", "name_urdu": "صوفہ پالش", "price": 3000, "desc": "Renew sofa wood finish"},
        {"name": "Custom Cabinet", "name_urdu": "کیمبنٹ بنانا", "price": 8000, "desc": "Kitchen or room cabinets"}
    ],
    "tutoring": [
        {"name": "Math Home Tuition", "name_urdu": "میٹھ ہوم ٹیوشن", "price": 5000, "desc": "Monthly math sessions"},
        {"name": "Quran Classes", "name_urdu": "قرآن کلاسز", "price": 2000, "desc": "Daily 30 mins Quran teaching"},
        {"name": "English Language", "name_urdu": "انگلش لینگویج", "price": 3000, "desc": "Spoken English coaching"}
    ]
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
            if not existing.first():
                cat = Category(**cat_data)
                db.add(cat)
        await db.commit()
        print("✅ Categories seeded.")

        # 2. Seed Customers
        print("--- Seeding 10 Customers ---")
        customers = []
        for i in range(10):
            name = CUSTOMER_NAMES[i % len(CUSTOMER_NAMES)]
            city = CITIES[i % len(CITIES)]
            phone = f"039{random.randint(100, 999)}{random.randint(1000000, 9999999)}"[:11]
            user = User(
                name=name,
                phone=phone,
                email=f"customer{i}@fixly.pk",
                role=UserRole.CUSTOMER.value,
                city=city,
                is_verified=True
            )
            db.add(user)
            customers.append(user)
        await db.flush()
        print(f"✅ {len(customers)} customers added.")

        # 3. Seed Providers (20 providers)
        print("--- Seeding 20 Providers with Services ---")
        all_providers = []
        for i in range(20):
            name = NAMES[i % len(NAMES)]
            city = CITIES[i % len(CITIES)]
            phone = f"03{random.randint(100, 499)}{random.randint(1000000, 9999999)}"[:11]
            cat_obj = CATEGORIES[i % len(CATEGORIES)]
            slug = cat_obj["slug"]
            
            # Create User
            user = User(
                name=name,
                phone=phone,
                email=f"provider{i}@fixly.pk",
                role=UserRole.PROVIDER.value,
                city=city,
                is_verified=True
            )
            db.add(user)
            await db.flush() # Get ID without committing
            
            # Create Provider Profile
            skills = ["Expert", "Reliable", "Fast"]
            
            provider = Provider(
                user_id=user.id,
                category=slug,
                bio=random.choice(BIOS),
                price_min=0, # Will be updated by helper
                price_max=0, # Will be updated by helper
                rating=round(random.uniform(4.0, 5.0), 1),
                review_count=random.randint(10, 50),
                verified=True,
                is_approved=True,
                status="approved",
                response_time=f"{random.randint(5, 60)} min",
                skills=json.dumps(skills),
                service_areas=json.dumps([city, "Nearby Areas"]),
                cnic=f"35201-{random.randint(1000000, 9999999)}-1"
            )
            db.add(provider)
            await db.flush()
            all_providers.append(provider)
            
            # Seed Provider Services
            cat_services = SERVICES_BY_CAT.get(slug, [
                {"name": "Standard Visit", "name_urdu": "معیاری وزٹ", "price": 1000, "desc": "Standard diagnostic visit"}
            ])
            
            p_services = []
            prices = []
            for svc_data in cat_services:
                svc = ProviderService(
                    provider_id=provider.id,
                    name=svc_data["name"],
                    name_urdu=svc_data.get("name_urdu"),
                    price=svc_data["price"],
                    description=svc_data.get("desc"),
                    category=slug
                )
                db.add(svc)
                p_services.append(svc)
                prices.append(svc.price)
            
            provider.price_min = min(prices)
            provider.price_max = max(prices)
            
        await db.commit()
        print("✅ 20 Pakistani providers and their services seeded.")

        # 4. Seed Bookings and Reviews
        print("--- Seeding Bookings and Reviews ---")
        for i in range(30):
            customer = random.choice(customers)
            provider = random.choice(all_providers)
            
            # Find a service for this provider
            res = await db.execute(ProviderService.__table__.select().where(ProviderService.provider_id == provider.id))
            svc_row = res.first()
            
            if svc_row:
                booking = Booking(
                    customer_id=customer.id,
                    provider_id=provider.id,
                    service_id=svc_row.id,
                    service=svc_row.name,
                    status=random.choice([BookingStatus.COMPLETED.value, BookingStatus.ACCEPTED.value, BookingStatus.PENDING.value]),
                    scheduled_date=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
                    address=f"House {random.randint(1, 100)}, Street {random.randint(1, 20)}, {customer.city}",
                    city=customer.city,
                    price=svc_row.price,
                    estimated_price=svc_row.price
                )
                db.add(booking)
                await db.flush()
                
                # If completed, add a review
                if booking.status == BookingStatus.COMPLETED.value:
                    review = Review(
                        booking_id=booking.id,
                        provider_id=provider.id,
                        user_id=customer.id,
                        rating=random.randint(4, 5),
                        comment=random.choice(["Great service!", "Very professional", "Prompt and reliable", "Fixed the issue perfectly", "Highly recommended"]),
                        is_approved=True
                    )
                    db.add(review)
        
        await db.commit()
        print("✅ 30 Bookings and related reviews seeded.")
        
    await engine.dispose()
    print("\n🌟 Super Seed Complete! Your marketplace is now populated with realistic Pakistani data.")

if __name__ == "__main__":
    asyncio.run(seed_database())
