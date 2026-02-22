import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <img 
              src="https://customer-assets.emergentagent.com/job_bm-getaway/artifacts/54xolseq_bm_hospitality_logo.png" 
              alt="BM Hospitality" 
              className="h-12 w-12 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-teal-700">BM Hospitality</h1>
              <p className="text-xs text-gray-600">Your Journey, Our Passion</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('hero')} className="nav-link">Home</button>
            <button onClick={() => scrollToSection('packages')} className="nav-link">Packages</button>
            <button onClick={() => scrollToSection('services')} className="nav-link">Services</button>
            <button onClick={() => scrollToSection('gallery')} className="nav-link">Gallery</button>
            <button onClick={() => scrollToSection('testimonials')} className="nav-link">Testimonials</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection('hero')} className="mobile-nav-link">Home</button>
              <button onClick={() => scrollToSection('packages')} className="mobile-nav-link">Packages</button>
              <button onClick={() => scrollToSection('services')} className="mobile-nav-link">Services</button>
              <button onClick={() => scrollToSection('gallery')} className="mobile-nav-link">Gallery</button>
              <button onClick={() => scrollToSection('testimonials')} className="mobile-nav-link">Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className="mobile-nav-link">Contact</button>
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-teal-600 hover:bg-teal-700 text-white w-full"
              >
                Book Now
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
