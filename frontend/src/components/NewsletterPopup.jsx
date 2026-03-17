import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { X, Bell, Gift, Plane } from 'lucide-react';
import { sendWhatsAppMessage } from '../mock';
import { toast } from 'sonner';

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // Check if user has already subscribed (stored in localStorage)
    const hasSubscribed = localStorage.getItem('bm_hospitality_subscribed');
    
    if (!hasSubscribed) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare WhatsApp message
    let message = `*New Community Subscription - BM Hospitality*\n\n`;
    message += `📢 *Subscription Type:* Newsletter & Offers\n\n`;
    message += `*Subscriber Details:*\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📧 Email: ${formData.email}\n`;
    message += `📱 Phone: ${formData.phone}\n\n`;
    message += `*Interested In:*\n`;
    message += `✨ New Offers & Deals\n`;
    message += `📣 Travel Announcements\n`;
    message += `💡 Travel Ideas & Tips\n\n`;
    message += `_Community Subscription - BM Hospitality_`;
    
    // Send to WhatsApp
    sendWhatsAppMessage(message);
    
    // Store in localStorage
    localStorage.setItem('bm_hospitality_subscribed', 'true');
    
    // Show success toast
    toast.success('Thank you for subscribing! You will receive exclusive offers and travel updates.');
    
    // Close popup
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Set a flag so popup shows again on next visit
    localStorage.setItem('bm_hospitality_popup_closed', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              <Gift className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Join Our Travel Community!</h2>
          <p className="text-teal-50 text-lg">
            Get exclusive offers, travel ideas, and exciting deals
          </p>
        </div>

        <div className="p-8">
          {/* Benefits */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="popup-name" className="text-base font-semibold">Full Name *</Label>
              <Input 
                id="popup-name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="popup-email" className="text-base font-semibold">Email Address *</Label>
              <Input 
                id="popup-email" 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="popup-phone" className="text-base font-semibold">Phone Number *</Label>
              <Input 
                id="popup-phone" 
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className="mt-1"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-lg py-6 font-bold"
            >
              Subscribe Now
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
