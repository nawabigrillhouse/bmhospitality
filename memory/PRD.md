# BM Hospitality - Product Requirements Document

## Original Problem Statement
Create a customized travel services and package website named "BM Hospitality" with multiple sections for different travel services, inquiry forms, community features, and an admin panel.

## Tech Stack
- Frontend: React, TailwindCSS, Shadcn/UI, react-router-dom
- Backend: FastAPI, MongoDB, Emergent Object Storage
- Database: MongoDB (localhost:27017, DB: test_database)

## What's Been Implemented

### Main Website
- Hero, Services, Packages (Domestic/International/Goa), Gallery, Testimonials, Footer
- **Goa Hotels & Resorts**: North Goa / South Goa region selector, then stay preferences:
  - Budget Hotels - 3 Star, Premium Hotels & Resorts - 4 Star, Luxury Hotels & Resorts - 5 Star
  - Stay for Bachelors, Stay for Family, Stay for Couples, Stay for Groups
  - Check-in form with email & WhatsApp submission
- **Hotels & Resorts Worldwide**: Search form with email/WhatsApp quote delivery
- **Dawoodi Bohra Stays**: Villa/apartment options, NO pricing displayed, "Fill the form & submit to know your package rate"
- **Flight Inquiry**: Clean inquiry form (no MakeMyTrip, no markup)
- **Offers & Deals**: Olive green theme
- **Contact**: Updated address, phone, WhatsApp, email, map
- **Newsletter popup**: On initial load
- **WhatsApp floating button**: Bottom-right on all pages
- **Header**: Instagram link (top-left), navigation, search box
- ALL forms submit via BOTH backend API (MongoDB) AND WhatsApp

### Admin Panel (at /admin, password: Nawabi@2025)
- Dashboard with stats
- **Universal Image Manager**: Upload/delete for all sections (Hero, Packages, Goa Hotels, Bohra Stays, Gallery, etc.)
- Inquiries Dashboard & Subscriptions view
- Object storage via Emergent integrations

### Backend API Endpoints
- Public: /api/subscribe, /api/flight-inquiry, /api/hotel-inquiry, /api/contact, /api/inquiry
- Admin: /api/admin/login, /api/admin/upload, /api/admin/stats, /api/admin/inquiries, /api/admin/subscriptions, /api/admin/images
- Files: /api/files/{path}, /api/content/{section}

## Prioritized Backlog

### P1
- Connect admin-uploaded images to display dynamically on main website
- Logo: User to share transparent PNG file

### P2
- Develop Travel Blogs section with backend
- Implement search functionality
- Manage Packages/Offers/Testimonials from admin

### P3
- Refactor BohraStay.jsx
- SEO & performance optimization
