import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Our Services', href: '#services' },
    { name: 'Travel Packages', href: '#packages' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact Us', href: '#contact' }
  ];

  const destinations = [
    'Maldives',
    'Bali',
    'Caribbean',
    'Thailand',
    'Dubai',
    'Greece',
    'Switzerland',
    'Japan'
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_bm-getaway/artifacts/54xolseq_bm_hospitality_logo.png" 
                alt="BM Hospitality" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">BM Hospitality</h3>
                <p className="text-sm text-gray-400">Your Journey, Our Passion</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Creating unforgettable travel experiences since 2010. We turn your dream destinations into reality with personalized service and expert planning.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="footer-social-icon">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/bm_hospitality?igsh=MTZ4Z280NnVvbmVlYw==" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
                <Instagram size={20} />
              </a>
              <a href="#" className="footer-social-icon">
                <Twitter size={20} />
              </a>
              <a href="#" className="footer-social-icon">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-lg font-bold mb-6">Popular Destinations</h4>
            <ul className="space-y-3">
              {destinations.map((destination, index) => (
                <li key={index}>
                  <a href="#packages" className="footer-link">
                    {destination}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-400">
                  104 Dattakrupa Apartment<br />
                  Dattawadi, Mapusa<br />
                  Goa, India
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">+91 9890765859<br />+91 8329416113 (WhatsApp)</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">bmhospitality.11@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} BM Hospitality. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
