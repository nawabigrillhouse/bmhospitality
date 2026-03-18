import React from 'react';
import { Button } from './ui/button';
import { MapPin, Calendar, Award } from 'lucide-react';
import { useAdminImages, getAdminImageByIndex } from '../hooks/useAdminImages';

const Hero = () => {
  const { images: heroImages } = useAdminImages('hero');
  const heroBg = getAdminImageByIndex(heroImages, 0, 'https://images.unsplash.com/photo-1595781723824-9213a40e3257?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MHx8fHRlYWx8MTc3MTc2OTIxOXww&ixlib=rb-4.1.0&q=85');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg}
          alt="Tropical Paradise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl">
          <h1 className="hero-title">
            Discover Your Dream Destination
          </h1>
          <p className="hero-subtitle">
            Experience the world with BM Hospitality - your trusted partner for unforgettable journeys, 
            luxury accommodations, and personalized travel experiences.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center space-x-2 text-white/90">
              <MapPin className="w-5 h-5" />
              <span>50+ Destinations</span>
            </div>
            <div className="flex items-center space-x-2 text-white/90">
              <Calendar className="w-5 h-5" />
              <span>Custom Itineraries</span>
            </div>
            <div className="flex items-center space-x-2 text-white/90">
              <Award className="w-5 h-5" />
              <span>Award-Winning Service</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg"
              onClick={() => scrollToSection('packages')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Packages
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('contact')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white px-8 py-6 text-lg font-semibold"
            >
              Get Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
