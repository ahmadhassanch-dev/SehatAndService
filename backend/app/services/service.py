from typing import List, Optional
from datetime import datetime
import random
import json

# Mock data storage (in-memory for MVP)
MOCK_USERS = {}
MOCK_PROVIDERS = {}
MOCK_BOOKINGS = {}
MOCK_REVIEWS = {}
MOCK_CATEGORIES = {}
MOCK_CHATS = {}
MOCK_OTPS = {}

# Initialize with sample data
def init_mock_data():
    # Categories
    categories = [
        {"id": 1, "name": "AC Repair", "name_urdu": "اے سی مرمت", "slug": "ac-repair", "icon": "snowflake", "description": "Air conditioning repair and maintenance"},
        {"id": 2, "name": "Plumbing", "name_urdu": "پلمبنگ", "slug": "plumbing", "icon": "droplet", "description": "Pipe fitting, leak repair, and drainage"},
        {"id": 3, "name": "Electrician", "name_urdu": "الیکٹریشین", "slug": "electrician", "icon": "zap", "description": "Electrical wiring and repairs"},
        {"id": 4, "name": "Carpenter", "name_urdu": "کارپینٹر", "slug": "carpenter", "icon": "hammer", "description": "Furniture repair and custom work"},
        {"id": 5, "name": "Appliance Repair", "name_urdu": "ایپلائنس مرمت", "slug": "appliance-repair", "icon": "washing-machine", "description": "Home appliance repairs"},
        {"id": 6, "name": "Cleaning", "name_urdu": "کلیننگ", "slug": "cleaning", "icon": "sparkles", "description": "Home and office cleaning services"},
        {"id": 7, "name": "Moving", "name_urdu": "موونگ", "slug": "moving", "icon": "truck", "description": "Packers and movers"},
        {"id": 8, "name": "Tutoring", "name_urdu": "ٹیوشن", "slug": "tutoring", "icon": "graduation-cap", "description": "Home tutors and coaching"},
        {"id": 9, "name": "Beauty", "name_urdu": "بیوٹی", "slug": "beauty", "icon": "scissors", "description": "Salon and beauty services"},
        {"id": 10, "name": "Tech Help", "name_urdu": "ٹیک ہیلپ", "slug": "tech-help", "icon": "laptop", "description": "Computer and phone repair"},
        {"id": 11, "name": "Home Security", "name_urdu": "ہوم سیکیورٹی", "slug": "home-security", "icon": "shield", "description": "CCTV and security systems"},
        {"id": 12, "name": "Other Services", "name_urdu": "دیگر خدمات", "slug": "other", "icon": "more-horizontal", "description": "Miscellaneous services"},
    ]
    for cat in categories:
        MOCK_CATEGORIES[cat["id"]] = cat
        MOCK_CATEGORIES[cat["slug"]] = cat

    # Sample providers
    sample_providers = [
        {
            "id": 1, "user_id": 1, "category": "ac-repair", "subcategory": "Split AC", "bio": "Expert AC technician with 10+ years experience. Specialized in all brands including Samsung, LG, Panasonic, and Haier.",
            "skills": json.dumps(["Split AC", "Window AC", "Central AC", "Refrigeration"]),
            "service_areas": json.dumps(["Lahore", "Karachi", "Islamabad"]),
            "pricing": "Starting from Rs. 500", "price_min": 500, "price_max": 5000,
            "rating": 4.8, "review_count": 156, "verified": True, "is_approved": True,
            "response_time": "15 min", "availability": json.dumps({"monday": "9AM-9PM", "tuesday": "9AM-9PM", "wednesday": "9AM-9PM", "thursday": "9AM-9PM", "friday": "9AM-9PM", "saturday": "9AM-6PM", "sunday": "10AM-4PM"}),
            "user": {"id": 1, "name": "Ahmed Khan", "phone": "03001234567", "email": "ahmed@example.com", "role": "provider", "city": "Lahore", "photo": None, "is_verified": True}
        },
        {
            "id": 2, "user_id": 2, "category": "plumbing", "subcategory": "General", "bio": "Professional plumber serving Lahore for 8 years. Expert in pipe fitting, leak repair, and bathroom fixtures.",
            "skills": json.dumps(["Pipe Fitting", "Leak Repair", "Bathroom Fixtures", "Water Heater"]),
            "service_areas": json.dumps(["Lahore", "Rawalpindi"]),
            "pricing": "Starting from Rs. 300", "price_min": 300, "price_max": 3000,
            "rating": 4.6, "review_count": 89, "verified": True, "is_approved": True,
            "response_time": "30 min", "availability": json.dumps({"monday": "8AM-8PM", "tuesday": "8AM-8PM", "wednesday": "8AM-8PM", "thursday": "8AM-8PM", "friday": "8AM-8PM", "saturday": "9AM-5PM", "sunday": "Closed"}),
            "user": {"id": 2, "name": "Muhammad Ali", "phone": "03019876543", "email": "ali@example.com", "role": "provider", "city": "Lahore", "photo": None, "is_verified": True}
        },
        {
            "id": 3, "user_id": 3, "category": "electrician", "subcategory": "General", "bio": "Certified electrician with expertise in wiring, panel installation, and electrical repairs. Safety certified.",
            "skills": json.dumps(["Wiring", "Panel Installation", "Electrical Repairs", "UPS Setup"]),
            "service_areas": json.dumps(["Karachi", "Lahore", "Islamabad"]),
            "pricing": "Starting from Rs. 400", "price_min": 400, "price_max": 4000,
            "rating": 4.9, "review_count": 203, "verified": True, "is_approved": True,
            "response_time": "20 min", "availability": json.dumps({"monday": "7AM-10PM", "tuesday": "7AM-10PM", "wednesday": "7AM-10PM", "thursday": "7AM-10PM", "friday": "7AM-10PM", "saturday": "7AM-10PM", "sunday": "7AM-10PM"}),
            "user": {"id": 3, "name": "Farhan Sheikh", "phone": "03031234567", "email": "farhan@example.com", "role": "provider", "city": "Karachi", "photo": None, "is_verified": True}
        },
        {
            "id": 4, "user_id": 4, "category": "carpenter", "subcategory": "Furniture", "bio": "Master carpenter with 15 years experience in furniture making, repair, and custom designs.",
            "skills": json.dumps(["Furniture Making", "Furniture Repair", "Cabinetry", "Wood Polishing"]),
            "service_areas": json.dumps(["Lahore", "Faisalabad"]),
            "pricing": "Starting from Rs. 1000", "price_min": 1000, "price_max": 15000,
            "rating": 4.7, "review_count": 67, "verified": True, "is_approved": True,
            "response_time": "1 hour", "availability": json.dumps({"monday": "9AM-7PM", "tuesday": "9AM-7PM", "wednesday": "9AM-7PM", "thursday": "9AM-7PM", "friday": "9AM-7PM", "saturday": "9AM-5PM", "sunday": "Closed"}),
            "user": {"id": 4, "name": "Sajid Mehmood", "phone": "03041234567", "email": "sajid@example.com", "role": "provider", "city": "Lahore", "photo": None, "is_verified": True}
        },
        {
            "id": 5, "user_id": 5, "category": "appliance-repair", "subcategory": "Refrigerator", "bio": "Expert in repairing all major home appliances. Authorized service center for multiple brands.",
            "skills": json.dumps(["Refrigerator", "Washing Machine", "Microwave", "Dishwasher"]),
            "service_areas": json.dumps(["Karachi", "Hyderabad"]),
            "pricing": "Starting from Rs. 400", "price_min": 400, "price_max": 3500,
            "rating": 4.5, "review_count": 124, "verified": True, "is_approved": True,
            "response_time": "45 min", "availability": json.dumps({"monday": "8AM-9PM", "tuesday": "8AM-9PM", "wednesday": "8AM-9PM", "thursday": "8AM-9PM", "friday": "8AM-9PM", "saturday": "9AM-6PM", "sunday": "10AM-4PM"}),
            "user": {"id": 5, "name": "Bilal Ahmed", "phone": "03051234567", "email": "bilal@example.com", "role": "provider", "city": "Karachi", "photo": None, "is_verified": True}
        },
        {
            "id": 6, "user_id": 6, "category": "cleaning", "subcategory": "Deep Cleaning", "bio": "Professional cleaning services for homes and offices. Eco-friendly products used.",
            "skills": json.dumps(["Home Cleaning", "Office Cleaning", "Deep Cleaning", "Sanitization"]),
            "service_areas": json.dumps(["Islamabad", "Rawalpindi"]),
            "pricing": "Starting from Rs. 2000", "price_min": 2000, "price_max": 10000,
            "rating": 4.8, "review_count": 89, "verified": True, "is_approved": True,
            "response_time": "30 min", "availability": json.dumps({"monday": "8AM-8PM", "tuesday": "8AM-8PM", "wednesday": "8AM-8PM", "thursday": "8AM-8PM", "friday": "8AM-8PM", "saturday": "9AM-5PM", "sunday": "9AM-2PM"}),
            "user": {"id": 6, "name": "Sara Khan", "phone": "03061234567", "email": "sara@example.com", "role": "provider", "city": "Islamabad", "photo": None, "is_verified": True}
        },
        {
            "id": 7, "user_id": 7, "category": "moving", "subcategory": "Local", "bio": "Reliable packers and movers. Safe and timely delivery guaranteed. Insured services.",
            "skills": json.dumps(["Home Shifting", "Office Shifting", "Vehicle Transport", "Storage"]),
            "service_areas": json.dumps(["All Pakistan"]),
            "pricing": "Starting from Rs. 5000", "price_min": 5000, "price_max": 50000,
            "rating": 4.6, "review_count": 45, "verified": True, "is_approved": True,
            "response_time": "1 hour", "availability": json.dumps({"monday": "7AM-9PM", "tuesday": "7AM-9PM", "wednesday": "7AM-9PM", "thursday": "7AM-9PM", "friday": "7AM-9PM", "saturday": "7AM-9PM", "sunday": "7AM-9PM"}),
            "user": {"id": 7, "name": "Rashid Logistics", "phone": "03071234567", "email": "rashid@example.com", "role": "provider", "city": "Lahore", "photo": None, "is_verified": True}
        },
        {
            "id": 8, "user_id": 8, "category": "tutoring", "subcategory": "Academic", "bio": "Experienced tutors for all subjects and classes. Personalized attention to each student.",
            "skills": json.dumps(["Math", "Physics", "Chemistry", "English"]),
            "service_areas": json.dumps(["Lahore", "Karachi", "Islamabad"]),
            "pricing": "Starting from Rs. 500/hr", "price_min": 500, "price_max": 2000,
            "rating": 4.9, "review_count": 178, "verified": True, "is_approved": True,
            "response_time": "1 hour", "availability": json.dumps({"monday": "3PM-9PM", "tuesday": "3PM-9PM", "wednesday": "3PM-9PM", "thursday": "3PM-9PM", "friday": "3PM-9PM", "saturday": "9AM-5PM", "sunday": "10AM-2PM"}),
            "user": {"id": 8, "name": "Dr. Aisha Malik", "phone": "03081234567", "email": "aisha@example.com", "role": "provider", "city": "Lahore", "photo": None, "is_verified": True}
        },
        {
            "id": 9, "user_id": 9, "category": "beauty", "subcategory": "Salon", "bio": "Professional beauty services at your doorstep. Bridal makeup specialist.",
            "skills": json.dumps(["Bridal Makeup", "Facial", "Hair Styling", "Nail Art"]),
            "service_areas": json.dumps(["Karachi", "Lahore"]),
            "pricing": "Starting from Rs. 1000", "price_min": 1000, "price_max": 15000,
            "rating": 4.7, "review_count": 234, "verified": True, "is_approved": True,
            "response_time": "30 min", "availability": json.dumps({"monday": "10AM-8PM", "tuesday": "10AM-8PM", "wednesday": "10AM-8PM", "thursday": "10AM-8PM", "friday": "10AM-8PM", "saturday": "10AM-8PM", "sunday": "11AM-6PM"}),
            "user": {"id": 9, "name": "Nazia Beauty", "phone": "03091234567", "email": "nazia@example.com", "role": "provider", "city": "Karachi", "photo": None, "is_verified": True}
        },
        {
            "id": 10, "user_id": 10, "category": "tech-help", "subcategory": "Computer", "bio": "Computer and laptop repair expert. Data recovery specialist. On-site service available.",
            "skills": json.dumps(["Computer Repair", "Laptop Repair", "Data Recovery", "Virus Removal"]),
            "service_areas": json.dumps(["Lahore", "Rawalpindi", "Islamabad"]),
            "pricing": "Starting from Rs. 500", "price_min": 500, "price_max": 5000,
            "rating": 4.8, "review_count": 167, "verified": True, "is_approved": True,
            "response_time": "20 min", "availability": json.dumps({"monday": "9AM-9PM", "tuesday": "9AM-9PM", "wednesday": "9AM-9PM", "thursday": "9AM-9PM", "friday": "9AM-9PM", "saturday": "9AM-9PM", "sunday": "10AM-6PM"}),
            "user": {"id": 10, "name": "Usman Tech", "phone": "03101234567", "email": "usman@example.com", "role": "provider", "city": "Lahore", "photo": None, "is_verified": True}
        },
    ]
    
    for provider in sample_providers:
        MOCK_PROVIDERS[provider["id"]] = provider

    # Sample reviews
    sample_reviews = [
        {"id": 1, "booking_id": 1, "provider_id": 1, "user_id": 100, "rating": 5, "comment": "Excellent service! Fixed my AC in just 30 minutes. Very professional.", "is_approved": True, "user": {"id": 100, "name": "Customer 1"}},
        {"id": 2, "booking_id": 2, "provider_id": 1, "user_id": 101, "rating": 4, "comment": "Good work, arrived on time.", "is_approved": True, "user": {"id": 101, "name": "Customer 2"}},
        {"id": 3, "booking_id": 3, "provider_id": 2, "user_id": 102, "rating": 5, "comment": "Best plumber in town! Fixed the leak quickly.", "is_approved": True, "user": {"id": 102, "name": "Customer 3"}},
        {"id": 4, "booking_id": 4, "provider_id": 3, "user_id": 103, "rating": 5, "comment": "Very knowledgeable electrician. Fixed all electrical issues.", "is_approved": True, "user": {"id": 103, "name": "Customer 4"}},
        {"id": 5, "booking_id": 5, "provider_id": 4, "user_id": 104, "rating": 4, "comment": "Great carpenter. Made beautiful furniture.", "is_approved": True, "user": {"id": 104, "name": "Customer 5"}},
    ]
    
    for review in sample_reviews:
        MOCK_REVIEWS[review["id"]] = review

