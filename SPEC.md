# Sehat & Service - Project Specification

## Project overview

Sehat & Service is a hyperlocal Pakistani services marketplace connecting customers with local providers for home repairs, maintenance, and professional services.

### Goals
- Enable customers to search, compare, and book local providers
- Provide provider profiles, ratings, and availability
- Support customer, provider, and admin roles
- Use a modern frontend with Next.js and a FastAPI backend

### Current implementation status
- Frontend pages and routes scaffolded in Next.js 14
- FastAPI backend routes implemented for search, categories, providers, bookings, chat, reviews, and OTP auth
- Demo OTP flow returns the OTP value in API response for local testing
- Persisted user signup is currently simulated

---

## Technology stack

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- React Context

### Backend
- FastAPI
- SQLAlchemy async models
- Pydantic validation
- JWT + OTP authentication structure
- PostgreSQL-compatible database configuration

---

## User roles

- Customer
- Provider
- Admin

---

## Core functional areas

### Search
- Provider search by category, city, rating, and query
- Search results page and filters

### Booking
- Booking creation and update flow
- Booking status lifecycle
- Booking details and provider matching

### Authentication
- OTP-based login flow
- Demo OTP sending and verification
- JWT session tokens for authenticated routes

### Provider features
- Provider profile pages
- Provider availability and booking acceptance
- Provider dashboard views

### Customer features
- Customer dashboard
- Booking history
- Review submission
- Saved locations

### Admin features
- Admin dashboard overview
- Platform metrics and analytics

---

## API endpoints

### Authentication
- POST /api/v1/auth/otp/send
- POST /api/v1/auth/otp/verify

### Categories
- GET /api/v1/categories
- GET /api/v1/categories/{slug}

### Providers
- GET /api/v1/providers
- GET /api/v1/providers/{id}
- GET /api/v1/providers/{id}/reviews

### Search
- POST /api/v1/search

### Bookings
- POST /api/v1/bookings
- GET /api/v1/bookings
- PUT /api/v1/bookings/{id}

### Dashboards
- GET /api/v1/dashboard/customer
- GET /api/v1/dashboard/provider
- GET /api/v1/dashboard/admin

---

## Notes

- The current repo is suitable for local review and documentation.
- Production readiness requires real OTP delivery, user persistence, payment integration, and deployment configuration.
