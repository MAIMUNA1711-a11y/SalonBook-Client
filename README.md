# SalonBook Client

Next.js (TypeScript) front end for **SalonBook**, a salon appointment booking platform where customers browse services, book appointments, and pay via Stripe, while admins manage services, appointments, users, and transactions.

## Links
- Live site: https://salon-book-client-ruddy.vercel.app
- Client repo: https://github.com/MAIMUNA1711-a11y/SalonBook-Client
- Server repo: https://github.com/MAIMUNA1711-a11y/SalonBook-Server

## Features
- Home with banner, active featured services, categories, and extra section
- Browse services with search by name, category filter, and price sorting
- Protected service details page (/services/[id]) with slot availability and booking
- Role-based Customer and Admin dashboards with sidebar layout and access guard
- Stripe Checkout payments with verified webhook status updates, success, and cancel pages
- Admin: manage services (ImgBB upload and active/inactive toggle), appointments, users, and read-only transactions
- Toast notifications, loading states, confirmation dialogs, and responsive design

## Tech stack
Next.js 14 (App Router), TypeScript, Tailwind CSS, Better Auth (+ JWT plugin), MongoDB adapter, ImgBB, Stripe, react-hot-toast, lucide-react

## Required environment variables (names only)
MONGODB_URI, MONGODB_DB, BETTER_AUTH_SECRET, BETTER_AUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_IMGBB_API_KEY, NEXT_PUBLIC_DEMO_ADMIN_EMAIL, NEXT_PUBLIC_DEMO_ADMIN_PASSWORD

## Installation
npm install
cp .env.example .env.local

## Run locally
npm run dev
Start the server repo too (default http://localhost:5000).
