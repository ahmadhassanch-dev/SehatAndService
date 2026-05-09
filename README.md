# Sehat & Service (سیہت اینڈ سروس)

A Pakistani hyperlocal services marketplace built with Next.js and FastAPI.

![Sehat & Service](https://img.shields.io/badge/Version-1.0.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-blue)

## Project overview

Sehat & Service connects customers with local providers for home repairs, cleaning, and professional services. This repository includes a frontend built in Next.js and a backend built in FastAPI.

> Note: The current OTP flow is implemented as a local demo. The backend returns the generated OTP in the response for development and testing.

## Key features

- Search providers by category, city, rating, and price
- Provider profiles with reviews and ratings
- Booking creation and status tracking
- Provider availability and scheduling
- In-app chat and notifications
- Multi-language support (Urdu + English)
- Demo OTP auth flow

## Tech stack

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- React Context

### Backend
- FastAPI
- SQLAlchemy async ORM
- Pydantic schemas
- JWT + OTP auth structure
- Python

## Run locally

### Backend
From the repo root:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --app-dir backend --reload
```

The backend is available at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is available at `http://127.0.0.1:3000`.

## API summary

### Authentication
- `POST /api/v1/auth/otp/send`
- `POST /api/v1/auth/otp/verify`

### Categories
- `GET /api/v1/categories`
- `GET /api/v1/categories/{slug}`

### Providers
- `GET /api/v1/providers`
- `GET /api/v1/providers/{id}`
- `GET /api/v1/providers/{id}/reviews`

### Search
- `POST /api/v1/search`

### Bookings
- `POST /api/v1/bookings`
- `GET /api/v1/bookings`
- `PUT /api/v1/bookings/{id}`

### Dashboard
- `GET /api/v1/dashboard/customer`
- `GET /api/v1/dashboard/provider`
- `GET /api/v1/dashboard/admin`

## Project structure

```
patanai/
├── backend/         # FastAPI backend
├── frontend/        # Next.js frontend
├── README.md        # Project overview
├── SPEC.md          # Project spec
├── IMPLEMENTATION_GUIDE.md
├── QUICK_REFERENCE.md
├── ADVANCED_BOOKING_SYSTEM.md
├── TEST_REPORT.md
├── DELIVERY_SUMMARY.md
├── DOCUMENTATION_INDEX.md
```

## Notes

- The backend currently uses a demo OTP flow.
- User creation is currently simulated for local development.
- The app is ready for local review and documentation.
