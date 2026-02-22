// Mock data for BM Hospitality Travel Website

export const travelPackages = [
  {
    id: 1,
    name: "Maldives Paradise Escape",
    destination: "Maldives",
    duration: "7 Days / 6 Nights",
    price: 2499,
    image: "https://images.pexels.com/photos/34519397/pexels-photo-34519397.jpeg",
    description: "Experience luxury overwater villas, crystal-clear lagoons, and world-class diving in the Maldives.",
    highlights: [
      "Overwater villa accommodation",
      "Daily breakfast and dinner",
      "Snorkeling and diving equipment",
      "Spa treatment session",
      "Airport transfers"
    ],
    category: "Beach & Luxury"
  },
  {
    id: 2,
    name: "Bali Cultural Adventure",
    destination: "Bali, Indonesia",
    duration: "5 Days / 4 Nights",
    price: 1299,
    image: "https://images.unsplash.com/photo-1549294413-26f195200c16",
    description: "Discover ancient temples, lush rice terraces, and vibrant Balinese culture in this immersive experience.",
    highlights: [
      "4-star resort accommodation",
      "Guided temple tours",
      "Traditional Balinese cooking class",
      "Rice terrace trekking",
      "Cultural dance performance"
    ],
    category: "Cultural & Adventure"
  },
  {
    id: 3,
    name: "Caribbean Cruise Deluxe",
    destination: "Caribbean Islands",
    duration: "10 Days / 9 Nights",
    price: 3899,
    image: "https://images.pexels.com/photos/28443535/pexels-photo-28443535.jpeg",
    description: "Sail through pristine Caribbean waters, visiting multiple tropical islands on this luxury cruise.",
    highlights: [
      "Premium cabin on luxury liner",
      "All meals and entertainment",
      "7 island destinations",
      "Water sports activities",
      "Onboard casino and spa"
    ],
    category: "Cruise & Luxury"
  },
  {
    id: 4,
    name: "Thailand Beach Retreat",
    destination: "Phuket, Thailand",
    duration: "6 Days / 5 Nights",
    price: 1599,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    description: "Relax on pristine beaches, explore vibrant nightlife, and indulge in authentic Thai cuisine.",
    highlights: [
      "Beachfront resort stay",
      "Island hopping tour",
      "Thai massage sessions",
      "Sunset dinner cruise",
      "City and beach transfers"
    ],
    category: "Beach & Relaxation"
  },
  {
    id: 5,
    name: "Dubai Luxury Experience",
    destination: "Dubai, UAE",
    duration: "5 Days / 4 Nights",
    price: 2199,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
    description: "Experience opulence in the city of gold with luxury hotels, desert safaris, and world-class shopping.",
    highlights: [
      "5-star hotel accommodation",
      "Desert safari with BBQ dinner",
      "Burj Khalifa observation deck",
      "Dubai Mall shopping tour",
      "Private city tour"
    ],
    category: "Luxury & Urban"
  },
  {
    id: 6,
    name: "Greece Island Hopping",
    destination: "Santorini & Mykonos",
    duration: "8 Days / 7 Nights",
    price: 2799,
    image: "https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg",
    description: "Explore the stunning Greek islands, from Santorini's sunsets to Mykonos' vibrant nightlife.",
    highlights: [
      "Boutique hotel stays",
      "Ferry transfers between islands",
      "Wine tasting tour",
      "Private yacht cruise",
      "Traditional Greek cooking class"
    ],
    category: "Cultural & Beach"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    comment: "BM Hospitality made our Maldives honeymoon absolutely magical! Every detail was perfectly planned, and the resort was beyond our expectations. We'll definitely book with them again!",
    package: "Maldives Paradise Escape"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Mumbai, India",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    comment: "The Bali cultural tour was an incredible experience. Our guide was knowledgeable, the accommodations were fantastic, and we learned so much about Balinese culture. Highly recommended!",
    package: "Bali Cultural Adventure"
  },
  {
    id: 3,
    name: "Emily Chen",
    location: "Singapore",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    comment: "The Caribbean cruise exceeded all expectations! The itinerary was perfect, and the customer service from BM Hospitality was outstanding throughout our journey.",
    package: "Caribbean Cruise Deluxe"
  },
  {
    id: 4,
    name: "Michael Brown",
    location: "London, UK",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    comment: "Dubai was spectacular! BM Hospitality arranged everything flawlessly - from the luxury hotel to the desert safari. It was truly a five-star experience from start to finish.",
    package: "Dubai Luxury Experience"
  }
];

export const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1603477849227-705c424d1d80",
    title: "Tropical Paradise",
    location: "Maldives"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    title: "Luxury Pool Resort",
    location: "Bali"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1586500036065-bdaeac7a4feb",
    title: "Palm Beach Serenity",
    location: "Thailand"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1535262412227-85541e910204",
    title: "Island View",
    location: "Caribbean"
  },
  {
    id: 5,
    url: "https://images.pexels.com/photos/32932742/pexels-photo-32932742.jpeg",
    title: "Beach Relaxation",
    location: "Maldives"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1551918120-9739cb430c6d",
    title: "Waterfront Luxury",
    location: "Greece"
  }
];

export const services = [
  {
    id: 1,
    title: "Holiday Packages",
    description: "Curated vacation packages to exotic destinations worldwide with all-inclusive amenities.",
    icon: "Palmtree"
  },
  {
    id: 2,
    title: "Corporate Travel",
    description: "Specialized business travel solutions including conferences, team building, and incentive trips.",
    icon: "Briefcase"
  },
  {
    id: 3,
    title: "Adventure Tours",
    description: "Thrilling adventure experiences from mountain trekking to water sports and wildlife safaris.",
    icon: "Mountain"
  },
  {
    id: 4,
    title: "Luxury Experiences",
    description: "Premium travel with five-star accommodations, private tours, and exclusive experiences.",
    icon: "Crown"
  },
  {
    id: 5,
    title: "Custom Planning",
    description: "Personalized itineraries tailored to your preferences, interests, and budget.",
    icon: "Map"
  },
  {
    id: 6,
    title: "24/7 Support",
    description: "Round-the-clock customer support for bookings, changes, and travel assistance.",
    icon: "Phone"
  }
];