# Initialize on module load
init_mock_data()


# ================== Service Functions ==================

def get_categories() -> List[dict]:
    return [cat for cat in MOCK_CATEGORIES.values() if isinstance(cat, dict) and "name" in cat]


def get_category_by_slug(slug: str) -> Optional[dict]:
    return MOCK_CATEGORIES.get(slug)


def get_providers(category: Optional[str] = None, city: Optional[str] = None, 
                  min_rating: Optional[float] = None, verified_only: bool = False,
                  sort_by: str = "rating", page: int = 1, limit: int = 20) -> dict:
    providers = list(MOCK_PROVIDERS.values())
    
    # Filter by category
    if category:
        providers = [p for p in providers if p.get("category") == category]
    
    # Filter by city
    if city:
        providers = [p for p in providers if city.lower() in p.get("service_areas", "").lower()]
    
    # Filter by rating
    if min_rating:
        providers = [p for p in providers if p.get("rating", 0) >= min_rating]
    
    # Filter verified only
    if verified_only:
        providers = [p for p in providers if p.get("verified")]
    
    # Sort
    if sort_by == "rating":
        providers.sort(key=lambda x: x.get("rating", 0), reverse=True)
    elif sort_by == "price":
        providers.sort(key=lambda x: x.get("price_min", 0))
    
    # Pagination
    total = len(providers)
    start = (page - 1) * limit
    end = start + limit
    providers_page = providers[start:end]
    
    return {
        "providers": providers_page,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }


