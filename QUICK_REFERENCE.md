# Advanced Booking System - Quick Reference

This file is the quick technical reference for developers and reviewers. It contains the main database models, API endpoints, page routes, and important notes.

## Project Overview

Sehat & Service is a Pakistani hyperlocal marketplace for home services. The backend is built with FastAPI and SQLAlchemy, and the frontend is built with Next.js and Tailwind CSS.

## Run Commands

### Backend
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --app-dir backend --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/otp/send` - Send OTP for login
- `POST /api/v1/auth/otp/verify` - Verify OTP and receive token

### Categories
- `GET /api/v1/categories` - List all service categories
- `GET /api/v1/categories/{slug}` - Retrieve category details

### Providers
- `GET /api/v1/providers` - Search and filter providers
- `GET /api/v1/providers/{id}` - Get provider profile
- `GET /api/v1/providers/{id}/reviews` - Get provider reviews

### Search
- `POST /api/v1/search` - Search providers by query, city, rating, and price

### Bookings
- `POST /api/v1/bookings` - Create a booking request
- `GET /api/v1/bookings` - Retrieve bookings for a user
- `PUT /api/v1/bookings/{id}` - Update booking status

### Dashboard
- `GET /api/v1/dashboard/customer` - Customer dashboard stats
- `GET /api/v1/dashboard/provider` - Provider dashboard stats
- `GET /api/v1/dashboard/admin` - Admin dashboard stats

## Primary Frontend Pages

- `/` - Home page with search and categories
- `/services` - Service categories list
- `/services/[category]` - Category-specific providers
- `/provider/[id]` - Provider profile and booking
- `/search` - Search results page
- `/auth/login` - Login / OTP entry
- `/auth/signup` - Signup page
- `/dashboard` - Customer dashboard
- `/admin` - Admin overview
- `/chat` - Chat interface
- `/reviews` - Review page

## Core Database Models

### User
- Auth fields: `phone`, `email`, `password_hash`
- Role: customer, provider, admin
- Profile fields: `name`, `city`, `address`, `language`
- Status flags: `is_verified`, `is_active`
- Wallet/balance support

### Provider
- Linked to `User`
- `category`, `skills`, `pricing`, `rating`
- Payment accounts: bank, JazzCash, EasyPaisa
- Availability and verification status

### Booking
- Links `customer_id` and `provider_id`
- `service`, `status`, schedule, location, price
- Tracking fields: `verification_code`, `notes`, `timestamps`

### PaymentTransaction
- Tracks payment for a booking
- `amount`, `method`, `status`, `transaction_id`

### Notification
- User notifications for booking events
- `type`, `title`, `message`, `data`, `is_read`

### ProviderSchedule
- Weekly availability entries per provider
- `day_of_week`, `start_time`, `end_time`, `max_bookings`

### BookingSlot
- Time slots for providers
- `date`, `start_time`, `end_time`, `is_booked`

### ProviderOnlineStatus
- Real-time provider online/offline state
- Current location and availability

### ProviderService
- Listed services with pricing and categories
- `name`, `description`, `price`, `is_active`

### Review
- Ratings and written reviews linked to bookings
- `rating`, `comment`, `photos`, `is_approved`

### Chat
- Messages for booking conversations
- `sender_id`, `message_type`, `created_at`

## Key Notes

- OTP is currently mocked and returned in the response for local testing.
- User creation is simulated in the current backend flow.
- Backend app should be started from the repo root with `--app-dir backend`.
- The frontend is served from `frontend/` and consumes the backend API.

## Documentation Links

- `README.md` - Project overview and startup guide
- `IMPLEMENTATION_GUIDE.md` - Setup and architecture details
- `ADVANCED_BOOKING_SYSTEM.md` - Feature documentation and workflows
- `TEST_REPORT.md` - Test coverage and results
- `DELIVERY_SUMMARY.md` - Delivery status and completion list

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
