# Sehat & Service (سیہت اینڈ سروس)

A production-ready, mobile-first Pakistani hyperlocal services marketplace built with Next.js and FastAPI.

![Sehat & Service](https://img.shields.io/badge/Version-1.0.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-blue)

## 🌟 Features

- **AI-Powered Search**: Natural language search like "AC not cooling" or "need plumber near me"
- **Verified Providers**: Phone & CNIC verification system with trust badges
- **Multi-Language Support**: Urdu + English UI with easy language toggle
- **Mobile-First Design**: Optimized for low internet speeds in Pakistan
- **Multiple Payment Methods**: Cash on Delivery, JazzCash, EasyPaisa
- **WhatsApp Integration**: Direct chat with service providers
- **Real-time Booking**: Track booking status from pending to completed
- **Review System**: Star ratings and written reviews
- **Admin Dashboard**: Complete platform management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Custom Luxury Dark Theme)
- **State Management**: React Context API (Auth, Language)
- **Internationalization**: Custom `LanguageContext` (English & Urdu)
- **Network**: Custom `ApiClient` (Fetch-based with Auth Interceptors)
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with SQLAlchemy Async (asyncpg)
- **Architecture**: Service Layer Pattern (logic encapsulated in `app/services/`)
- **Validation**: Pydantic v2
- **Authentication**: JWT-based (simulated OTP verification flow)

## 📱 Service Categories

1. AC Repair (اے سی مرمت)
2. Plumbing (پلمبنگ)
3. Electrician (الیکٹریشین)
4. Carpenter (کارپینٹر)
5. Appliance Repair (ایپلائنس مرمت)
6. Cleaning (کلیننگ)
7. Moving (موونگ)
8. Tutoring (ٹیوشن)
9. Beauty (بیوٹی)
10. Tech Help (ٹیک ہیلپ)
11. Home Security (ہوم سیکیورٹی)
12. Other Services (دیگر خدمات)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## 📄 API Endpoints

### Categories
- `GET /api/v1/categories` - Get all service categories
- `GET /api/v1/categories/{slug}` - Get category by slug

### Providers
- `GET /api/v1/providers` - Get providers with filters
- `GET /api/v1/providers/{id}` - Get provider details
- `GET /api/v1/providers/{id}/reviews` - Get provider reviews

### Search
- `POST /api/v1/search` - AI-powered provider search

### Bookings
- `POST /api/v1/bookings` - Create new booking
- `GET /api/v1/bookings` - Get user bookings
- `PUT /api/v1/bookings/{id}` - Update booking status

### Auth
- `POST /api/v1/auth/otp/send` - Send OTP
- `POST /api/v1/auth/otp/verify` - Verify OTP

### Dashboard
- `GET /api/v1/dashboard/customer` - Customer dashboard
- `GET /api/v1/dashboard/provider` - Provider dashboard
- `GET /api/v1/dashboard/admin` - Admin dashboard

## 📁 Project Structure

```
patanai/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/    # API routes
│   │   ├── core/                # Config, security, DB
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/           # Business logic
│   │   └── main.py             # App entry
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js pages
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts
│   │   ├── lib/                # API client
│   │   └── types/              # TypeScript types
│   ├── package.json
│   └── tailwind.config.ts
├── SPEC.md                     # Project specification
└── README.md
```

## 🔐 User Roles

- **Customer**: Browse, book, and review services
- **Provider**: Manage profile, accept bookings, view earnings
- **Admin**: Manage users, providers, bookings, and analytics

## 📱 Pages

- `/` - Homepage with search and categories
- `/services` - All service categories
- `/services/[category]` - Category providers
- `/provider/[id]` - Provider profile
- `/search` - Search results
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/dashboard` - Customer dashboard
- `/admin` - Admin dashboard
- `/about` - About us
- `/contact` - Contact form
- `/faq` - FAQ page

## 🎯 Key Features

### Trust & Safety
- Verified provider badges
- Phone & CNIC verification
- Review moderation
- Report & block system

### Pakistan-Specific
- Urdu + English UI
- Cash-friendly payments
- WhatsApp integration
- Local cities support

### Performance
- Fast loading on low internet
- Mobile-first responsive design
- Optimized images and assets

## 📄 License

This project is for demonstration purposes.

## 👨‍💻 Author

Built with ❤️ for Pakistan

---

<p align="center">Sehat & Service - Your Trusted Local Services Marketplace</p>