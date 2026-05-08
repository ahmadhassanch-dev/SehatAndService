# Sehat & Service - Pakistani Hyperlocal Services Marketplace

## Project Overview

**Project Name:** Sehat & Service (سیہت اینڈ سروس)
**Type:** Full-stack Web Application (Next.js + FastAPI)
**Core Functionality:** A mobile-first Pakistani marketplace connecting users with verified local service providers for home services, repairs, and professional help.
**Target Users:** Pakistani consumers seeking local services, service providers looking for customers, and administrators managing the platform.

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** React Context + Zustand
- **Icons:** Lucide React
- **Language:** TypeScript

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL (simulated with in-memory for MVP)
- **Cache:** Redis (simulated for MVP)
- **Authentication:** JWT + OTP
- **Language:** Python

---

## UI/UX Specification

### Design Philosophy
- Clean, modern, highly trusted Pakistani-friendly design
- Mobile-first responsive layout
- Fast loading on low internet
- Soft cards, rounded corners, clear icons
- Strong search-first interface

### Color Palette
```css
--primary: #0F766E (Teal - trust, reliability)
--primary-light: #14B8A6
--primary-dark: #0D5D56
--secondary: #F59E0B (Amber - warmth, action)
--secondary-light: #FBBF24
--accent: #DC2626 (Red - emergency, urgency)
--background: #F8FAFC (Light gray)
--surface: #FFFFFF (White)
--text-primary: #1E293B (Dark slate)
--text-secondary: #64748B (Slate)
--text-muted: #94A3B8
--success: #10B981 (Green)
--warning: #F59E0B (Amber)
--error: #EF4444 (Red)
--border: #E2E8F0
```

### Typography
- **Primary Font:** "Plus Jakarta Sans" (English)
- **Urdu Font:** "Noto Nastaliq Urdu" (Urdu)
- **Headings:** Bold, 700 weight
- **Body:** Regular, 400 weight
- **Sizes:** 
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### Spacing System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Effects
- Border radius: 8px (cards), 12px (buttons), 16px (modals)
- Shadows: 
  - sm: 0 1px 2px rgba(0,0,0,0.05)
  - md: 0 4px 6px rgba(0,0,0,0.1)
  - lg: 0 10px 15px rgba(0,0,0,0.1)
- Transitions: 200ms ease-in-out

---

## Page Structure

### 1. Home Page (/)
- Hero section with large search bar
- AI-powered natural language search
- Location selector (city dropdown)
- Service category cards (12 categories)
- "How it works" section (3 steps)
- Top-rated providers carousel
- Nearby services section
- Emergency/urgent help banner
- Testimonials section
- Trust badges section
- FAQs accordion
- Footer with links

### 2. Service Category Page (/services/[category])
- Category header with image
- Subcategory filters
- Provider listing grid
- Sort by rating/price/distance
- Map view toggle

### 3. Search Results Page (/search)
- Search query display
- Filter sidebar (price, rating, availability)
- Provider cards with key info
- Pagination

### 4. Provider Profile Page (/provider/[id])
- Provider photo and name
- Verified badge
- Rating and reviews count
- Service description
- Pricing packages
- Availability calendar
- Book now button
- Call/WhatsApp/Chat buttons
- Reviews section
- Similar providers

### 5. Booking Page (/book/[providerId])
- Provider summary
- Service selection
- Date/time picker
- Address input
- Problem description
- Price estimate
- Confirm booking

### 6. Chat Page (/chat/[bookingId])
- Chat interface
- Message bubbles
- Image sharing
- Location sharing
- Booking status updates

### 7. Reviews Page (/reviews/[providerId])
- Provider info header
- Review filters
- Review cards with ratings
- Write review form

### 8. Login/Signup Page (/auth/login, /auth/signup)
- Phone/Email input
- OTP verification
- Google signup
- Role selection (Customer/Provider)

### 9. Customer Dashboard (/dashboard)
- Active bookings
- Booking history
- Saved providers
- Wallet balance
- Profile settings
- Language toggle

### 10. Provider Dashboard (/provider/dashboard)
- Pending bookings
- Accepted bookings
- Earnings summary
- Availability calendar
- Service management
- Profile settings

### 11. Admin Dashboard (/admin)
- User statistics
- Provider approvals
- Booking analytics
- Revenue charts
- Category management
- Review moderation
- Complaint handling

### 12. Static Pages
- /about - About us
- /contact - Contact form
- /faq - FAQ page
- /terms - Terms of service
- /privacy - Privacy policy
- /support - Support page

---

## Core Features

### Authentication
- Phone number + OTP login
- Email + password login
- Google OAuth
- JWT token management
- Role-based access (Customer, Provider, Admin)

### Search & Discovery
- Natural language search ("AC not cooling")
- Category-based browsing
- Location-based filtering
- Rating/price sorting
- AI-powered suggestions

### Booking System
- Instant booking
- Schedule booking
- Booking status tracking
- Cancellation/reschedule
- Invoice generation

### Communication
- In-app chat
- WhatsApp integration
- Call button
- Push notifications

### Reviews & Ratings
- Star ratings (1-5)
- Written reviews
- Photo reviews
- Review moderation

### Provider Verification
- Phone verification
- CNIC upload
- Document verification
- Badge system

### Admin Features
- User management
- Provider approval
- Category management
- Analytics dashboard
- Content management

---

## Service Categories

1. **AC Repair** (اے سی مرمت)
2. **Plumbing** (پلمبنگ)
3. **Electrician** (الیکٹریشین)
4. **Carpenter** (کارپینٹر)
5. **Appliance Repair** (ایپلائنس مرمت)
6. **Cleaning** (کلیننگ)
7. **Moving** (موونگ)
8. **Tutoring** (ٹیوشن)
9. **Beauty** (بیوٹی)
10. **Tech Help** (ٹیک ہیلپ)
11. **Home Security** (ہوم سیکیورٹی)
12. **Other Services** (دیگر خدمات)

---

## Data Models

### User
- id, name, email, phone, role, photo, created_at

### Provider
- id, user_id, category, subcategory, bio, city, service_areas, pricing, rating, verified, availability

### Booking
- id, customer_id, provider_id, service, status, date, address, price, notes

### Review
- id, booking_id, rating, comment, photos, created_at

### Chat
- id, booking_id, sender_id, message, created_at

---

## Acceptance Criteria

1. ✅ Homepage loads with search bar and category cards
2. ✅ Search returns relevant providers
3. ✅ Provider profile shows all information
4. ✅ Booking flow works end-to-end
5. ✅ Chat functionality works
6. ✅ Reviews can be viewed and submitted
7. ✅ Login/signup works with OTP
8. ✅ Customer dashboard shows bookings
9. ✅ Provider dashboard shows earnings
10. ✅ Admin dashboard shows analytics
11. ✅ Mobile responsive on all pages
12. ✅ Urdu/English language toggle works
13. ✅ Fast loading on low internet
14. ✅ Trust badges and verification visible

---

## File Structure

```
patanai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   ├── package.json
│   └── tailwind.config.ts
└── README.md