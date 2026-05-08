from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional, List
from app.schemas.schemas import (
    CategoryResponse, ProviderListResponse, ProviderResponse, BookingResponse,
    ReviewResponse, ChatResponse, SearchRequest, SearchResponse, BookingCreate,
    ReviewCreate, ChatCreate, UserCreate, UserResponse, OTPRequest, OTPVerify,
    TokenResponse, CustomerDashboard, ProviderDashboard, AdminDashboard,
    ProviderServiceResponse, ProviderServiceCreate, ProviderServiceUpdate,
    ProviderCreate, ProviderUpdate, AdvancedBookingCreate, AdvancedSearchRequest,
    AdvancedSearchResponse, ProviderWithAvailabilityResponse, LocationCreate,
    LocationResponse, PaymentTransactionCreate, PaymentTransactionResponse,
    NotificationResponse, ProviderScheduleCreate, ProviderScheduleResponse,
    BookingSlotResponse, ProviderOnlineStatusResponse
)
from app.services import service

router = APIRouter()


# ================== Categories ==================

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    """Get all service categories"""
    categories = service.get_categories()
    return categories


@router.get("/categories/{slug}", response_model=CategoryResponse)
async def get_category(slug: str):
    """Get category by slug"""
    category = service.get_category_by_slug(slug)
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
    limit: int = Query(20, ge=1, le=100)
):
    """Get providers with filters"""
    result = service.get_providers(
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
async def get_provider(provider_id: int):
    """Get provider by ID"""
    provider = service.get_provider_by_id(provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider


@router.get("/providers/{provider_id}/reviews", response_model=List[ReviewResponse])
async def get_provider_reviews(provider_id: int):
    """Get provider reviews"""
    reviews = service.get_provider_reviews(provider_id)
    return reviews


# ================== Search ==================

@router.post("/search", response_model=SearchResponse)
async def search_providers(search: SearchRequest):
    """AI-powered search for providers"""
    providers = service.search_providers(
        query=search.query,
        category=search.category,
        city=search.city
    )
    
    # Apply additional filters
    if search.min_price:
        providers = [p for p in providers if p.get("price_max", 0) >= search.min_price]
    if search.max_price:
        providers = [p for p in providers if p.get("price_min", 0) <= search.max_price]
    if search.min_rating:
        providers = [p for p in providers if p.get("rating", 0) >= search.min_rating]
    if search.verified_only:
        providers = [p for p in providers if p.get("verified")]
    
    # Pagination
    total = len(providers)
    start = (search.page - 1) * search.limit
    end = start + search.limit
    providers_page = providers[start:end]
    
    return {
        "providers": providers_page,
        "total": total,
        "page": search.page,
        "total_pages": (total + search.limit - 1) // search.limit
    }


# ================== Bookings ==================

@router.post("/bookings", response_model=BookingResponse)
async def create_booking(booking: BookingCreate, customer_id: int = 100):
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
    result = service.create_booking(booking_data)
    return result


@router.get("/bookings", response_model=List[BookingResponse])
async def get_bookings(user_id: int = 100, role: str = "customer"):
    """Get user bookings"""
    bookings = service.get_bookings(user_id, role)
    return bookings


@router.put("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(booking_id: int, status: str = None):
    """Update booking status"""
    update_data = {}
    if status:
        update_data["status"] = status
    result = service.update_booking(booking_id, update_data)
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")
    return result


# ================== Reviews ==================

@router.post("/reviews", response_model=ReviewResponse)
async def create_review(review: ReviewCreate, user_id: int = 100):
    """Create a new review"""
    review_data = {
        "booking_id": review.booking_id,
        "provider_id": review.provider_id,
        "user_id": user_id,
        "rating": review.rating,
        "comment": review.comment,
        "photos": review.photos
    }
    result = service.create_review(review_data)
    return result


# ================== Chat ==================

@router.post("/chats", response_model=ChatResponse)
async def create_chat(chat: ChatCreate, sender_id: int = 100):
    """Send a chat message"""
    chat_data = {
        "booking_id": chat.booking_id,
        "sender_id": sender_id,
        "message": chat.message,
        "message_type": chat.message_type
    }
    result = service.create_chat(chat_data)
    return result


@router.get("/chats/{booking_id}", response_model=List[ChatResponse])
async def get_chats(booking_id: int):
    """Get chat messages for a booking"""
    chats = service.get_chats(booking_id)
    return chats


# ================== Auth ==================

@router.post("/auth/otp/send")
async def send_otp(request: OTPRequest):
    """Send OTP to phone number"""
    import random
    otp = str(random.randint(100000, 999999))
    service.store_otp(request.phone, otp)
    # In production, this would send via SMS
    return {"message": "OTP sent successfully", "otp": otp}  # Remove OTP in production


@router.post("/auth/otp/verify", response_model=TokenResponse)
async def verify_otp(request: OTPVerify):
    """Verify OTP and return token"""
    if not service.verify_otp(request.phone, request.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Create mock user response
    user = UserResponse(
        id=100,
        name="Demo User",
        phone=request.phone,
        email="user@example.com",
        role="customer",
        city="Lahore",
        language="en",
        is_verified=True,
        is_active=True,
        created_at=None
    )
    
    return TokenResponse(
        access_token="mock_token_" + request.phone,
        user=user
    )


# ================== Dashboard ==================

@router.get("/dashboard/customer", response_model=CustomerDashboard)
async def get_customer_dashboard(user_id: int = 100):
    """Get customer dashboard data"""
    stats = service.get_dashboard_stats(user_id, "customer")
    return stats


@router.get("/dashboard/provider", response_model=ProviderDashboard)
async def get_provider_dashboard(user_id: int = 100):
    """Get provider dashboard data"""
    stats = service.get_dashboard_stats(user_id, "provider")
    return stats


@router.get("/dashboard/admin", response_model=AdminDashboard)
async def get_admin_dashboard():
    """Get admin dashboard data"""
    stats = service.get_admin_stats()
    return stats


# ================== Advanced Booking System Endpoints ==================

@router.post("/locations", response_model=LocationResponse)
async def create_user_location(
    location: LocationCreate, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_any_user)
):
    """Create or update user location"""
    result = await service.create_location(db, current_user.id, location.dict())
    return result


@router.get("/locations", response_model=List[LocationResponse])
async def get_user_locations(
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_any_user)
):
    """Get user locations"""
    locations = await service.get_user_locations(db, current_user.id)
    return locations


@router.post("/bookings/advanced", response_model=BookingResponse)
async def create_advanced_booking(
    booking: AdvancedBookingCreate, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_any_user)
):
    """Create an advanced booking with location and payment preferences"""
    result = await service.create_advanced_booking(db, booking, current_user.id)
    return result


@router.post("/search/advanced", response_model=AdvancedSearchResponse)
async def advanced_search_providers(
    search: AdvancedSearchRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_any_user)
):
    """Advanced search for providers with location, availability, and filtering"""
    # Get user location if available
    user_location = None
    if search.latitude and search.longitude:
        user_location = (search.latitude, search.longitude)
    
    result = await service.advanced_search_providers(
        db, search, 
        user_lat=user_location[0] if user_location else None,
        user_lng=user_location[1] if user_location else None
    )
    return result


