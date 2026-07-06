# ভালোবাসা — Bhalobasha 🏠

> **ভালো + বাসা** — "Good Home" in Bangla. Also the word for _love_.

A modern, broker-free rental platform built for Bangladesh — helping renters find flats, rooms, sublets, and bachelor seats, while making it effortless for property owners to list without printed paper ads.

[![Backend](https://img.shields.io/badge/Backend-NestJS-ea2845?logo=nestjs)](https://nestjs.com)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js)](https://nextjs.org)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169e1?logo=postgresql)](https://postgresql.org)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2d3748?logo=prisma)](https://prisma.io)
[![Language](https://img.shields.io/badge/Language-TypeScript-3178c6?logo=typescript)](https://typescriptlang.org)

---

## The Problem

Finding rental accommodation in Bangladesh — especially in Dhaka — is broken in several specific ways:

- **Bachelors get rejected without warning.** "Family only" buildings are common, but there's no way to know this until you travel across the city and ask in person. Students and young professionals waste hours on trips that were always going to end in rejection.
- **Owners still rely on paper.** Hand-written "To-Let" signs taped to gates, word-of-mouth through building caretakers, and printed paper ads are still the dominant listing method — even in 2025.
- **Brokers sit in the middle.** Most existing platforms still involve dalals (brokers) who add cost and opacity to a process that should be direct between owner and renter.
- **Seat-level search doesn't exist cleanly.** Shared messes and per-seat renting is extremely common among students and job-holders in Dhaka, but most platforms only list full rooms or flats.

Bhalobasha is built to fix all four of these at once.

---

## The Solution

A full-stack web platform (with mobile app planned) where:

- **Tenant policy is a first-class field.** Every listing explicitly states whether it accepts bachelors, families, students-only, or any — shown upfront on cards so seekers never waste a trip.
- **Owners can list in under 3 minutes** from any phone or browser — no print, no broker, no middleman.
- **Direct contact.** Logged-in seekers see the owner's phone number and a pre-filled WhatsApp link immediately.
- **Location is structured, not free text.** Division → District → Thana → Area hierarchy means filters actually work and listings don't end up unfindable.
- **Listings auto-expire.** Stale listings are the #1 trust-killer on Bangladeshi classifieds. Bhalobasha auto-deactivates listings after 30 days and prompts owners to renew.

---

## Features

### For Renters (Seekers)

- Browse and search listings filtered by location, type, rent range, tenant policy, gender preference, furnished status
- Cascading location filter: Division → District → Thana → Area
- See bachelor/family/student policy clearly on every listing card
- Photo gallery on listing detail page
- Direct WhatsApp deep-link to owner after login
- Phone OTP login — no password needed

### For Property Owners

- 3-step guided listing creation (basic info → location & details → photos)
- Drag-and-drop photo upload (up to 8 photos, Cloudinary-backed)
- One-tap "Mark as Filled" to remove listing from active results
- Dashboard with listing status overview (Active / Filled / Expired / Draft)
- Auto-expiry with renewal prompt after 30 days

### Platform

- Phone OTP authentication (no password — matches how most Bangladeshis use apps)
- Structured Bangladesh location reference data (all 8 divisions, 64 districts, major thanas and areas seeded)
- Role-based access: Seeker, Owner, Admin
- Global consistent API response envelope
- Swagger/OpenAPI documentation at `/api/docs`
- Admin panel for listing moderation and user management

---

## Tech Stack

### Backend (`bhalobasha-api`)

| Layer        | Technology                          | Why                                                                                            |
| ------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| Framework    | NestJS (Node.js)                    | TypeScript-first, modular, scales well, great DX                                               |
| Language     | TypeScript                          | Type safety across the whole codebase                                                          |
| Database     | PostgreSQL                          | Relational data fits the owner→listing→location model; PostGIS-ready for geo search later      |
| ORM          | Prisma                              | Type-safe queries, clean migrations, great schema DX                                           |
| Auth         | JWT + Phone OTP                     | Passwords are a barrier in BD; phone-first matches user behaviour                              |
| File storage | Cloudinary                          | CDN-backed image hosting with auto-compression — critical for mobile users on slow connections |
| Validation   | class-validator + class-transformer | Declarative, works natively with NestJS pipes                                                  |
| Docs         | Swagger / OpenAPI                   | `/api/docs` — live interactive API documentation                                               |

### Frontend (`bhalobasha-web`)

| Layer         | Technology              | Why                                                                                                 |
| ------------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| Framework     | Next.js 14 (App Router) | SSR matters — listing pages must be Google-indexable for "bachelor room Mirpur" type organic search |
| Language      | TypeScript              | Shared type interfaces with backend models                                                          |
| Styling       | Tailwind CSS            | Fast iteration, mobile-first, no design system overhead                                             |
| UI Components | shadcn/ui               | Accessible, unstyled-by-default, composable                                                         |
| State         | Zustand                 | Lightweight auth state management                                                                   |
| Data fetching | TanStack Query v5       | Caching, background refetch, loading/error states                                                   |
| Forms         | React Hook Form + Zod   | End-to-end type-safe forms with schema validation                                                   |
| HTTP          | Axios                   | Interceptors for JWT attachment and 401 handling                                                    |
| Notifications | Sonner                  | Clean toast notifications                                                                           |

### Hosting (planned)

| Service     | Provider                      |
| ----------- | ----------------------------- |
| Backend API | Railway or Render             |
| Frontend    | Vercel                        |
| Database    | Railway PostgreSQL            |
| Media       | Cloudinary (free tier → paid) |

---

## Architecture

```
bhalobasha-web (Next.js)          bhalobasha-api (NestJS)
      │                                    │
      │  REST API calls (Axios)            │
      │ ─────────────────────────────────► │
      │                                    ├── AuthModule (OTP + JWT)
      │                                    ├── UsersModule
      │                                    ├── ListingsModule
      │                                    ├── LocationsModule
      │                                    ├── MediaModule (Cloudinary)
      │                                    └── PrismaService
      │                                              │
      │                                              ▼
      │                                        PostgreSQL
      │
      ▼
   Vercel CDN
```

---

## Database Schema (simplified)

```
User
 ├── id, phone (unique), name, email, role (SEEKER|OWNER|ADMIN)
 └── isVerified, isActive

Listing
 ├── id, title, description
 ├── type (FULL_FLAT|SINGLE_ROOM|SHARED_SEAT|SUBLET|MESS)
 ├── tenantPolicy (BACHELOR_ONLY|FAMILY_ONLY|STUDENT_ONLY|ANY)  ← key differentiator
 ├── genderPreference (MALE|FEMALE|ANY)
 ├── rent, advanceAmount, negotiable
 ├── status (ACTIVE|FILLED|EXPIRED|DRAFT)
 ├── expiresAt (auto-set 30 days from creation)
 ├── owner → User
 ├── area → Area → Thana → District → Division
 └── photos → ListingPhoto[]

Location hierarchy
 Division → District → Thana → Area
 (seeded with all 8 BD divisions, 64 districts, major Dhaka thanas)
```

---

## Project Structure

```
bhalobasha-api/
├── src/
│   ├── auth/          # OTP generation, JWT strategy, guards
│   ├── users/         # Profile management
│   ├── listings/      # Core listing CRUD + filters
│   ├── locations/     # BD location reference data API
│   ├── media/         # Cloudinary upload service
│   ├── prisma/        # PrismaService + PrismaModule
│   └── common/        # Guards, decorators, interceptors, filters
├── prisma/
│   ├── schema.prisma
│   └── seed.ts        # BD location data + test users + sample listings

bhalobasha-web/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── listings/                   # Browse + detail pages
│   ├── (auth)/login|verify/        # Phone OTP auth flow
│   └── dashboard/                  # Owner dashboard (protected)
├── components/
│   ├── listings/                   # Card, grid, filters, photos, contact modal
│   └── auth/                       # OTP input, phone input
└── lib/
    ├── api/                        # Typed Axios API clients
    ├── store/                      # Zustand auth store
    ├── hooks/                      # useListings, useLocations, useAuth
    └── utils/                      # BDT formatter, Bangla date, constants
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Cloudinary account (free tier works)

### Backend setup

```bash
git clone https://github.com/mohammad-oliullah/bhalobasha
cd bhalobasha-api
npm install

# Copy and fill environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev --name init

# Seed Bangladesh location data + test users + sample listings
npx prisma db seed

# Start dev server
npm run start:dev
```

API runs at `http://localhost:3001`
Swagger docs at `http://localhost:3001/api/docs`

### Frontend setup

```bash
cd bhalobasha-web
npm install

cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3001

npm run dev
```

Frontend runs at `http://localhost:3000`

### Environment variables

**Backend `.env`**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bhalobasha
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=3000
```

**Frontend `.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Bhalobasha
```

### Test credentials (seeded)

| Role  | Phone       |
| ----- | ----------- |
| Admin | 01700000000 |
| Owner | 01700000001 |

> OTP is logged to the backend console in development — no real SMS needed to test.

---

## API Overview

Full interactive documentation available at `/api/docs` (Swagger UI).

| Method | Endpoint                    | Auth   | Description                   |
| ------ | --------------------------- | ------ | ----------------------------- |
| POST   | `/auth/send-otp`            | Public | Send OTP to phone number      |
| POST   | `/auth/verify-otp`          | Public | Verify OTP, get JWT           |
| GET    | `/users/me`                 | JWT    | Get current user profile      |
| PATCH  | `/users/me`                 | JWT    | Update profile                |
| GET    | `/listings`                 | Public | Browse listings with filters  |
| GET    | `/listings/:id`             | Public | Single listing detail         |
| POST   | `/listings`                 | Owner  | Create new listing            |
| PATCH  | `/listings/:id`             | Owner  | Update own listing            |
| PATCH  | `/listings/:id/mark-filled` | Owner  | Mark listing as filled        |
| DELETE | `/listings/:id`             | Owner  | Soft delete (expires) listing |
| POST   | `/media/upload`             | JWT    | Upload image to Cloudinary    |
| GET    | `/locations/divisions`      | Public | All 8 BD divisions            |
| GET    | `/locations/districts`      | Public | Districts by division         |
| GET    | `/locations/thanas`         | Public | Thanas by district            |
| GET    | `/locations/areas`          | Public | Areas by thana                |

---

## Roadmap

### Phase 1 — Backend ✅

- NestJS + PostgreSQL + Prisma setup
- Auth (Phone OTP + JWT)
- Listings CRUD with full filters
- Bangladesh location hierarchy (seeded)
- Cloudinary media upload
- Swagger documentation

### Phase 2 — Web Frontend ✅

- Next.js 14 App Router setup
- Landing page with search
- Browse & filter listings
- Listing detail with contact owner
- Phone OTP login flow
- Owner dashboard + multi-step listing creation
- Photo upload with drag & drop

### Phase 3 — Production Hardening 🔄

- [ ] Real SMS OTP via local BD gateway (SSL Wireless / Banglalink)
- [ ] NID-based owner verification
- [ ] In-app messaging thread (beyond just phone reveal)
- [ ] Listing renewal notifications
- [ ] Admin moderation panel
- [ ] SEO optimization (sitemap, og:tags for listings)
- [ ] Deploy to Railway (API) + Vercel (web)

### Phase 4 — Mobile App 📱

- [ ] React Native app (iOS + Android)
- [ ] Same backend API — no changes needed
- [ ] Push notifications for new listings matching saved filters
- [ ] "Saved listings" / favourites
- [ ] Owner: instant lead notification when someone views contact

### Phase 5 — Growth Features 💡

- [ ] PostGIS-based "near me" search
- [ ] Tenant/landlord reviews after tenancy
- [ ] Digital rent agreement generation (PDF)
- [ ] Verified badge for NID-confirmed owners
- [ ] Mess management dashboard (owners managing multiple seats)

---

## Design Decisions Worth Noting

**Why phone OTP instead of email/password?**
Smartphone penetration in Bangladesh skews heavily mobile, and most users are more comfortable with SMS verification than managing passwords. Email is optional and secondary.

**Why tenant policy as a structured enum, not free text?**
Every existing platform in this space either buries this in a description or uses inconsistent tags. Making it a required enum on the listing model means it's always filterable, always visible on cards, and owners are forced to declare a policy upfront — which is the core UX improvement over competitors.

**Why SSR with Next.js over a pure SPA?**
Organic search traffic for terms like "bachelor room rent Mirpur" or "sublet Mohammadpur" is significant and growing. A pure React SPA would make listing pages invisible to Google. SSR with Next.js means every listing page is crawlable and can rank.

**Why auto-expiry on listings?**
The single most common complaint on Bangladeshi rental classifieds is contacting an owner about a listing that was filled months ago. 30-day auto-expiry with a one-tap renewal is a trust mechanism, not just a housekeeping feature.

---

## Contributing

This is currently a solo project in active development. Issues and suggestions welcome.

---

## License

MIT

---

_Built with ❤️ for Bangladesh — because finding a good home shouldn't be this hard._
