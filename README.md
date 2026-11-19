# SalonBook Client

Next.js (TypeScript) front end for **SalonBook**, a salon appointment booking platform. Authentication is handled by **Better Auth** (email/password + Google) running inside this Next.js app.

## Features
- Home with banner, featured services, categories, how-it-works section
- Browse services with search, category filter and price sorting
- Protected service details page with appointment booking (slot availability)
- Role-based dashboards (Customer / Admin) with sidebar layout
- Stripe Checkout payments, success and cancel pages
- Admin: manage services (image upload), appointments, users, transactions
- Toast notifications, loading states, confirmation dialogs, fully responsive

## Tech stack
Next.js 14 (App Router), TypeScript, Tailwind CSS, Better Auth (+ JWT plugin), MongoDB adapter, react-hot-toast, lucide-react

## Installation
```bash
npm install
cp .env.example .env.local   # fill in the values
```

## Run locally
```bash
npm run dev    # http://localhost:3000
```
Start the server repo too (default http://localhost:5000).

## Required environment variables (names only)
`MONGODB_URI`, `MONGODB_DB`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_API_URL`

## Links
- Live site: _add link_
- Client repo: _add link_
- Server repo: _add link_
