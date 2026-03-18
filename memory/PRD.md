# BM Hospitality - Product Requirements Document

## Original Problem Statement
Create a customized travel services and package website named "BM Hospitality" with comprehensive features including newsletter subscriptions, travel packages, hotel/resort bookings, Dawoodi Bohra community stays, flight inquiries, offers & deals, travel blogs, testimonials, contact information, and a full admin panel for content management.

## Core Requirements
- Full navigation header with tabs: Packages, Goa Holidays, Hotels & Resorts, Bohra Mumeneen Stays, Flight Inquiry, Offers & Deals, Travel Blogs, Testimonials, Contact Us
- Newsletter subscription popup
- Admin Panel for managing website images and viewing inquiries
- All inquiry forms submit to backend DB + open pre-filled WhatsApp messages
- Dynamic image management via admin panel (CMS)

## Tech Stack
- Frontend: React, TailwindCSS, Shadcn/UI, react-router-dom
- Backend: FastAPI, Pydantic
- Database: MongoDB
- Storage: Emergent Object Storage for images
- State: Custom hooks (useAdminImages)

## Admin Credentials
- URL: /admin
- Password: Nawabi@2025

## What's Implemented (as of March 18, 2026)

### Frontend Components
- Hero section with dynamic background image
- Packages section (Domestic, International, Goa tabs) with dynamic images
- Goa Hotels & Resorts inquiry form (North/South Goa, stay preferences)
- Hotels & Resorts worldwide search form
- Dawoodi Bohra Stay section with villa/apartment options and inquiry dialogs
- Offers & Deals section with dynamic images
- Gallery with lightbox and dynamic images
- Flight Inquiry section
- Testimonials section
- Contact Us section with form
- Services section
- Newsletter popup, Instagram float, WhatsApp float
- Full admin panel (login, dashboard, inquiries, image manager)

### Backend APIs
- POST /api/admin/login - Admin authentication
- GET /api/admin/inquiries - View all inquiries
- GET /api/admin/subscriptions - View all subscriptions
- POST /api/admin/upload - Upload images with section tagging
- GET /api/admin/images - List admin images
- DELETE /api/admin/images/{id} - Soft delete image
- GET /api/admin/stats - Dashboard statistics
- GET /api/images/{section} - Public: get images by section
- GET /api/files/{path} - Public: serve uploaded files
- POST /api/inquiry - Package inquiry
- POST /api/hotel-inquiry - Hotel inquiry
- POST /api/flight-inquiry - Flight inquiry
- POST /api/contact - Contact form
- POST /api/subscribe - Newsletter subscription

### Dynamic Image CMS (COMPLETED)
- Admin can upload images tagged to sections: hero, domestic-packages, international-packages, goa-hotels, bohra-stays, gallery, testimonials, offers, general
- Frontend components fetch images via useAdminImages hook
- Fallback to stock photos when no admin images exist
- Images update in real-time (no redeployment needed)
- Tested: 100% backend (21/21 tests), 100% frontend verification

### Image Preview Feature (COMPLETED - March 18, 2026)
- Admin Image Manager now shows a "Choose & Preview" button
- After selecting files, a preview dialog shows exactly how the image will look on the website for that section
- Section-specific mockups: Hero banner (full-width with overlay), Gallery (grid), Packages (card), Bohra Stays (card with badge), Offers (card with discount badge)
- Admin can confirm upload or cancel after previewing
- Multi-file preview supported

### Content Manager (COMPLETED - March 18, 2026)
- New "Content Manager" tab in admin panel sidebar
- 5 section tabs: Domestic Packages, International Packages, Goa Hotels/Resorts, Testimonials, Offers & Deals
- Full CRUD: Add, Edit, Delete content items with section-specific form fields
- Public website dynamically displays admin-managed content
- Fallback to default mock data when no custom content exists for a section
- Changes appear instantly on the live website
- Tested: 100% backend (17/17 tests), 100% frontend verification

## Prioritized Backlog

### P1 - MakeMyTrip Flight Inquiry Integration
- Embed/link mypartner.makemytrip.com in Flight Inquiry section
- Check X-Frame-Options feasibility; fallback to redirect

### P2 - Travel Blogs Section
- Build blog management with admin panel support

### P3 - Header Search Functionality
- Implement search/filter across dynamic content

### P3 - Bohra Stay Content Management
- Add Bohra stay options to Content Manager (complex nested data structure)
