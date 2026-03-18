import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { X, Bell, Gift, Plane } from 'lucide-react';
import { sendWhatsAppMessage } from '../mock';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const hasSubscribed = localStorage.getItem('bm_hospitality_subscribed');
    if (!hasSubscribed) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let msg = `*New Community Subscription - BM Hospitality*\n\n`;
      msg += `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n`;
      msg += `Interested In: New Offers, Travel Announcements, Travel Ideas & Tips`;
      sendWhatsAppMessage(msg);

      localStorage.setItem('bm_hospitality_subscribed', 'true');
      toast.success('Thank you for subscribing! You will receive exclusive offers and travel updates.');
      setIsOpen(false);
    } catch {
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('bm_hospitality_popup_closed', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 overflow-hidden" data-testid="newsletter-popup">
        <button onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
          data-testid="newsletter-close-btn">
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-5 sm:p-8 text-white text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Gift className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold mb-1">Join Our Travel Community!</h2>
          <p className="text-teal-50 text-sm sm:text-lg">Get exclusive offers, travel ideas, and exciting deals</p>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3 hidden sm:block">
            <div className="flex items-start space-x-3">
              <Gift className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Exclusive Offers & Deals</p>
                <p className="text-sm text-gray-600">Be the first to know about special discounts</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Latest Announcements</p>
                <p className="text-sm text-gray-600">Stay updated with new packages and destinations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Plane className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Travel Ideas & Tips</p>
                <p className="text-sm text-gray-600">Get inspired for your next adventure</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" data-testid="newsletter-form">
            <div>
              <Label htmlFor="popup-name" className="text-sm sm:text-base font-semibold">Full Name *</Label>
              <Input id="popup-name" name="name" value={formData.name} onChange={handleInputChange}
                placeholder="Enter your full name" className="mt-1" required data-testid="newsletter-name-input" />
            </div>
            <div>
              <Label htmlFor="popup-email" className="text-sm sm:text-base font-semibold">Email Address *</Label>
              <Input id="popup-email" name="email" type="email" value={formData.email} onChange={handleInputChange}
                placeholder="your@email.com" className="mt-1" required data-testid="newsletter-email-input" />
            </div>
            <div>
              <Label htmlFor="popup-phone" className="text-sm sm:text-base font-semibold">Phone / WhatsApp *</Label>
              <Input id="popup-phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange}
                placeholder="+91 98765 43210" className="mt-1" required data-testid="newsletter-phone-input" />
            </div>
            <Button type="submit" disabled={loading} data-testid="newsletter-submit-btn"
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-base sm:text-lg py-5 sm:py-6 font-bold">
              {loading ? 'Subscribing...' : 'Subscribe Now'}
            </Button>
          </form>

          <button onClick={handleClose} className="w-full text-center mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            data-testid="newsletter-skip-btn">
            Maybe Later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterPopup;
