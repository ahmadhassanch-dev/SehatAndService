# Advanced Booking System - Quick Reference Guide

## 🗄️ DATABASE SCHEMA

### 1. **User Table**
```
id (PK)
name
phone (unique)
email (unique)
password_hash
role (customer, provider, admin)
photo
city
address
is_verified
is_active
language (en, ur)
cancellation_count
wallet_balance
created_at
updated_at
```

### 2. **Provider Table**
```
id (PK)
user_id (FK to User)
category
subcategory
bio
skills (JSON)
service_areas (JSON)
pricing
price_min
price_max
rating
review_count
verified
cnic
business_name
diagnostic_fee
availability_mode (flexible, fixed)
bank_name
account_holder
account_number
jazzcash_number
easypaisa_number
is_approved
status (pending, approved, suspended)
response_time
created_at
updated_at
```

### 3. **Location Table**
```
id (PK)
user_id (FK to User)
latitude (decimal 10,8)
longitude (decimal 11,8)
address
city
area
last_updated
```

### 4. **Booking Table**
```
id (PK)
customer_id (FK to User)
provider_id (FK to Provider)
service_id (FK to ProviderService)
service
description
status (requested, pending, accepted, on_way, in_progress, completed, cancelled, rejected)
scheduled_date
scheduled_time
address
city
latitude
longitude
price
estimated_price
diagnostic_fee
is_diagnostic_only
verification_code
notes
created_at
updated_at
```

### 5. **PaymentTransaction Table**
```
id (PK)
booking_id (FK to Booking)
amount
method (cash, online, wallet, bank_transfer, jazzcash, easypaisa)
status (pending, completed, failed, refunded)
transaction_id
payment_data (JSON)
created_at
completed_at
```

### 6. **Notification Table**
```
id (PK)
user_id (FK to User)
booking_id (FK to Booking, nullable)
type (booking_request, booking_accepted, provider_on_way, service_completed, etc.)
title
message
data (JSON)
is_read
created_at
```

### 7. **ProviderSchedule Table**
```
id (PK)
provider_id (FK to Provider)
day_of_week (0-6)
start_time (HH:MM)
end_time (HH:MM)
is_available
max_bookings
created_at
```

### 8. **BookingSlot Table**
```
id (PK)
provider_id (FK to Provider)
date
start_time
end_time
is_booked
booking_id (FK to Booking, nullable)
created_at
```

### 9. **ProviderOnlineStatus Table**
```
id (PK)
provider_id (FK to Provider, unique)
status (online, offline, busy, on_break)
last_seen
current_location_lat (nullable)
current_location_lng (nullable)
is_available_for_booking
```

### 10. **ProviderService Table**
```
id (PK)
provider_id (FK to Provider)
name
name_urdu (nullable)
description
description_urdu (nullable)
price
is_negotiable
duration_minutes (nullable)
category
image_url
status (active, pending, inactive)
is_active
created_at
updated_at
```

### 11. **Review Table**
```
id (PK)
booking_id (FK to Booking)
provider_id (FK to Provider)
user_id (FK to User)
rating (1-5)
comment
photos (JSON array of URLs)
is_approved
created_at
```

### 12. **Chat Table**
```
id (PK)
booking_id (FK to Booking)
sender_id (FK to User)
message
message_type (text, image, location)
is_read
created_at
```

---

## 🔗 TABLE RELATIONSHIPS

```
User (1) ──┬─→ (Many) Provider
           ├─→ (Many) Booking (as customer_id)
           ├─→ (Many) Location
           ├─→ (Many) Notification
           └─→ (Many) Chat (as sender_id)

Provider (1) ──┬─→ (Many) Booking
              ├─→ (Many) ProviderService
              ├─→ (Many) ProviderSchedule
              ├─→ (Many) BookingSlot
              ├─→ (1) ProviderOnlineStatus
              ├─→ (Many) Review
              └─→ (Many) ProviderAvailability

Booking (1) ──┬─→ (1) User (customer)
             ├─→ (1) Provider
             ├─→ (Many) PaymentTransaction
             ├─→ (Many) Review
             ├─→ (1) BookingSlot
             └─→ (Many) Chat
```

---

## 📊 CORE ENUMS

### BookingStatus
- REQUESTED - Initial state
- PENDING - Approved, waiting for action
- ACCEPTED - Confirmed
- ON_WAY - Provider traveling
- IN_PROGRESS - Service being delivered
- COMPLETED - Done
- CANCELLED - Cancelled
- REJECTED - Provider declined

### UserRole
- CUSTOMER - Buyer
- PROVIDER - Seller
- ADMIN - Administrator

### PaymentMethod
- CASH - Pay after service
- ONLINE - Credit/Debit card
- WALLET - In-app wallet
- BANK_TRANSFER - Direct bank
- JAZZCASH - JazzCash mobile money
- EASYPaisa - EasyPaisa mobile money

### PaymentStatus
- PENDING - Awaiting payment
- COMPLETED - Paid
- FAILED - Payment failed
- REFUNDED - Refunded

### ProviderStatus
- OFFLINE - Not available
- ONLINE - Available for booking
- BUSY - Serving customer
- ON_BREAK - On break

### NotificationType
- BOOKING_REQUEST
- BOOKING_ACCEPTED
- BOOKING_REJECTED
- PROVIDER_ON_WAY
- SERVICE_STARTED
- SERVICE_COMPLETED
- PAYMENT_RECEIVED
- REVIEW_RECEIVED
- CHAT_MESSAGE

---

## 🔄 STATE TRANSITIONS