def get_provider_by_id(provider_id: int) -> Optional[dict]:
    return MOCK_PROVIDERS.get(provider_id)


def get_provider_reviews(provider_id: int) -> List[dict]:
    return [r for r in MOCK_REVIEWS.values() if r.get("provider_id") == provider_id and r.get("is_approved")]


def search_providers(query: str, category: Optional[str] = None, city: Optional[str] = None) -> List[dict]:
    providers = list(MOCK_PROVIDERS.values())
    query_lower = query.lower()
    
    # AI-powered search - map natural language to categories
    category_mapping = {
        "ac not cooling": "ac-repair",
        "ac repair": "ac-repair",
        "ac service": "ac-repair",
        "plumber": "plumbing",
        "plumbing": "plumbing",
        "leak": "plumbing",
        "electrician": "electrician",
        "electrical": "electrician",
        "wiring": "electrician",
        "carpenter": "carpenter",
        "furniture": "carpenter",
        "appliance": "appliance-repair",
        "washing machine": "appliance-repair",
        "refrigerator": "appliance-repair",
        "cleaning": "cleaning",
        "home cleaning": "cleaning",
        "moving": "moving",
        "packers": "moving",
        "tutor": "tutoring",
        "tutoring": "tutoring",
        "tuition": "tutoring",
        "beauty": "beauty",
        "salon": "beauty",
        "makeup": "beauty",
        "computer": "tech-help",
        "laptop": "tech-help",
        "phone": "tech-help",
    }
    
    # Auto-detect category from query
    detected_category = None
    for key, cat in category_mapping.items():
        if key in query_lower:
            detected_category = cat
            break
    
    if detected_category:
        providers = [p for p in providers if p.get("category") == detected_category]
    elif category:
        providers = [p for p in providers if p.get("category") == category]
    
    # Filter by city
    if city:
        providers = [p for p in providers if city.lower() in p.get("service_areas", "").lower()]
    
    # Sort by rating
    providers.sort(key=lambda x: x.get("rating", 0), reverse=True)
    
    return providers[:10]


