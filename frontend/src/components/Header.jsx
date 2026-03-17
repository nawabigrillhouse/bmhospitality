import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const INSTAGRAM_URL = 'https://www.instagram.com/bm_hospitality/';

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
      {/* Top bar with Instagram */}
      <div className="bg-teal-700 text-white py-1 px-4">
        <div className="container mx-auto flex items-center justify-between text-xs">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center space-x-1.5 hover:text-teal-200 transition-colors"
            data-testid="header-instagram-link">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="font-medium">Follow @BM_Hospitality</span>
          </a>
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
