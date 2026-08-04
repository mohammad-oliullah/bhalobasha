# ভালোবাসা — Bhalobasha 🏠

> **ভালো + বাসা** — "Good Home" in Bangla. Also the word for _love_.

A full-stack, broker-free property rental platform built for Bangladesh — solving real friction points that existing platforms ignore.

[![Backend](https://img.shields.io/badge/Backend-NestJS-ea2845?logo=nestjs)](https://nestjs.com)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js_14-black?logo=next.js)](https://nextjs.org)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169e1?logo=postgresql)](https://postgresql.org)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2d3748?logo=prisma)](https://prisma.io)
[![Language](https://img.shields.io/badge/Language-TypeScript-3178c6?logo=typescript)](https://typescriptlang.org)
[![Deployed](https://img.shields.io/badge/Deployed-Railway_+_Vercel-brightgreen)](https://bhalobasha-plum.vercel.app)

**Live:** [bhalobasha-plum.vercel.app](https://bhalobasha-plum.vercel.app) · **API Docs:** [bhalobasha-production.up.railway.app/api/docs](https://bhalobasha-production.up.railway.app/api/docs)

---

## Demo Access

The live app has instant one-click demo login — no email or OTP required.

Visit the **[Login page](https://bhalobasha.vercel.app/login)** and select the **🎯 Demo** tab.

| Role          | What you can explore                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------- |
| 👤 **Seeker** | Browse listings, filter by location/type/policy, place bids, view bid status, manage profile        |
| 🏠 **Owner**  | Post a listing (3-step flow), manage listings, view and accept/reject bids, mark listings as filled |
| 🛡️ **Admin**  | Full platform access                                                                                |

> No signup. No email. One click → logged in.

---

## The Problem

Finding rental accommodation in Bangladesh — especially Dhaka — is broken in specific, fixable ways:

- **Bachelors get rejected after traveling across the city.** "Family only" buildings are common but never disclosed upfront. Students and professionals waste hours on trips that were always going to fail.
- **Owners still post hand-written signs on gates.** Printed paper ads and word-of-mouth through caretakers remain the dominant listing method.
- **Brokers sit in the middle** of what should be a direct owner-to-renter transaction, adding cost and opacity.
- **Per-seat search doesn't exist cleanly.** Shared messes are extremely common for students and job-holders, but most platforms only support full rooms or flats.

---

## What I Built

A full-stack platform that tackles all four — with one product decision at the core: **tenant policy is a first-class, required, filterable field on every listing.** Not a free-text description. Not an optional tag. A required enum, shown on every card, filterable from search. Seekers never visit a flat that would have rejected them.

### Key Features

- **Structured location search** — Division → District → Thana → Area cascading filters built from seeded Bangladesh location data. Not free text that returns garbage results.
- **3-minute listing flow** — Owners post from any phone browser in under 3 minutes. Replaces the paper sign on the gate.
- **Bidding system** — Owners can enable competitive bidding on high-demand listings. Seekers place bids; owner accepts one → listing auto-fills, all other bids auto-reject. Unique in this market.
- **Dual OTP auth** — Phone OTP (Twilio primary, SMSBD fallback) and email OTP (Gmail). No passwords.
- **Direct WhatsApp contact** — Logged-in seekers get the owner's number and a pre-filled WhatsApp deep-link instantly.
- **Auto-expiry** — Listings deactivate after 30 days. Stale listings are the #1 trust issue on BD classifieds.

---

## Tech Stack

| Layer      | Choice                   | Reason                                                                 |
| ---------- | ------------------------ | ---------------------------------------------------------------------- |
| Backend    | NestJS + TypeScript      | Modular, decorator-based, scales cleanly                               |
| Database   | PostgreSQL + Prisma      | Relational model fits owner→listing→location; type-safe queries        |
| Frontend   | Next.js 14 App Router    | SSR for SEO — "bachelor room Mirpur" searches must be Google-indexable |
| Styling    | Tailwind CSS + shadcn/ui | Mobile-first, fast iteration                                           |
| State      | Zustand + TanStack Query | Auth state (Zustand) + server state (React Query) separated cleanly    |
| Forms      | React Hook Form + Zod    | End-to-end type-safe validation                                        |
| Auth       | JWT + OTP                | No passwords — matches how Bangladeshis use apps                       |
| Media      | Cloudinary               | CDN + auto-compression, critical for slow mobile connections           |
| Deployment | Railway + Vercel         | Backend + DB on Railway, frontend on Vercel                            |

---

## Architecture

```
Next.js (Vercel)  ──── REST /api/v1/ ────►  NestJS (Railway)
                                                    │
                                               Prisma ORM
                                                    │
                                             PostgreSQL (Railway)

External: Cloudinary (media) · Twilio → SMSBD (SMS) · Gmail (email OTP)
```

---

## Design Decisions

**Tenant policy as a required enum, not free text**
Every competitor buries this in a description field. Encoding it as a required DB enum means it's always filterable, always on the listing card, and owners are forced to declare a policy — the core UX fix that makes the platform useful.

**SSR over SPA**
Listing pages need to rank on Google for searches like "bachelor room rent Mirpur". A pure React SPA would be invisible to crawlers. Next.js SSR means every listing is indexable.

**Bidding on listings**
High-demand areas in Dhaka attract 10+ WhatsApp messages per listing. Owners have no structured way to compare interest. The bidding module solves this — and no competitor has it.

**Phone OTP, no passwords**
Smartphone penetration in Bangladesh skews heavily mobile and most users are more comfortable with an SMS code than a password manager. Email OTP is a dev-friendly fallback.

**Auto-expiry at 30 days**
The top complaint on Bangladeshi rental classifieds is contacting an owner about a listing filled months ago. Auto-expiry is a trust feature, not housekeeping.

---

## Getting Started

### Prerequisites

- Node.js 18+, PostgreSQL 14+, Cloudinary account

### Backend

```bash
git clone https://github.com/mohammad-oliullah/bhalobasha
cd bhalobasha/bhalobasha-api
npm install
cp .env.example .env        # fill in your values
npx prisma migrate dev
npx prisma db seed
npm run start:dev           # → http://localhost:4040
                            # → http://localhost:4040/api/docs
```

### Frontend

```bash
cd bhalobasha/bhalobasha-web
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:4040
npm run dev                         # → http://localhost:3000
```

---

## Roadmap

- [x] NestJS API with full auth, listings, bidding, locations, media upload
- [x] Next.js web app — browse, search, listing detail, owner dashboard, bidding UI
- [x] Deployed to Railway + Vercel
- [ ] Map view (Leaflet + OpenStreetMap)
- [ ] Bangla ↔ English i18n (next-intl)
- [ ] Save / favorite listings
- [ ] Open Graph previews for WhatsApp sharing
- [ ] Admin moderation queue
- [ ] Payment integration (SSLCommerz → bKash + Nagad + cards)
- [ ] React Native mobile app (Android first)

---

## License

MIT · Built with ❤️ for Bangladesh