def create_booking(booking_data: dict) -> dict:
    booking_id = len(MOCK_BOOKINGS) + 1
    booking = {
        "id": booking_id,
        **booking_data,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    MOCK_BOOKINGS[booking_id] = booking
    return booking


def get_bookings(user_id: int, role: str = "customer") -> List[dict]:
    bookings = []
    for b in MOCK_BOOKINGS.values():
        if role == "customer" and b.get("customer_id") == user_id:
            bookings.append(b)
        elif role == "provider" and b.get("provider_id") == user_id:
            bookings.append(b)
    return bookings


def update_booking(booking_id: int, update_data: dict) -> Optional[dict]:
    if booking_id in MOCK_BOOKINGS:
        MOCK_BOOKINGS[booking_id].update(update_data)
        return MOCK_BOOKINGS[booking_id]
    return None


def create_chat(chat_data: dict) -> dict:
    chat_id = len(MOCK_CHATS) + 1
    chat = {
        "id": chat_id,
        **chat_data,
        "is_read": False,
        "created_at": datetime.utcnow().isoformat()
    }
    MOCK_CHATS[chat_id] = chat
    return chat


def get_chats(booking_id: int) -> List[dict]:
    return [c for c in MOCK_CHATS.values() if c.get("booking_id") == booking_id]


def create_review(review_data: dict) -> dict:
    review_id = len(MOCK_REVIEWS) + 1
    review = {
        "id": review_id,
        **review_data,
        "is_approved": True,
        "created_at": datetime.utcnow().isoformat()
    }
    MOCK_REVIEWS[review_id] = review
    return review


def store_otp(phone: str, otp: str):
    MOCK_OTPS[phone] = {"otp": otp, "created_at": datetime.utcnow()}


def verify_otp(phone: str, otp: str) -> bool:
    stored = MOCK_OTPS.get(phone)
    if stored and stored.get("otp") == otp:
        return True
    return False


def get_dashboard_stats(user_id: int, role: str = "customer") -> dict:
    bookings = get_bookings(user_id, role)
    
    if role == "customer":
        active = [b for b in bookings if b.get("status") in ["pending", "accepted", "on_way", "in_progress"]]
        past = [b for b in bookings if b.get("status") in ["completed", "cancelled"]]
        total_spent = sum(b.get("price", 0) for b in past if b.get("status") == "completed")
        return {
            "active_bookings": active,
            "past_bookings": past,
            "total_spent": total_spent
        }
    else:
        pending = [b for b in bookings if b.get("status") == "pending"]
        accepted = [b for b in bookings if b.get("status") == "accepted"]
        completed = [b for b in bookings if b.get("status") == "completed"]
        total_earnings = sum(b.get("price", 0) for b in completed)
        return {
            "pending_bookings": pending,
            "accepted_bookings": accepted,
            "completed_bookings": completed,
            "total_earnings": total_earnings
        }


def get_admin_stats() -> dict:
    total_users = 50
    total_providers = len(MOCK_PROVIDERS)
    total_bookings = len(MOCK_BOOKINGS)
    total_revenue = 250000
    pending_providers = 3
    pending_reviews = 5
    open_complaints = 2
    
    return {
        "total_users": total_users,
        "total_providers": total_providers,
        "total_bookings": total_bookings,
        "total_revenue": total_revenue,
        "pending_providers": pending_providers,
        "pending_reviews": pending_reviews,
        "open_complaints": open_complaints
    }


# ================== Advanced Booking System Service Functions ==================

async def create_location(db: AsyncSession, user_id: int, location_data: dict) -> Location:
    """Create or update user location"""
    # Check if location already exists for user
    result = await db.execute(select(Location).where(Location.user_id == user_id))
    existing_location = result.scalar_one_or_none()
    
    if existing_location:
        # Update existing location
        for key, value in location_data.items():
            setattr(existing_location, key, value)
        existing_location.last_updated = datetime.utcnow()
        await db.commit()
        await db.refresh(existing_location)
        return existing_location
    else:
        # Create new location
        location = Location(user_id=user_id, **location_data)
        db.add(location)
        await db.commit()
        await db.refresh(location)
        return location


async def get_user_locations(db: AsyncSession, user_id: int) -> List[Location]:
    """Get all locations for a user"""
    result = await db.execute(select(Location).where(Location.user_id == user_id))
    return result.scalars().all()


async def create_payment_transaction(db: AsyncSession, booking_id: int, transaction_data: dict) -> PaymentTransaction:
    """Create a payment transaction"""
    transaction = PaymentTransaction(booking_id=booking_id, **transaction_data)
    db.add(transaction)
    await db.commit()
    await db.refresh(transaction)
    return transaction


async def create_notification(db: AsyncSession, user_id: int, notification_data: dict) -> Notification:
    """Create a notification"""
    notification = Notification(user_id=user_id, **notification_data)
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification


async def get_user_notifications(db: AsyncSession, user_id: int, limit: int = 50) -> List[Notification]:
    """Get notifications for a user"""
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
    )
    return result.scalars().all()


