from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    CUSTOMER = "customer"
    PROVIDER = "provider"
    ADMIN = "admin"


class BookingStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    ON_WAY = "on_way"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# ================== User Schemas ==================

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: Optional[EmailStr] = None
    phone: str = Field(..., min_length=10, max_length=20)
    city: Optional[str] = None
    language: str = "en"


class UserCreate(UserBase):
    password: Optional[str] = Field(None, min_length=6)
    role: UserRole = UserRole.CUSTOMER


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    photo: Optional[str] = None
    language: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: str
    photo: Optional[str] = None
    address: Optional[str] = None
    is_verified: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ================== Auth Schemas ==================

class OTPRequest(BaseModel):
    phone: str = Field(..., min_length=10)


class OTPVerify(BaseModel):
    phone: str = Field(..., min_length=10)
    otp: str = Field(..., min_length=6, max_length=6)


class LoginRequest(BaseModel):
    phone: str = Field(..., min_length=10)
    password: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ================== Provider Schemas ==================

class ProviderBase(BaseModel):
    category: str
    subcategory: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    service_areas: Optional[str] = None
    pricing: Optional[str] = None
    price_min: float = 0
    price_max: float = 0
    response_time: Optional[str] = None


class ProviderCreate(ProviderBase):
    pass


class ProviderUpdate(BaseModel):
    category: Optional[str] = None
    subcategory: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    service_areas: Optional[str] = None
    pricing: Optional[str] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    response_time: Optional[str] = None
    availability: Optional[str] = None
    cnic: Optional[str] = None


class ProviderResponse(ProviderBase):
    id: int
    user_id: int
    rating: float
    review_count: int
    verified: bool
    is_approved: bool
    availability: Optional[str] = None
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class ProviderListResponse(BaseModel):
    id: int
    category: str
    subcategory: Optional[str] = None
    bio: Optional[str] = None
    rating: float
    review_count: int
    verified: bool
    price_min: float
    price_max: float
    response_time: Optional[str] = None
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ================== Booking Schemas ==================

class BookingBase(BaseModel):
    service: str = Field(..., min_length=2)
    description: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    scheduled_time: Optional[str] = None
    address: str
    city: Optional[str] = None
    notes: Optional[str] = None


class BookingCreate(BookingBase):
    provider_id: int


class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    scheduled_date: Optional[datetime] = None
    scheduled_time: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    price: Optional[float] = None


class BookingResponse(BookingBase):
    id: int
    customer_id: int
    provider_id: int
    status: str
    price: float
    estimated_price: float
    created_at: datetime
    updated_at: datetime
    customer: Optional[UserResponse] = None
    provider: Optional[ProviderResponse] = None

    class Config:
        from_attributes = True


# ================== Review Schemas ==================

class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    photos: Optional[str] = None


class ReviewCreate(ReviewBase):
    booking_id: int
    provider_id: int


class ReviewResponse(ReviewBase):
    id: int
    booking_id: int
    provider_id: int
    user_id: int
    is_approved: bool
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ================== Chat Schemas ==================

class ChatBase(BaseModel):
    message: str = Field(..., min_length=1)
    message_type: str = "text"


class ChatCreate(ChatBase):
    booking_id: int


class ChatResponse(ChatBase):
    id: int
    booking_id: int
    sender_id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ================== Category Schemas ==================

class CategoryBase(BaseModel):
    name: str
    name_urdu: Optional[str] = None
    slug: str
    icon: Optional[str] = None
    description: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ================== Complaint Schemas ==================

class ComplaintBase(BaseModel):
    subject: str = Field(..., min_length=2)
    description: str = Field(..., min_length=10)


class ComplaintCreate(ComplaintBase):
    booking_id: Optional[int] = None
    provider_id: Optional[int] = None


class ComplaintResponse(ComplaintBase):
    id: int
    user_id: int
    booking_id: Optional[int] = None
    provider_id: Optional[int] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ================== Search Schemas ==================

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=2)
    category: Optional[str] = None
    city: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_rating: Optional[float] = None
    verified_only: bool = False
    sort_by: str = "rating"  # rating, price, distance
    page: int = 1
    limit: int = 20


class SearchResponse(BaseModel):
    providers: List[ProviderListResponse]
    total: int
    page: int
    total_pages: int


# ================== Dashboard Schemas ==================

class CustomerDashboard(BaseModel):
    active_bookings: List[BookingResponse]
    past_bookings: List[BookingResponse]
    saved_providers: List[ProviderListResponse]
    total_spent: float


class ProviderDashboard(BaseModel):
    pending_bookings: List[BookingResponse]
    accepted_bookings: List[BookingResponse]
    completed_bookings: List[BookingResponse]
    total_earnings: float
    average_rating: float


class AdminDashboard(BaseModel):
    total_users: int
    total_providers: int
    total_bookings: int
    total_revenue: float
    pending_providers: int
    pending_reviews: int
    open_complaints: int


class SearchLocation(BaseModel):
    lat: float
    lng: float
    radius_km: Optional[float] = None


class AdvancedSearchRequest(BaseModel):
    query: str = Field(..., min_length=2)
    category: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_km: Optional[float] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_rating: Optional[float] = None
    verified_only: bool = False
    sort_by: str = "rating"
    page: int = 1
    limit: int = 20


class ProviderWithAvailabilityResponse(ProviderResponse):
    distance_km: Optional[float] = None


class AdvancedSearchResponse(BaseModel):
    providers: List[ProviderWithAvailabilityResponse]
    total: int
    search_location: Optional[SearchLocation] = None


class AdvancedBookingCreate(BookingBase):
    provider_id: int
    service_id: Optional[int] = None
    payment_method: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_diagnostic_only: bool = False


class LocationCreate(BaseModel):
    latitude: float
    longitude: float
    address: str
    city: Optional[str] = None
    area: Optional[str] = None


class LocationResponse(LocationCreate):
    id: int
    user_id: int
    last_updated: datetime

    class Config:
        from_attributes = True


class PaymentTransactionCreate(BaseModel):
    amount: float
    method: str
    status: Optional[str] = "pending"
    transaction_id: Optional[str] = None
    payment_data: Optional[str] = None


class PaymentTransactionResponse(PaymentTransactionCreate):
    id: int
    booking_id: int
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    booking_id: Optional[int] = None
    type: str
    title: str
    message: str
    data: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ProviderScheduleCreate(BaseModel):
    day_of_week: int
    start_time: str
    end_time: str
    is_available: bool = True
    max_bookings: int = 1


class ProviderScheduleResponse(ProviderScheduleCreate):
    id: int
    provider_id: int

    class Config:
        from_attributes = True


class BookingSlotResponse(BaseModel):
    id: int
    provider_id: int
    date: datetime
    start_time: str
    end_time: str
    is_booked: bool
    booking_id: Optional[int] = None

    class Config:
        from_attributes = True


class ProviderOnlineStatusResponse(BaseModel):
    id: int
    provider_id: int
    status: str
    current_location_lat: Optional[float] = None
    current_location_lng: Optional[float] = None
    is_available_for_booking: bool
    last_seen: Optional[datetime] = None

    class Config:
        from_attributes = True
