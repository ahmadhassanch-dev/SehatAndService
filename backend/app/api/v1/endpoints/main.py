from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.schemas import (
    CategoryResponse, ProviderListResponse, ProviderResponse, BookingResponse,
    ReviewResponse, ChatResponse, SearchRequest, SearchResponse, BookingCreate,
    ReviewCreate, ChatCreate, UserCreate, UserResponse, OTPRequest, OTPVerify,
    TokenResponse, CustomerDashboard, ProviderDashboard, AdminDashboard
)
from app.services import service

router = APIRouter()


# ================== Categories ==================

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    """Get all service categories"""
    categories = await service.get_categories(db)
    return categories


@router.get("/categories/{slug}", response_model=CategoryResponse)
async def get_category(slug: str, db: AsyncSession = Depends(get_db)):
    """Get category by slug"""
    category = await service.get_category_by_slug(db, slug)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


# ================== Providers ==================

@router.get("/providers", response_model=SearchResponse)
async def get_providers(
    category: Optional[str] = None,
    city: Optional[str] = None,
    min_rating: Optional[float] = None,
    verified_only: bool = False,
    sort_by: str = Query("rating", regex="^(rating|price)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get providers with filters"""
    result = await service.get_providers(
        db,
        category=category,
        city=city,
        min_rating=min_rating,
        verified_only=verified_only,
        sort_by=sort_by,
        page=page,
        limit=limit
    )
    return result


@router.get("/providers/{provider_id}", response_model=ProviderResponse)
async def get_provider(provider_id: int, db: AsyncSession = Depends(get_db)):
    """Get provider by ID"""
    provider = await service.get_provider_by_id(db, provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider


@router.get("/providers/{provider_id}/reviews", response_model=List[ReviewResponse])
async def get_provider_reviews(provider_id: int, db: AsyncSession = Depends(get_db)):
    """Get provider reviews"""
    reviews = await service.get_provider_reviews(db, provider_id)
    return reviews


# ================== Search ==================

@router.post("/search", response_model=SearchResponse)
async def search_providers(search: SearchRequest, db: AsyncSession = Depends(get_db)):
    """AI-powered search for providers"""
    result = await service.search_providers(
        db,
        query=search.query,
        category=search.category,
        city=search.city,
        min_price=search.min_price,
        max_price=search.max_price,
        min_rating=search.min_rating,
        verified_only=search.verified_only,
        page=search.page,
        limit=search.limit
    )
    return result


# ================== Bookings ==================

@router.post("/bookings", response_model=BookingResponse)
async def create_booking(booking: BookingCreate, db: AsyncSession = Depends(get_db), customer_id: int = 100):
    """Create a new booking"""
    booking_data = {
        "customer_id": customer_id,
        "provider_id": booking.provider_id,
        "service": booking.service,
        "description": booking.description,
        "scheduled_date": booking.scheduled_date,
        "scheduled_time": booking.scheduled_time,
        "address": booking.address,
        "city": booking.city,
        "notes": booking.notes,
        "estimated_price": 0
    }
    result = await service.create_booking(db, booking_data)
    return result


@router.get("/bookings", response_model=List[BookingResponse])
async def get_bookings(db: AsyncSession = Depends(get_db), user_id: int = 100, role: str = "customer"):
    """Get user bookings"""
    bookings = await service.get_bookings(db, user_id, role)
    return bookings


@router.put("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(booking_id: int, status: str = None, db: AsyncSession = Depends(get_db)):
    """Update booking status"""
    update_data = {}
    if status:
        update_data["status"] = status
    result = await service.update_booking(db, booking_id, update_data)
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")
    return result


# ================== Reviews ==================

@router.post("/reviews", response_model=ReviewResponse)
async def create_review(review: ReviewCreate, db: AsyncSession = Depends(get_db), user_id: int = 100):
    """Create a new review"""
    review_data = {
        "booking_id": review.booking_id,
        "provider_id": review.provider_id,
        "user_id": user_id,
        "rating": review.rating,
        "comment": review.comment,
        "photos": review.photos
    }
    result = await service.create_review(db, review_data)
    return result


# ================== Chat ==================

@router.post("/chats", response_model=ChatResponse)
async def create_chat(chat: ChatCreate, db: AsyncSession = Depends(get_db), sender_id: int = 100):
    """Send a chat message"""
    chat_data = {
        "booking_id": chat.booking_id,
        "sender_id": sender_id,
        "message": chat.message,
        "message_type": chat.message_type
    }
    result = await service.create_chat(db, chat_data)
    return result


@router.get("/chats/{booking_id}", response_model=List[ChatResponse])
async def get_chats(booking_id: int, db: AsyncSession = Depends(get_db)):
    """Get chat messages for a booking"""
    chats = await service.get_chats(db, booking_id)
    return chats


# ================== Auth ==================

@router.post("/auth/otp/send")
async def send_otp(request: OTPRequest, db: AsyncSession = Depends(get_db)):
    """Send OTP to phone number"""
    import random
    otp = str(random.randint(100000, 999999))
    await service.store_otp(db, request.phone, otp)
    # In production, this would send via SMS
    return {"message": "OTP sent successfully", "otp": otp}  # Remove OTP in production


@router.post("/auth/otp/verify", response_model=TokenResponse)
async def verify_otp(request: OTPVerify, db: AsyncSession = Depends(get_db)):
    """Verify OTP and return token"""
    if not await service.verify_otp(db, request.phone, request.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Create or get user
    user = await service.get_user_by_phone(db, request.phone)
    if not user:
        # Create mock user for now if not exists
        user = await service.create_user(db, {
            "name": "User " + request.phone[-4:],
            "phone": request.phone,
            "role": "customer",
            "is_verified": True
        })

    return TokenResponse(
        access_token="mock_token_" + request.phone,
        user=user
    )


# ================== Dashboard ==================

@router.get("/dashboard/customer", response_model=CustomerDashboard)
async def get_customer_dashboard(db: AsyncSession = Depends(get_db), user_id: int = 100):
    """Get customer dashboard data"""
    stats = await service.get_dashboard_stats(db, user_id, "customer")
    return stats


@router.get("/dashboard/provider", response_model=ProviderDashboard)
async def get_provider_dashboard(db: AsyncSession = Depends(get_db), user_id: int = 100):
    """Get provider dashboard data"""
    stats = await service.get_dashboard_stats(db, user_id, "provider")
    return stats


@router.get("/dashboard/admin", response_model=AdminDashboard)
async def get_admin_dashboard(db: AsyncSession = Depends(get_db)):
    """Get admin dashboard data"""
    stats = await service.get_admin_stats(db)
    return stats


# ================== Health Check ==================

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Sehat & Service API"}