### Booking Status Flow
```
REQUESTED
    ↓
PENDING (Provider reviews)
    ├→ REJECTED (Provider declines)
    └→ ACCEPTED (Provider accepts)
         ↓
    ON_WAY (Provider travels)
         ↓
    IN_PROGRESS (Service begins)
         ├→ COMPLETED (Service done)
         └→ CANCELLED (Customer cancels)
```

### Provider Status Flow
```
OFFLINE ←→ ONLINE ←→ BUSY ←→ ON_BREAK
```

---

## 🎯 KEY FEATURES MAPPING

### Search & Discovery
- Query (text search): Provider.category, bio, skills
- Category filter: Provider.category
- City filter: User.city
- Rating filter: Provider.rating
- Price range: Provider.price_min, price_max
- Distance: Location coordinates
- Availability: ProviderSchedule, BookingSlot

### Booking Process
1. Search providers → Advanced search API
2. View details → Provider endpoint
3. Create booking → Advanced booking API with location
4. Provider accepts → Update status
5. Real-time tracking → Location updates
6. Complete → Verification code
7. Payment → Payment API
8. Review → Review API

### Payment Tracking
- Transaction record → PaymentTransaction
- Status history → PaymentStatus enum
- Refund tracking → RefundReason
- Wallet management → User.wallet_balance

### Quality Assurance
- Ratings → Provider.rating, Review.rating
- Review count → Provider.review_count
- Verified status → Provider.verified
- Response time → Provider.response_time
- Cancellation tracking → User.cancellation_count

### Real-time Features
- Online status → ProviderOnlineStatus
- Location tracking → Location table + real-time updates
- Notifications → Notification table
- Chat → Chat table
- Status updates → Booking.status

---

## 📱 API RESPONSE FORMATS

### Successful Response (2xx)
```json
{
  "id": 123,
  "status": "success",
  "data": {...},
  "timestamp": "2026-05-07T13:00:00Z"
}
```

### Error Response (4xx, 5xx)
```json
{
  "error": "Error title",
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-05-07T13:00:00Z"
}
```

### Pagination Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## 🔐 SECURITY RULES

### Authentication
- JWT tokens for authenticated requests
- Token expiry: 24 hours
- Refresh token mechanism

### Authorization
- Customers can only view their own bookings
- Providers can only view their bookings
- Admins have full access
- Role-based access control

### Data Protection
- Sensitive data encrypted
- Payment info tokenized
- Location data validated
- Phone number verification

---

## ⚡ PERFORMANCE OPTIMIZATION

### Indexes
```sql
CREATE INDEX idx_user_phone ON users(phone);
CREATE INDEX idx_user_city ON users(city);
CREATE INDEX idx_provider_category ON providers(category);
CREATE INDEX idx_provider_rating ON providers(rating DESC);
CREATE INDEX idx_booking_customer ON bookings(customer_id);
CREATE INDEX idx_booking_provider ON bookings(provider_id);
CREATE INDEX idx_booking_status ON bookings(status);
CREATE INDEX idx_location_user ON locations(user_id);
CREATE INDEX idx_location_coords ON locations(latitude, longitude);
CREATE INDEX idx_booking_date ON bookings(scheduled_date);
```

### Query Optimization
- Use connection pooling
- Cache provider ratings
- Batch notification processing
- Pagination for large datasets

---

## 📋 VALIDATION RULES

### User Inputs
- Phone: 10-20 digits, unique
- Email: Valid email format
- Password: Min 6 characters
- Name: 2-255 characters
- City: Valid city name

### Booking Inputs
- scheduled_date: Future date only
- address: Non-empty, max 500 chars
- description: Non-empty, max 2000 chars
- latitude: -90 to 90
- longitude: -180 to 180
- price: Positive number

### Location Inputs
- latitude: -90 to 90 (required)
- longitude: -180 to 180 (required)
- address: Non-empty (required)
- city: Non-empty (required)

---

## 🧪 TEST COVERAGE

### Unit Tests
- User creation ✅
- Provider creation ✅
- Booking status transitions ✅
- Payment processing ✅
- Notification delivery ✅

### Integration Tests
- Search with filters ✅
- Booking workflow ✅
- Payment flow ✅
- Notification chain ✅
- Review submission ✅

### Load Tests
- 1000+ concurrent users
- 100+ bookings/minute
- Database response time < 100ms

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-deployment
- [ ] Database migrations executed
- [ ] Environment variables configured
- [ ] Security keys generated
- [ ] Payment gateway configured
- [ ] SMS/Email service setup
- [ ] Backup strategy tested

### Deployment
- [ ] Run database migrations
- [ ] Start API server
- [ ] Start WebSocket server
- [ ] Verify all endpoints
- [ ] Load test system
- [ ] Monitor logs

### Post-deployment
- [ ] Health check monitoring
- [ ] Alert setup
- [ ] Performance monitoring
- [ ] Log aggregation
- [ ] Backup verification

---

## 📞 SUPPORT REFERENCES

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Booking not appearing | Check booking status, permissions |
| Location not updating | Verify GPS permissions, coordinates |
| Payment failed | Check payment method, balance |
| Notification delayed | Check notification queue, user settings |
| Provider offline | Update online status via API |

### Debug Commands
```bash
# Check system health
GET /api/v1/health

# View logs
tail -f /logs/api.log

# Database query
psql -d patanai -c "SELECT * FROM bookings LIMIT 10;"

# Test payment
POST /api/v1/payments/test
```

---

**Quick Reference v1.0** | Last Updated: May 7, 2026 | Production Ready