async def mark_notification_read(db: AsyncSession, notification_id: int) -> bool:
    """Mark a notification as read"""
    stmt = update(Notification).where(Notification.id == notification_id).values(is_read=True)
    result = await db.execute(stmt)
    await db.commit()
    return result.rowcount > 0


async def create_provider_schedule(db: AsyncSession, provider_id: int, schedule_data: List[dict]) -> List[ProviderSchedule]:
    """Create or update provider schedule"""
    # Clear existing schedule
    await db.execute(delete(ProviderSchedule).where(ProviderSchedule.provider_id == provider_id))
    
    schedules = []
    for item in schedule_data:
        schedule = ProviderSchedule(provider_id=provider_id, **item)
        db.add(schedule)
        schedules.append(schedule)
    
    await db.commit()
    return schedules


async def get_provider_schedule(db: AsyncSession, provider_id: int) -> List[ProviderSchedule]:
    """Get provider schedule"""
    result = await db.execute(select(ProviderSchedule).where(ProviderSchedule.provider_id == provider_id))
    return result.scalars().all()


async def create_booking_slots(db: AsyncSession, provider_id: int, date: datetime, slots: List[dict]) -> List[BookingSlot]:
    """Create booking slots for a specific date"""
    # Clear existing slots for the date
    await db.execute(
        delete(BookingSlot).where(
            and_(BookingSlot.provider_id == provider_id, BookingSlot.date == date.date())
        )
    )
    
    booking_slots = []
    for slot in slots:
        booking_slot = BookingSlot(
            provider_id=provider_id,
            date=date,
            **slot
        )
        db.add(booking_slot)
        booking_slots.append(booking_slot)
    
    await db.commit()
    return booking_slots


