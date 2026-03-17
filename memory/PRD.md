# BM Hospitality - Product Requirements Document

## Original Problem Statement
Create a customized travel services and package website named "BM Hospitality" with multiple sections for different travel services, inquiry forms, community features, and an admin panel for content management.

## Tech Stack
- Frontend: React, TailwindCSS, Shadcn/UI, react-router-dom
- Backend: FastAPI, MongoDB, Emergent Object Storage
- Database: MongoDB (localhost:27017, DB: test_database)

## What's Been Implemented

### Main Website
- Hero section, Services, Packages (Domestic/International/Goa), Goa Hotels with star-rating filter
- Hotels & Resorts worldwide, Dawoodi Bohra Stays, Flight Inquiry, Offers & Deals (olive green)
- Travel Blogs (placeholder), Gallery, Testimonials, Contact (with map)
- Newsletter popup, WhatsApp floating button, Header with Instagram link & search box
- ALL forms submit via BOTH backend API (MongoDB) AND WhatsApp

### Admin Panel (at /admin)
- Password-protected login (Nawabi@2025)
- Dashboard: Stats overview (inquiries, subscriptions, images)
- **Image Manager**: Upload/delete photos for ALL sections (Hero, Domestic Packages, International, Goa Hotels, Bohra Stays, Gallery, Testimonials, Offers, General)
- **Inquiries Dashboard**: View all flight, hotel, package, contact inquiries
- **Subscriptions**: View all newsletter subscribers
- Object storage via Emergent integrations for persistent image uploads

### Backend API Endpoints
- POST /api/subscribe, /api/flight-inquiry, /api/hotel-inquiry, /api/contact, /api/inquiry
- POST /api/admin/login, /api/admin/upload
- GET /api/admin/stats, /api/admin/inquiries, /api/admin/subscriptions, /api/admin/images
- DELETE /api/admin/images/{id}
- GET /api/files/{path} (serve uploaded images)
- GET /api/content/{section}

## Prioritized Backlog

### P1
- Connect uploaded admin images to display on the main website (currently images are uploaded but not yet replacing stock photos dynamically)
- Logo: User to share transparent PNG file

### P2
- Develop Travel Blogs section with backend
- Implement search functionality
- Manage Packages/Offers/Testimonials from admin

### P3
- Refactor BohraStay.jsx
- SEO & performance optimization
