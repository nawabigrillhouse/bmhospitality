# BM Hospitality - Product Requirements Document

## Original Problem Statement
Create a customized travel services and package website named "BM Hospitality" with multiple sections for different travel services, inquiry forms, and community features.

## Core Requirements
- Newsletter subscription popup on initial load
- Navigation header with tabs: Packages, Goa Holidays, Hotels and Resorts, Bohra Mumeneen Stays, Flight Inquiry, Offers and Deals, Travel Blogs, Testimonials, Contact Us
- Search box in header (future search functionality)
- Goa Holidays: Dedicated Goa packages with star-rating filter (3-star, 4-star, 5-star resort inquiry form)
- Hotels and Resorts: Search form with worldwide destinations, dates, guests, meal plans, email & WhatsApp for quotes
- Flight Inquiry: Clean inquiry form (no MakeMyTrip references, no markup pricing)
- Offers and Deals: Early Bird 10% discount for 45+ day advance booking, olive green theme
- Contact: Address at 104 Dattakrupa Apartment, Dattawadi, Mapusa, Goa
- Instagram: Follow link to @BM_Hospitality in top-left header bar only (purple section removed)
- Dawoodi Bohra Stays: Detailed section with villa/apartment options
- ALL forms submit via BOTH backend API (DB save) AND WhatsApp
- Logo: Display as PNG without white background patch

## Tech Stack
- Frontend: React, TailwindCSS, Shadcn/UI
- Backend: FastAPI, MongoDB
- Database: MongoDB (localhost:27017, DB: test_database)

## What's Been Implemented

### Frontend (Complete)
- Hero section with CTA buttons
- Header with Instagram top-bar, navigation, search box
- Newsletter subscription popup (API + WhatsApp)
- Quick Travel Inquiry form (API + WhatsApp)
- Services overview section
- Packages section - Domestic (Goa Beach Getaway replaced Golden Triangle), International, Goa Hotels (API + WhatsApp)
- Goa Hotels & Resorts with 3/4/5 star rating filter, check-in details, email & WhatsApp (API + WhatsApp)
- Hotels & Resorts worldwide with email/WhatsApp quote fields (API + WhatsApp)
- Dawoodi Bohra Stays section (API + WhatsApp)
- Flight Inquiry form - clean, no MakeMyTrip (API + WhatsApp)
- Offers & Deals in olive green theme
- Travel Blogs (placeholder), Gallery, Testimonials
- Contact section with map (API + WhatsApp)
- Footer
- Instagram purple section REMOVED

### Backend (Complete)
- POST /api/subscribe - Newsletter subscriptions
- POST /api/flight-inquiry - Flight booking inquiries
- POST /api/hotel-inquiry - Hotel/resort inquiries (also used by Goa form)
- POST /api/contact - Contact form submissions
- POST /api/inquiry - Quick travel inquiries (also used by Bohra Stay & Package quotes)

### Database Collections
- subscriptions, flight_inquiries, hotel_inquiries, contacts, inquiries

## Prioritized Backlog

### P1
- Build backend for dynamic content (packages, hotels, offers, testimonials, blogs CRUD APIs)
- Logo: User will share transparent PNG logo file (pending upload)

### P2
- Develop Travel Blogs section with backend
- Implement actual search functionality (currently placeholder)
- Admin Panel for content management

### P3
- Refactor BohraStay.jsx (large component with repeated JSX)
- Clean up unused InstagramFollow.jsx file
- SEO optimization
- Performance optimization (image lazy loading, etc.)
