from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class ProviderService(Base):
    __tablename__ = "provider_services"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), index=True)
    name = Column(String(200), nullable=False)
    name_urdu = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    description_urdu = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    is_negotiable = Column(Boolean, default=True)
    duration_minutes = Column(Integer, nullable=True)
    category = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(20), default="active")  # active, pending, inactive
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    provider = relationship("Provider", back_populates="services")


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
    
    # Advanced Business Fields
    business_name = Column(String(255), nullable=True)
    business_reg_number = Column(String(100), nullable=True)
    bank_name = Column(String(100), nullable=True)
    account_holder = Column(String(255), nullable=True)
    account_number = Column(String(100), nullable=True)
    jazzcash_number = Column(String(20), nullable=True)
    easypaisa_number = Column(String(20), nullable=True)
    
    is_approved = Column(Boolean, default=False)
    status = Column(String(20), default="pending")  # pending, approved, suspended
    response_time = Column(String(50), nullable=True)
    availability = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="provider_profile")
    bookings = relationship("Booking", back_populates="provider")
    reviews = relationship("Review", back_populates="provider")
    services = relationship("ProviderService", back_populates="provider")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"))
    provider_id = Column(Integer, ForeignKey("providers.id"))
    service_id = Column(Integer, ForeignKey("provider_services.id"), nullable=True)
    service = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), default=BookingStatus.PENDING.value)
    scheduled_date = Column(DateTime, nullable=True)
    scheduled_time = Column(String(20), nullable=True)
    address = Column(Text, nullable=False)
    city = Column(String(100), nullable=True)
    price = Column(Float, default=0)
    estimated_price = Column(Float, default=0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="bookings", foreign_keys=[customer_id])
    provider = relationship("Provider", back_populates="bookings")
    provider_service = relationship("ProviderService")
    reviews = relationship("Review", back_populates="booking")
    chats = relationship("Chat", back_populates="booking")


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