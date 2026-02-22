# BM Hospitality Travel Website - Product Requirements Document

## Original Problem Statement
Create a customized travel services and package website named "BM Hospitality" with all features including travel package listings, booking/inquiry forms, customer testimonials, photo gallery, and contact information with location map.

## User Personas
1. **Leisure Travelers**: Individuals/families looking for vacation packages
2. **Luxury Seekers**: High-end travelers seeking premium experiences
3. **Adventure Enthusiasts**: Travelers interested in unique experiences
4. **Corporate Clients**: Businesses needing travel planning services

## Core Requirements

### Design & Branding
- Color Scheme: Teal (#14b8a6, #0d9488), Ocean Blue (#06b6d4), Warm Beige
- Logo: Tropical theme with palm trees and ocean waves
- Responsive design with modern UI
- Smooth animations and transitions

### Frontend Features (All Implemented ✅)
1. **Header & Navigation**
   - Sticky header with logo
   - Smooth scroll navigation
   - Mobile-responsive menu
   - "Book Now" CTA button

2. **Hero Section**
   - Full-screen hero with tropical beach image
   - Compelling headline and subtitle
   - Dual CTA buttons (Explore Packages, Plan My Trip)
   - Trust indicators (50+ Destinations, Custom Itineraries, Award-Winning)

3. **Services Section**
   - 6 service cards with icons (Holiday Packages, Corporate Travel, Adventure Tours, Luxury Experiences, Custom Planning, 24/7 Support)
   - Hover animations

4. **Travel Packages**
   - 6 package cards with images, pricing, and details
   - Categories: Beach & Luxury, Cultural & Adventure, Cruise & Luxury, etc.
   - Package highlights with checkmarks
   - Booking dialog with form (Name, Email, Phone, Travel Date, Number of People, Special Requests)

5. **Destination Gallery**
   - 6 tropical destination images in 3x2 grid
   - Lightbox for full-size viewing
   - Hover effects with location overlays

6. **Testimonials**
   - 4 customer testimonials with photos
   - 5-star ratings
   - Associated package names

7. **Contact Section**
   - Contact form (Name, Email, Phone, Subject, Message)
   - Contact information cards (Address, Phone, Email, Business Hours)
   - Embedded Google Maps

8. **Footer**
   - Company info with logo
   - Quick links navigation
   - Popular destinations list
   - Contact details
   - Social media links (Facebook, Instagram, Twitter, LinkedIn)

## What's Been Implemented (December 22, 2025)

### Frontend Components
- `/app/frontend/src/mock.js` - Mock data for packages, testimonials, gallery, services
- `/app/frontend/src/components/Header.jsx` - Sticky header with navigation
- `/app/frontend/src/components/Hero.jsx` - Hero section with CTA
- `/app/frontend/src/components/Services.jsx` - Services grid
- `/app/frontend/src/components/Packages.jsx` - Package cards with booking dialog
- `/app/frontend/src/components/Gallery.jsx` - Image gallery with lightbox
- `/app/frontend/src/components/Testimonials.jsx` - Customer testimonials
- `/app/frontend/src/components/Contact.jsx` - Contact form and info
- `/app/frontend/src/components/Footer.jsx` - Footer with links
- `/app/frontend/src/App.js` - Main app with all sections
- `/app/frontend/src/App.css` - Custom styles and animations

### Current Functionality
- All frontend interactions work with mock data
- Booking forms show success toasts (browser-only, no backend)
- Contact form shows success toasts (browser-only, no backend)
- Smooth scroll navigation
- Responsive design
- Gallery lightbox
- Mobile menu

## Prioritized Backlog

### P0 Features (Critical - Backend Development)
1. **Database Models**
   - Package model (name, destination, duration, price, description, highlights, category, image)
   - Booking model (customer details, package, travel date, number of people, status)
   - Contact inquiry model (name, email, phone, subject, message, status)
   - Testimonial model (name, location, rating, comment, package, image)

2. **API Endpoints**
   - GET /api/packages - List all packages
   - GET /api/packages/:id - Get package details
   - POST /api/bookings - Create booking request
   - POST /api/contact - Submit contact form
   - GET /api/testimonials - Get testimonials
   - GET /api/gallery - Get gallery images

3. **Email Notifications**
   - Send booking confirmation to customer
   - Send booking notification to admin
   - Send contact form notification to admin

### P1 Features (High Priority)
1. **Admin Panel**
   - Manage packages (CRUD operations)
   - View and manage booking requests
   - View contact inquiries
   - Manage testimonials
   - Upload gallery images

2. **Enhanced Features**
   - Package search and filtering
   - Package availability calendar
   - Payment gateway integration
   - Booking status tracking

### P2 Features (Nice to Have)
1. **User Features**
   - User registration and login
   - Booking history
   - Saved packages/wishlist
   - Newsletter subscription

2. **Marketing Features**
   - Blog section for travel tips
   - Special offers/promotions banner
   - Multi-language support
   - Live chat integration

## API Contracts (To Be Implemented)

### GET /api/packages
**Response:**
```json
[
  {
    "id": 1,
    "name": "Maldives Paradise Escape",
    "destination": "Maldives",
    "duration": "7 Days / 6 Nights",
    "price": 2499,
    "image": "url",
    "description": "...",
    "highlights": ["...", "..."],
    "category": "Beach & Luxury"
  }
]
```

### POST /api/bookings
**Request:**
```json
{
  "packageId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "travelDate": "2025-06-15",
  "numberOfPeople": 2,
  "message": "Optional special requests"
}
```
**Response:**
```json
{
  "success": true,
  "bookingId": "BK123456",
  "message": "Booking request received successfully"
}
```

### POST /api/contact
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Inquiry about packages",
  "message": "I would like to know more..."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Thank you for contacting us. We will respond within 24 hours."
}
```

## Frontend-Backend Integration Plan

### Step 1: Create Database Models
- Define MongoDB schemas for packages, bookings, contacts, testimonials

### Step 2: Implement API Endpoints
- Create FastAPI routes for all CRUD operations
- Add validation and error handling

### Step 3: Replace Mock Data
- Update frontend to fetch packages from API instead of mock.js
- Update booking form to POST to /api/bookings
- Update contact form to POST to /api/contact
- Update testimonials to fetch from API

### Step 4: Add Email Service
- Integrate email service (SendGrid/SMTP)
- Send notifications on bookings and contact submissions

## Technical Stack
- **Frontend:** React 19, Tailwind CSS, Shadcn UI Components
- **Backend:** FastAPI, Python
- **Database:** MongoDB
- **State Management:** React Hooks
- **UI Components:** Shadcn (Cards, Buttons, Dialogs, Forms, Toast)
- **Icons:** Lucide React

## Next Tasks
1. Build backend API with MongoDB models and endpoints
2. Integrate frontend with backend APIs
3. Add email notification service
4. Test end-to-end booking and contact flows
5. Add admin panel for package management
