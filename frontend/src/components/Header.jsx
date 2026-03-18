import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      scrollToSection('packages');
      setSearchQuery('');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`} data-testid="main-header">
      {/* Top bar with contact info */}
      <div className="bg-teal-700 text-white py-1 px-4">
        <div className="container mx-auto flex items-center justify-end text-xs">
          <div className="flex items-center space-x-4">
            <span>+91 9890765859</span>
            <span className="hidden sm:inline">bmhospitality.11@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')} data-testid="header-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_bm-getaway/artifacts/54xolseq_bm_hospitality_logo.png" 
              alt="BM Hospitality" 
              className="h-12 w-12 object-contain"
              style={{ background: 'transparent', mixBlendMode: 'multiply' }}
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-teal-700">BM Hospitality</h1>
              <p className="text-xs text-gray-600">Your Journey, Our Passion</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-5">
            <button onClick={() => scrollToSection('packages')} className="nav-link text-sm">Packages</button>
            <button onClick={() => scrollToSection('goa-packages')} className="nav-link text-sm">Goa Holidays</button>
            <button onClick={() => scrollToSection('hotels-resorts')} className="nav-link text-sm">Hotels & Resorts</button>
            <button onClick={() => scrollToSection('bohra-stay')} className="nav-link text-sm">Bohra Mumeneen Stays</button>
            <button onClick={() => scrollToSection('flight-inquiry')} className="nav-link text-sm">Flight Inquiry</button>
            <button onClick={() => scrollToSection('offers')} className="nav-link text-sm">Offers & Deals</button>
            <button onClick={() => scrollToSection('blogs')} className="nav-link text-sm">Travel Blogs</button>
            <button onClick={() => scrollToSection('testimonials')} className="nav-link text-sm">Testimonials</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link text-sm">Contact Us</button>
          </nav>

          {/* Search Box */}
          <div className="hidden lg:flex items-center space-x-3">
            <form onSubmit={handleSearch} className="relative" data-testid="header-search-form">
              <Input type="text" placeholder="Search..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 pr-10 py-2 border-2 border-gray-200 focus:border-teal-500 text-sm"
                data-testid="header-search-input" />
              <button type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600"
                data-testid="header-search-btn">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4" data-testid="mobile-menu">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input type="text" placeholder="Search..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} className="w-full pr-10 py-2 border-2 border-gray-200" />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
            <div className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection('packages')} className="mobile-nav-link">Packages</button>
              <button onClick={() => scrollToSection('goa-packages')} className="mobile-nav-link">Goa Holidays</button>
              <button onClick={() => scrollToSection('hotels-resorts')} className="mobile-nav-link">Hotels & Resorts</button>
              <button onClick={() => scrollToSection('bohra-stay')} className="mobile-nav-link">Bohra Mumeneen Stays</button>
              <button onClick={() => scrollToSection('flight-inquiry')} className="mobile-nav-link">Flight Inquiry</button>
              <button onClick={() => scrollToSection('offers')} className="mobile-nav-link">Offers & Deals</button>
              <button onClick={() => scrollToSection('blogs')} className="mobile-nav-link">Travel Blogs</button>
              <button onClick={() => scrollToSection('testimonials')} className="mobile-nav-link">Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className="mobile-nav-link">Contact Us</button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
