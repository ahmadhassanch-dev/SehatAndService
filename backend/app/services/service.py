from typing import List, Optional, Any
from datetime import datetime
import random
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from sqlalchemy.orm import selectinload
from app.models.models import User, Provider, Booking, Review, Chat, Category, Complaint, UserRole, BookingStatus, ProviderService
from app.schemas.schemas import (
    UserCreate, ProviderCreate, BookingCreate, ReviewCreate, ChatCreate,
    ProviderListResponse, UserResponse, ProviderServiceCreate, ProviderServiceUpdate
)

# Mock OTP storage (in-memory is fine for MVP OTPs)
MOCK_OTPS = {}

# ================== Provider Services ==================

async def create_provider_service(db: AsyncSession, provider_id: int, service_data: ProviderServiceCreate) -> ProviderService:
    service = ProviderService(provider_id=provider_id, **service_data.dict())
    db.add(service)
    await db.commit()
    await db.refresh(service)
    return service

async def get_provider_services(db: AsyncSession, provider_id: int) -> List[ProviderService]:
    result = await db.execute(select(ProviderService).where(ProviderService.provider_id == provider_id, ProviderService.is_active == True))
    return result.scalars().all()

async def update_provider_service(db: AsyncSession, service_id: int, service_update: ProviderServiceUpdate) -> Optional[ProviderService]:
    stmt = update(ProviderService).where(ProviderService.id == service_id).values(**service_update.dict(exclude_unset=True))
    await db.execute(stmt)
    await db.commit()
    return await db.get(ProviderService, service_id)

async def delete_provider_service(db: AsyncSession, service_id: int):
    stmt = update(ProviderService).where(ProviderService.id == service_id).values(is_active=False)
    await db.execute(stmt)
    await db.commit()

# ================== User Services ==================

async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_phone(db: AsyncSession, phone: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.phone == phone))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user_data: dict) -> User:
    user = User(**user_data)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

# ================== Category Services ==================