async def get_available_slots(db: AsyncSession, provider_id: int, date: datetime) -> List[BookingSlot]:
    """Get available booking slots for a provider on a specific date"""
    result = await db.execute(
        select(BookingSlot).where(
            and_(
                BookingSlot.provider_id == provider_id,
                BookingSlot.date == date.date(),
                BookingSlot.is_booked == False
            )
        ).order_by(BookingSlot.start_time)
    )
    return result.scalars().all()


async def update_provider_online_status(db: AsyncSession, provider_id: int, status_data: dict) -> ProviderOnlineStatus:
    """Update or create provider online status"""
    result = await db.execute(
        select(ProviderOnlineStatus).where(ProviderOnlineStatus.provider_id == provider_id)
    )
    status = result.scalar_one_or_none()
    
    if status:
        for key, value in status_data.items():
            setattr(status, key, value)
        status.last_seen = datetime.utcnow()
    else:
        status = ProviderOnlineStatus(provider_id=provider_id, **status_data)
        db.add(status)
    
    await db.commit()
    await db.refresh(status)
    return status


async def get_provider_online_status(db: AsyncSession, provider_id: int) -> Optional[ProviderOnlineStatus]:
    """Get provider online status"""
    result = await db.execute(
        select(ProviderOnlineStatus).where(ProviderOnlineStatus.provider_id == provider_id)
    )
    return result.scalar_one_or_none()


