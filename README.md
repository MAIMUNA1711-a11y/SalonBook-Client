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
