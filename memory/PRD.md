# BM Hospitality Travel Website - Product Requirements Document

## Original Problem Statement
Create a simplified, customized travel services website for BM Hospitality with 5 main sections:
1. Domestic Packages (India tourism)
2. International Packages (Worldwide destinations)
3. Goa Packages (Hotels & Resorts)
4. WhatsApp Integration for quotation requests
5. Dawoodi Bohra Community Stay section (Exclusive Goa accommodations)

## Business Details
- **WhatsApp Number:** +918329416113
- **Target Audience:** Indian travelers, Dawoodi Bohra community, international tourists
- **Pricing Model:** Request-based quotations via WhatsApp

## Core Features Implemented (December 22, 2025)

### 1. Domestic Packages ✅
- 6 popular Indian destinations:
  - Golden Triangle (Delhi, Agra, Jaipur)
  - Kerala Backwaters
  - Kashmir Paradise
  - Rajasthan Royal Heritage
  - Himachal Hill Stations
  - Andaman Beach Escape
- Request quote form with complete guest details
- WhatsApp integration for instant quotations

### 2. International Packages ✅
- 6 popular worldwide destinations:
  - Maldives Luxury Retreat
  - Dubai Extravaganza
  - Thailand Beach Paradise
  - Bali Cultural Journey
  - Singapore & Malaysia
  - Europe Grand Tour
- Request quote form with travel preferences
- WhatsApp integration

### 3. Goa Hotels & Resorts ✅
- 4 premium properties with pricing starting ₹3,500/night onwards:
  - Luxury Beach Resort (North Goa - Calangute)
  - Heritage Hotel (South Goa - Benaulim)
  - Family Resort (North Goa - Baga)
  - Boutique Beach Villa (South Goa - Palolem)
- Amenities and facility details
- WhatsApp inquiry system

### 4. Dawoodi Bohra Stay Types in Goa ✅
Exclusive section with 3 accommodation categories:

**A. Luxury Private Villa with Private Pool**
- 2 BHK (4-6 Guests)
- 3 BHK (6-8 Guests)
- 4 BHK (8-10 Guests)
- 5 BHK (10-12 Guests)
- Amenities: Private pool, fully furnished, modern kitchen, AC, WiFi, parking

**B. Semi-Luxury Villa with Common Pool**
- 2 BHK (4-6 Guests)
- 3 BHK (6-8 Guests)
- 4 BHK (8-10 Guests)
- 5 BHK (10-12 Guests)
- Amenities: Common pool, fully furnished, kitchen, AC, WiFi, parking

**C. Apartments with Common Pool**
- 2 BHK (4-6 Guests)
- 3 BHK (6-8 Guests)
- Amenities: Common pool, furnished, kitchen, AC, WiFi, secure parking

### 5. WhatsApp Integration ✅
- Direct WhatsApp messaging with pre-filled inquiry details
- Structured message format with all guest information
- Package/property details included in message
- One-click send to +918329416113

### 6. Additional Sections ✅
- Services overview (6 service cards)
- Destination gallery (Indian destinations)
- Customer testimonials (Dawoodi Bohra community focused)
- Contact form with location map
- Professional header & footer

## WhatsApp Message Format

### For Travel Packages (Domestic/International):
```
*New [Package Type] Package Inquiry - BM Hospitality*

📦 Package: [Package Name]
📍 Destination: [Destination]

*Guest Details:*
👤 Name: [Guest Name]
📧 Email: [Email]
📱 Phone: [Phone]

*Travel Information:*
📅 Travel Date: [Date]
👥 Adults: [Number]
👶 Children: [Number]
⏱️ Duration: [Duration]
🎯 Preferred Destination: [Destinations]

💬 Special Requirements:
[Message]

_Sent via BM Hospitality Website_
```

### For Dawoodi Bohra Stay:
```
*Dawoodi Bohra Stay Inquiry - BM Hospitality*

🏠 Stay Type: [Villa/Apartment Type]
🏘️ Configuration: [BHK]
👥 Capacity: [Guests]

*Guest Details:*
👤 Name: [Guest Name]
📧 Email: [Email]
📱 Phone: [Phone]

*Booking Information:*
📅 Check-in: [Date]
📅 Check-out: [Date]
👥 Adults: [Number]
👶 Children: [Number]

💬 Special Requirements:
[Message]

_Dawoodi Bohra Community - BM Hospitality_
```

## Frontend Architecture

### Components Structure
```
/app/frontend/src/
├── components/
│   ├── Header.jsx          # Navigation with Bohra Stay link
│   ├── Hero.jsx            # Hero section
│   ├── Services.jsx        # 6 service cards
│   ├── Packages.jsx        # Tabbed packages (Domestic/International/Goa)
│   ├── BohraStay.jsx       # Dawoodi Bohra community stays
│   ├── Gallery.jsx         # Destination gallery
│   ├── Testimonials.jsx    # Customer reviews
│   ├── Contact.jsx         # Contact form
│   └── Footer.jsx          # Footer with links
├── mock.js                 # Mock data
└── App.js                  # Main app
```

### Key Technologies
- React 19 with Shadcn UI components
- Tabs component for package categories
- Dialog for booking/inquiry forms
- WhatsApp Web API integration (wa.me)
- Toast notifications (Sonner)
- Teal color scheme matching logo

## Current Status
✅ **Frontend Complete** - All 5 sections implemented with WhatsApp integration
🔄 **Data:** Using mock data (no backend yet)
📱 **WhatsApp:** Fully integrated, opens WhatsApp with pre-filled messages

## Next Action Items (Backend Development)

### P0 - Critical Features
1. **Database Models**
   - Package model (domestic & international)
   - Goa property model
   - Bohra stay model
   - Inquiry/booking model
   - Contact submission model

2. **API Endpoints**
   - GET /api/packages/domestic
   - GET /api/packages/international
   - GET /api/goa-properties
   - GET /api/bohra-stays
   - POST /api/inquiries (store inquiries in database)
   - POST /api/contact

3. **Email Notifications**
   - Send inquiry copy to admin email
   - Confirmation email to guest

### P1 - High Priority
1. **Admin Panel**
   - Manage packages (add/edit/delete)
   - Manage Goa properties
   - Manage Bohra stay listings
   - View all inquiries
   - Mark inquiries as contacted/completed

2. **WhatsApp Business API**
   - Optional: Direct WhatsApp Business API integration
   - Automated message templates
   - Inquiry tracking

### P2 - Future Enhancements
1. **Advanced Features**
   - Payment gateway integration
   - Booking calendar with availability
   - Multi-language support (Arabic for Bohra community)
   - User accounts for repeat customers
   - Saved inquiries/bookings history

2. **Marketing Features**
   - Special offers section
   - Seasonal packages
   - Blog for travel tips
   - Newsletter subscription

## Technical Notes
- All forms validate required fields
- Date inputs have minimum date validation (today onwards)
- Guest count inputs accept only positive numbers
- WhatsApp opens in new tab with encoded message
- Responsive design for mobile/tablet/desktop
- Smooth scroll navigation
- Accessible UI with proper labels

## Design Guidelines
- Primary Color: Teal (#14b8a6, #0d9488)
- Accent: Ocean Blue (#06b6d4)
- Logo colors integrated throughout
- Tropical beach theme
- Clean, modern interface
- Card-based layouts
- Hover animations and transitions