async def advanced_search_providers(
    db: AsyncSession, 
    search_data: AdvancedSearchRequest,
    user_lat: Optional[float] = None,
    user_lng: Optional[float] = None
) -> dict:
    """Advanced search for providers with location, availability, and filtering"""
    
    query = select(Provider).options(
        selectinload(Provider.user),
        selectinload(Provider.services),
        selectinload(Provider.online_status)
    ).where(Provider.is_approved == True)
    
    # Text search
    if search_data.query:
        query = query.where(
            or_(
                Provider.category.ilike(f"%{search_data.query}%"),
                Provider.subcategory.ilike(f"%{search_data.query}%"),
                Provider.bio.ilike(f"%{search_data.query}%")
            )
        )
    
    # Category filter
    if search_data.category:
        query = query.where(Provider.category.ilike(f"%{search_data.category}%"))
    
    # City filter
    if search_data.city:
        query = query.where(Provider.user.has(User.city.ilike(f"%{search_data.city}%")))
    
    # Price range filter
    if search_data.min_price is not None:
        query = query.where(Provider.price_max >= search_data.min_price)
    if search_data.max_price is not None:
        query = query.where(Provider.price_min <= search_data.max_price)
    
    # Rating filter
    if search_data.min_rating is not None:
        query = query.where(Provider.rating >= search_data.min_rating)
    
    # Verified only filter
    if search_data.verified_only:
        query = query.where(Provider.verified == True)
    
    # Execute query
    result = await db.execute(query)
    providers = result.scalars().all()
    
    # Process results with location and availability data
    processed_providers = []
    for provider in providers:
        provider_data = ProviderWithAvailabilityResponse.from_orm(provider)
        
        # Calculate distance if user location provided
        if user_lat and user_lng and provider.user.city == search_data.city:
            # Simple distance calculation (in production, use proper geolocation)
            distance = 5.0  # Mock distance in km
            provider_data.distance_km = distance
            
            # Check if within radius
            if search_data.radius_km and distance <= search_data.radius_km:
                processed_providers.append(provider_data)
            elif not search_data.radius_km:
                processed_providers.append(provider_data)
        else:
            processed_providers.append(provider_data)
    
    # Sort by relevance
    if search_data.sort_by == "distance" and user_lat:
        processed_providers.sort(key=lambda x: x.distance_km or 999)
    elif search_data.sort_by == "rating":
        processed_providers.sort(key=lambda x: x.rating, reverse=True)
    elif search_data.sort_by == "price":
        processed_providers.sort(key=lambda x: x.price_min or 0)
    
    # Pagination
    start_idx = (search_data.page - 1) * search_data.limit
    end_idx = start_idx + search_data.limit
    paginated_providers = processed_providers[start_idx:end_idx]
    
    return {
        "providers": paginated_providers,
        "total": len(processed_providers),
        "search_location": {
            "lat": user_lat,
            "lng": user_lng,
            "radius_km": search_data.radius_km
        } if user_lat else None
    }


