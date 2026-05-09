from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    PROVIDER = "provider"
    ADMIN = "admin"


class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    ON_WAY = "on_way"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(20), default=UserRole.CUSTOMER.value)
    photo = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    provider_profile = relationship("Provider", back_populates="user", uselist=False)
    bookings = relationship("Booking", back_populates="customer")
    reviews = relationship("Review", back_populates="user")
    locations = relationship("Location", back_populates="user")


class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)  # JSON string
    service_areas = Column(Text, nullable=True)  # JSON string
    pricing = Column(String(100), nullable=True)
    price_min = Column(Float, default=0)
    price_max = Column(Float, default=0)
    rating = Column(Float, default=0)
    review_count = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    cnic = Column(String(20), nullable=True)
    is_approved = Column(Boolean, default=False)
    response_time = Column(String(50), nullable=True)
    availability = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="provider_profile")
    bookings = relationship("Booking", back_populates="provider")
    reviews = relationship("Review", back_populates="provider")
    services = relationship("ProviderService", back_populates="provider")
    online_status = relationship("ProviderOnlineStatus", back_populates="provider", uselist=False)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"))
    provider_id = Column(Integer, ForeignKey("providers.id"))
    service = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), default=BookingStatus.PENDING.value)
    scheduled_date = Column(DateTime, nullable=True)
    scheduled_time = Column(String(20), nullable=True)
    address = Column(Text, nullable=False)
    city = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    price = Column(Float, default=0)
    estimated_price = Column(Float, default=0)
    diagnostic_fee = Column(Float, default=0)
    verification_code = Column(String(20), nullable=True)
    payment_method = Column(String(50), nullable=True)
    service_id = Column(Integer, ForeignKey("provider_services.id"), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="bookings", foreign_keys=[customer_id])
    provider = relationship("Provider", back_populates="bookings")
    reviews = relationship("Review", back_populates="booking")
    chats = relationship("Chat", back_populates="booking")
    transactions = relationship("PaymentTransaction", back_populates="booking")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    provider_id = Column(Integer, ForeignKey("providers.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    photos = Column(Text, nullable=True)  # JSON string
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    booking = relationship("Booking", back_populates="reviews")
    provider = relationship("Provider", back_populates="reviews")
    user = relationship("User", back_populates="reviews")


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text, nullable=False)
    message_type = Column(String(20), default="text")  # text, image, location
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    booking = relationship("Booking", back_populates="chats")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_urdu = Column(String(100), nullable=True)
    slug = Column(String(100), unique=True, index=True)
    icon = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=True)
    subject = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(20), default="pending")  # pending, resolved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)


class ProviderService(Base):
    __tablename__ = "provider_services"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"))
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, default=0)
    is_negotiable = Column(Boolean, default=False)
    duration_minutes = Column(Integer, nullable=True)
    category = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="active")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    provider = relationship("Provider", back_populates="services")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(100), nullable=True)
    area = Column(String(100), nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="locations")


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    amount = Column(Float, nullable=False)
    method = Column(String(50), nullable=False)
    status = Column(String(50), default="pending")
    transaction_id = Column(String(200), nullable=True)
    payment_data = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    booking = relationship("Booking", back_populates="transactions")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    type = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    data = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ProviderSchedule(Base):
    __tablename__ = "provider_schedules"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"))
    day_of_week = Column(Integer, nullable=False)
    start_time = Column(String(20), nullable=False)
    end_time = Column(String(20), nullable=False)
    is_available = Column(Boolean, default=True)
    max_bookings = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)


class BookingSlot(Base):
    __tablename__ = "booking_slots"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"))
    date = Column(DateTime, nullable=False)
    start_time = Column(String(20), nullable=False)
    end_time = Column(String(20), nullable=False)
    is_booked = Column(Boolean, default=False)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ProviderOnlineStatus(Base):
    __tablename__ = "provider_online_status"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), unique=True)
    status = Column(String(50), default="offline")
    current_location_lat = Column(Float, nullable=True)
    current_location_lng = Column(Float, nullable=True)
    is_available_for_booking = Column(Boolean, default=False)
    last_seen = Column(DateTime, default=datetime.utcnow)

    provider = relationship("Provider", back_populates="online_status")