async def get_categories(db: AsyncSession) -> List[Category]:
    result = await db.execute(select(Category).where(Category.is_active == True))
    categories = result.scalars().all()
    
    # Seed if empty (for MVP convenience)
    if not categories:
        sample_cats = [
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
        for cat_data in sample_cats:
            cat = Category(**cat_data)
            db.add(cat)
        await db.commit()
        result = await db.execute(select(Category).where(Category.is_active == True))
        categories = result.scalars().all()
        
    return categories

async def get_category_by_slug(db: AsyncSession, slug: str) -> Optional[Category]:
    result = await db.execute(select(Category).where(Category.slug == slug))
    return result.scalar_one_or_none()

# ================== Provider Services ==================

async def get_providers(
    db: AsyncSession,
    category: Optional[str] = None,
    city: Optional[str] = None,
    min_rating: Optional[float] = None,
    verified_only: bool = False,
    sort_by: str = "rating",
    page: int = 1,
    limit: int = 20
) -> dict:
    query = select(Provider).options(selectinload(Provider.user))
    
    if category:
        query = query.where(Provider.category == category)
    if city:
        query = query.join(User).where(User.city == city)
    if min_rating:
        query = query.where(Provider.rating >= min_rating)
    if verified_only:
        query = query.where(Provider.verified == True)
        
    if sort_by == "rating":
        query = query.order_by(Provider.rating.desc())
    elif sort_by == "price":
        query = query.order_by(Provider.price_min.asc())
        
    # Total count
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0
    
    # Pagination
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    providers = result.scalars().all()
    
    # If no providers in DB, return some mock data for the demo
    if not providers and page == 1:
        return await _get_mock_providers(category, city, min_rating, verified_only, sort_by, limit)

    return {
        "providers": providers,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

async def get_provider_by_id(db: AsyncSession, provider_id: int) -> Optional[Provider]:
    result = await db.execute(
        select(Provider)
        .options(selectinload(Provider.user))
        .where(Provider.id == provider_id)
    )
    return result.scalar_one_or_none()

async def get_provider_reviews(db: AsyncSession, provider_id: int) -> List[Review]:
    result = await db.execute(
        select(Review)
        .options(selectinload(Review.user))
        .where(Review.provider_id == provider_id, Review.is_approved == True)
    )
    return result.scalars().all()

# ================== Search Services ==================

async def search_providers(
    db: AsyncSession,
    query: str,
    category: Optional[str] = None,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    verified_only: bool = False,
    page: int = 1,
    limit: int = 20
) -> dict:
    query_str = query.lower()
    
    # Basic natural language mapping
    category_mapping = {
        "ac": "ac-repair",
        "plumb": "plumbing",
        "electr": "electrician",
        "carpent": "carpenter",
        "wash": "appliance-repair",
        "clean": "cleaning",
        "move": "moving",
        "tutor": "tutoring",
        "beauty": "beauty",
        "tech": "tech-help",
    }
    
    detected_category = category
    if not detected_category:
        for key, cat in category_mapping.items():
            if key in query_str:
                detected_category = cat
                break
                
    return await get_providers(
        db, 
        category=detected_category, 
        city=city, 
        min_rating=min_rating, 
        verified_only=verified_only,
        page=page,
        limit=limit
    )

# ================== Booking Services ==================

async def create_booking(db: AsyncSession, booking_data: dict) -> Booking:
    # If service_id is provided, we could optionally fetch price here
    booking = Booking(**booking_data)
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking

async def get_bookings(db: AsyncSession, user_id: int, role: str = "customer") -> List[Booking]:
    query = select(Booking).options(selectinload(Booking.provider).selectinload(Provider.user))
    
    if role == "customer":
        query = query.where(Booking.customer_id == user_id)
    else:
        # Assuming user_id passed here is user_id, not provider_id
        # First find provider_id
        provider_res = await db.execute(select(Provider.id).where(Provider.user_id == user_id))
        provider_id = provider_res.scalar_one_or_none()
        if provider_id:
            query = query.where(Booking.provider_id == provider_id)
        else:
            return []
            
    query = query.order_by(Booking.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

async def update_booking(db: AsyncSession, booking_id: int, update_data: dict) -> Optional[Booking]:
    stmt = update(Booking).where(Booking.id == booking_id).values(**update_data)
    await db.execute(stmt)
    await db.commit()
    return await db.get(Booking, booking_id)

# ================== Chat Services ==================

async def create_chat(db: AsyncSession, chat_data: dict) -> Chat:
    chat = Chat(**chat_data)
    db.add(chat)
    await db.commit()
    await db.refresh(chat)
    return chat

async def get_chats(db: AsyncSession, booking_id: int) -> List[Chat]:
    result = await db.execute(select(Chat).where(Chat.booking_id == booking_id).order_by(Chat.created_at.asc()))
    return result.scalars().all()

# ================== Review Services ==================

async def create_review(db: AsyncSession, review_data: dict) -> Review:
    review = Review(**review_data)
    db.add(review)
    
    # Update provider rating (simplified for MVP)
    provider = await db.get(Provider, review_data["provider_id"])
    if provider:
        total_rating = (provider.rating * provider.review_count) + review_data["rating"]
        provider.review_count += 1
        provider.rating = total_rating / provider.review_count
        
    await db.commit()
    await db.refresh(review)
    return review

# ================== Auth Services ==================

async def store_otp(db: AsyncSession, phone: str, otp: str):
    MOCK_OTPS[phone] = {"otp": otp, "created_at": datetime.utcnow()}

async def verify_otp(db: AsyncSession, phone: str, otp: str) -> bool:
    stored = MOCK_OTPS.get(phone)
    if stored and stored.get("otp") == otp:
        return True
    return False

# ================== Dashboard Services ==================

async def get_dashboard_stats(db: AsyncSession, user_id: int, role: str = "customer") -> dict:
    bookings = await get_bookings(db, user_id, role)
    
    if role == "customer":
        active = [b for b in bookings if b.status in ["pending", "accepted", "on_way", "in_progress"]]
        past = [b for b in bookings if b.status in ["completed", "cancelled"]]
        total_spent = sum(b.price for b in past if b.status == "completed")
        return {
            "active_bookings": active,
            "past_bookings": past,
            "saved_providers": [], # Placeholder
            "total_spent": total_spent
        }
    else:
        pending = [b for b in bookings if b.status == "pending"]
        accepted = [b for b in bookings if b.status == "accepted"]
        completed = [b for b in bookings if b.status == "completed"]
        total_earnings = sum(b.price for b in completed)
        
        # Get provider rating
        provider_res = await db.execute(select(Provider.rating).where(Provider.user_id == user_id))
        rating = provider_res.scalar_one_or_none() or 0
        
        return {
            "pending_bookings": pending,
            "accepted_bookings": accepted,
            "completed_bookings": completed,
            "total_earnings": total_earnings,
            "average_rating": rating
        }

async def get_admin_stats(db: AsyncSession) -> dict:
    # Simplified for MVP
    return {
        "total_users": 100,
        "total_providers": 20,
        "total_bookings": 150,
        "total_revenue": 500000,
        "pending_providers": 5,
        "pending_reviews": 10,
        "open_complaints": 3
    }

# ================== Internal Mock Fallback ==================

async def _get_mock_providers(category, city, min_rating, verified_only, sort_by, limit):
    # This uses ProviderListResponse objects to ensure Pydantic can serialize them
    mock_data = [
        ProviderListResponse(
            id=1, category="ac-repair", subcategory="Split AC", 
            bio="Expert AC technician with 10+ years experience. Specialized in all brands.",
            price_min=500, price_max=5000, rating=4.8, review_count=156, verified=True,
            response_time="15 min", 
            user=UserResponse(
                id=101, name="Ahmed Khan", phone="03001234567", city="Lahore", 
                role="provider", is_verified=True, is_active=True, created_at=datetime.utcnow()
            )
        ),
        ProviderListResponse(
            id=2, category="plumbing", subcategory="General", 
            bio="Professional plumber serving Lahore for 8 years.",
            price_min=300, price_max=3000, rating=4.6, review_count=89, verified=True,
            response_time="30 min", 
            user=UserResponse(
                id=102, name="Muhammad Ali", phone="03019876543", city="Lahore", 
                role="provider", is_verified=True, is_active=True, created_at=datetime.utcnow()
            )
        )
    ]
    
    filtered = mock_data
    if category:
        filtered = [p for p in filtered if p.category == category]
    
    return {
        "providers": filtered,
        "total": len(filtered),
        "page": 1,
        "total_pages": 1
    }