async def create_advanced_booking(db: AsyncSession, booking_data: AdvancedBookingCreate, customer_id: int) -> Booking:
    """Create an advanced booking with location and payment preferences"""
    
    # Get provider details
    provider = await db.get(Provider, booking_data.provider_id)
    if not provider:
        raise Exception("Provider not found")
    
    # Prepare booking data
    booking_dict = booking_data.dict()
    booking_dict["customer_id"] = customer_id
    booking_dict["diagnostic_fee"] = provider.diagnostic_fee or 0
    booking_dict["status"] = BookingStatus.REQUESTED.value
    
    # Generate verification code
    booking_dict["verification_code"] = "".join([str(random.randint(0, 9)) for _ in range(4)])
    
    # Handle service pricing
    if booking_data.service_id:
        service = await db.get(ProviderService, booking_data.service_id)
        if service:
            booking_dict["price"] = service.price
            booking_dict["estimated_price"] = service.price
    
    # Handle diagnostic only
    if booking_data.is_diagnostic_only:
        booking_dict["price"] = booking_dict["diagnostic_fee"]
        booking_dict["estimated_price"] = booking_dict["diagnostic_fee"]
    
    # Create booking
    booking = Booking(**booking_dict)
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    
    # Create location if provided
    if booking_data.latitude and booking_data.longitude:
        location_data = {
            "latitude": booking_data.latitude,
            "longitude": booking_data.longitude,
            "address": booking_data.address,
            "city": booking_data.city,
            "area": None
        }
        await create_location(db, customer_id, location_data)
    
    # Create notification for provider
    notification_data = {
        "type": NotificationType.BOOKING_REQUEST.value,
        "title": "New Booking Request",
        "message": f"You have a new booking request for {booking.service}",
        "data": {"booking_id": booking.id}
    }
    await create_notification(db, provider.user_id, notification_data)
    
    # Reload booking with relationships
    result = await db.execute(
        select(Booking)
        .options(
            selectinload(Booking.customer),
            selectinload(Booking.provider).selectinload(Provider.user),
            selectinload(Booking.transactions)
        )
        .where(Booking.id == booking.id)
    )
    return result.scalar_one()


async def get_booking_with_details(db: AsyncSession, booking_id: int) -> Optional[Booking]:
    """Get booking with all related details"""
    result = await db.execute(
        select(Booking)
        .options(
            selectinload(Booking.customer),
            selectinload(Booking.provider).selectinload(Provider.user),
            selectinload(Booking.provider_service),
            selectinload(Booking.reviews),
            selectinload(Booking.chats),
            selectinload(Booking.transactions),
            selectinload(Booking.slot)
        )
        .where(Booking.id == booking_id)
    )
    return result.scalar_one_or_none()


async def update_booking_status_with_notifications(
    db: AsyncSession, 
    booking_id: int, 
    new_status: str, 
    updated_by_user_id: int
) -> Optional[Booking]:
    """Update booking status and send appropriate notifications"""
    
    booking = await get_booking_with_details(db, booking_id)
    if not booking:
        return None
    
    old_status = booking.status
    booking.status = new_status
    booking.updated_at = datetime.utcnow()
    
    # Create notifications based on status change
    if new_status == BookingStatus.ACCEPTED.value:
        # Notify customer
        notification_data = {
            "type": NotificationType.BOOKING_ACCEPTED.value,
            "title": "Booking Accepted",
            "message": f"Your booking for {booking.service} has been accepted",
            "data": {"booking_id": booking.id}
        }
        await create_notification(db, booking.customer_id, notification_data)
        
    elif new_status == BookingStatus.ON_WAY.value:
        # Notify customer
        notification_data = {
            "type": NotificationType.PROVIDER_ON_WAY.value,
            "title": "Provider is on the way",
            "message": f"{booking.provider.user.name} is on the way to your location",
            "data": {"booking_id": booking.id}
        }
        await create_notification(db, booking.customer_id, notification_data)
        
    elif new_status == BookingStatus.IN_PROGRESS.value:
        # Notify customer
        notification_data = {
            "type": NotificationType.SERVICE_STARTED.value,
            "title": "Service Started",
            "message": f"Your {booking.service} service has started",
            "data": {"booking_id": booking.id}
        }
        await create_notification(db, booking.customer_id, notification_data)
        
    elif new_status == BookingStatus.COMPLETED.value:
        # Notify customer
        notification_data = {
            "type": NotificationType.SERVICE_COMPLETED.value,
            "title": "Service Completed",
            "message": f"Your {booking.service} service has been completed",
            "data": {"booking_id": booking.id}
        }
        await create_notification(db, booking.customer_id, notification_data)
        
    elif new_status == BookingStatus.REJECTED.value:
        # Notify customer
        notification_data = {
            "type": NotificationType.BOOKING_REJECTED.value,
            "title": "Booking Rejected",
            "message": f"Your booking for {booking.service} was not accepted",
            "data": {"booking_id": booking.id}
        }
        await create_notification(db, booking.customer_id, notification_data)
    
    await db.commit()
    await db.refresh(booking)
    return booking