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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden" data-testid="newsletter-popup">
        <button onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
          data-testid="newsletter-close-btn">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              <Gift className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Join Our Travel Community!</h2>
          <p className="text-teal-50 text-lg">Get exclusive offers, travel ideas, and exciting deals</p>
        </div>

        <div className="p-8">
          <div className="mb-6 space-y-3">
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

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="newsletter-form">
            <div>
              <Label htmlFor="popup-name" className="text-base font-semibold">Full Name *</Label>
              <Input id="popup-name" name="name" value={formData.name} onChange={handleInputChange}
                placeholder="Enter your full name" className="mt-1" required data-testid="newsletter-name-input" />
            </div>
            <div>
              <Label htmlFor="popup-email" className="text-base font-semibold">Email Address *</Label>
              <Input id="popup-email" name="email" type="email" value={formData.email} onChange={handleInputChange}
                placeholder="your@email.com" className="mt-1" required data-testid="newsletter-email-input" />
            </div>
            <div>
              <Label htmlFor="popup-phone" className="text-base font-semibold">Phone / WhatsApp *</Label>
              <Input id="popup-phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange}
                placeholder="+91 98765 43210" className="mt-1" required data-testid="newsletter-phone-input" />
            </div>
            <Button type="submit" disabled={loading} data-testid="newsletter-submit-btn"
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-lg py-6 font-bold">
              {loading ? 'Subscribing...' : 'Subscribe Now'}
            </Button>
            <p className="text-xs text-center text-gray-500">
              By subscribing, you agree to receive promotional emails and WhatsApp messages from BM Hospitality
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterPopup;
