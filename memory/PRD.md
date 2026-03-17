# BM Hospitality - Product Requirements Document

## Original Problem Statement
Create a customized travel services and package website named "BM Hospitality" with multiple sections for different travel services, inquiry forms, and community features.

## Core Requirements
- Newsletter subscription popup on initial load
- Navigation header with tabs: Packages, Goa Holidays, Hotels and Resorts, Bohra Mumeneen Stays, Flight Inquiry, Offers and Deals, Travel Blogs, Testimonials, Contact Us
- Search box in header (future search functionality)
- Goa Holidays: Dedicated Goa packages section
- Hotels and Resorts: Search form with worldwide destinations, dates, guests, meal plans, email & WhatsApp for quotes
- Flight Inquiry: Clean inquiry form (no MakeMyTrip references, no markup pricing)
- Offers and Deals: Early Bird 10% discount for 45+ day advance booking, olive green theme
- Contact: Address at 104 Dattakrupa Apartment, Dattawadi, Mapusa, Goa; Phone: +919890765859; WhatsApp: +918329416113; Email: bmhospitality.11@gmail.com
- Instagram: Follow link to @BM_Hospitality in top-left header area
- Dawoodi Bohra Stays: Detailed section with villa/apartment options, pricing, amenities, WhatsApp inquiry
- Logo: Display as PNG without white background patch

## Tech Stack
- Frontend: React, TailwindCSS, Shadcn/UI
- Backend: FastAPI, MongoDB
- Database: MongoDB (localhost:27017, DB: test_database)

## What's Been Implemented

### Frontend (Complete)
- Hero section with CTA buttons
- Header with Instagram top-bar, navigation, search box
- Newsletter subscription popup (connected to backend)
- Quick Travel Inquiry form (connected to backend)
- Services overview section
- Packages section (Domestic & International)
- Goa Holidays section
- Hotels & Resorts with email/WhatsApp quote fields (connected to backend)
- Dawoodi Bohra Stays section
- Flight Inquiry form - clean, no MakeMyTrip (connected to backend)
- Offers & Deals in olive green theme
- Travel Blogs (placeholder)
- Gallery section
- Testimonials section
- Contact section with map (connected to backend)
- Footer
- Instagram Follow section

### Backend (Complete)
- POST /api/subscribe - Newsletter subscriptions
- POST /api/flight-inquiry - Flight booking inquiries
- POST /api/hotel-inquiry - Hotel/resort inquiries
- POST /api/contact - Contact form submissions
- POST /api/inquiry - Quick travel inquiries

### Database Collections
- subscriptions, flight_inquiries, hotel_inquiries, contacts, inquiries

## Prioritized Backlog

### P0 (None remaining)

### P1
- Build backend for dynamic content (packages, hotels, offers, testimonials, blogs CRUD APIs)
- Logo: User will share transparent PNG logo file (pending upload)

### P2
- Develop Travel Blogs section with backend
- Implement actual search functionality (currently placeholder)
- Admin Panel for content management

### P3
- Refactor BohraStay.jsx (large component with repeated JSX)
- SEO optimization
- Performance optimization (image lazy loading, etc.)