@router.get("/bookings/{booking_id}/details", response_model=BookingResponse)
async def get_booking_details(
    booking_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_any_user)
):
    """Get detailed booking information with all related data"""
    booking = await service.get_booking_with_details(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check if user has access to this booking
    if (current_user.role == "customer" and booking.customer_id != current_user.id) or \
       (current_user.role == "provider" and booking.provider.user_id != current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    return booking


@router.put("/bookings/{booking_id}/status")
async def update_booking_status(
    booking_id: int,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_any_user)
):
    """Update booking status with notifications"""
    # Validate status
    valid_statuses = [s.value for s in BookingStatus]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await service.update_booking_status_with_notifications(
        db, booking_id, status, current_user.id
    )
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {"message": "Booking status updated successfully"}


@router.post("/payments", response_model=PaymentTransactionResponse)
async def create_payment_transaction(
    booking_id: int,
    transaction: PaymentTransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_any_user)
):
    """Create a payment transaction"""
    # Verify booking belongs to user
    booking = await db.get(Booking, booking_id)
    if not booking or booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    result = await service.create_payment_transaction(db, booking_id, transaction.dict())
    return result


@router.get("/notifications", response_model=List[NotificationResponse])
async def get_user_notifications(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_any_user)
):
    """Get user notifications"""
    notifications = await service.get_user_notifications(db, current_user.id, limit)
    return notifications


@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_any_user)
):
    """Mark notification as read"""
    # Verify notification belongs to user
    notification = await db.get(Notification, notification_id)
    if not notification or notification.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    success = await service.mark_notification_read(db, notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"message": "Notification marked as read"}


@router.post("/providers/{provider_id}/schedule", response_model=List[ProviderScheduleResponse])
async def create_provider_schedule(
    provider_id: int,
    schedule: List[ProviderScheduleCreate],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_provider)
):
    """Create or update provider schedule"""
    # Verify provider ownership
    provider = await db.get(Provider, provider_id)
    if not provider or provider.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    schedule_data = [item.dict() for item in schedule]
    result = await service.create_provider_schedule(db, provider_id, schedule_data)
    return result


@router.get("/providers/{provider_id}/schedule", response_model=List[ProviderScheduleResponse])
async def get_provider_schedule(
    provider_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get provider schedule"""
    schedule = await service.get_provider_schedule(db, provider_id)
    return schedule


@router.put("/providers/status")
async def update_provider_online_status(
    status: str,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_provider)
):
    """Update provider online status and location"""
    # Get provider profile
    provider = await service.get_provider_by_user_id(db, current_user.id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    
    status_data = {
        "status": status,
        "is_available_for_booking": status == "online"
    }
    
    if latitude and longitude:
        status_data.update({
            "current_location_lat": latitude,
            "current_location_lng": longitude
        })
    
    result = await service.update_provider_online_status(db, provider.id, status_data)
    return {"message": "Status updated successfully", "status": result.status}


@router.get("/providers/{provider_id}/slots")
async def get_provider_available_slots(
    provider_id: int,
    date: str,  # YYYY-MM-DD format
    db: AsyncSession = Depends(get_db)
):
    """Get available booking slots for a provider on a specific date"""
    try:
        slot_date = datetime.fromisoformat(date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    slots = await service.get_available_slots(db, provider_id, slot_date)
    return [BookingSlotResponse.from_orm(slot) for slot in slots]


# ================== Health Check ==================

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Sehat & Service API"}