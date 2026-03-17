import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Hotel, MapPin, Calendar, Users, Utensils, Mail, Phone, Send } from 'lucide-react';
import { sendWhatsAppMessage } from '../mock';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const HotelsResorts = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '', checkInDate: '', checkOutDate: '', adults: '2',
    children: '0', childAges: '', mealPlan: 'Room Only', email: '', whatsapp: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/hotel-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: formData.destination, check_in_date: formData.checkInDate,
          check_out_date: formData.checkOutDate, adults: formData.adults,
          children: formData.children, child_ages: formData.children !== '0' ? formData.childAges : null,
          meal_plan: formData.mealPlan, email: formData.email, whatsapp: formData.whatsapp
        })
      });

      const nights = Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24));
      let msg = `*Hotel/Resort Inquiry - BM Hospitality*\n\n`;
      msg += `*Booking Details:*\n`;
      msg += `Destination: ${formData.destination}\nCheck-in: ${formData.checkInDate}\nCheck-out: ${formData.checkOutDate}\n`;
      msg += `Nights: ${nights}\nAdults: ${formData.adults}\nChildren: ${formData.children}\n`;
      if (formData.children !== '0' && formData.childAges) msg += `Children Ages: ${formData.childAges}\n`;
      msg += `Meal Plan: ${formData.mealPlan}\n\n`;
      msg += `*Contact:*\nEmail: ${formData.email}\nWhatsApp: ${formData.whatsapp}`;
      sendWhatsAppMessage(msg);

      toast.success('Hotel inquiry submitted! We will send you the best options on your email and WhatsApp.');
      setFormData({ destination: '', checkInDate: '', checkOutDate: '', adults: '2',
        children: '0', childAges: '', mealPlan: 'Room Only', email: '', whatsapp: '' });
    } catch {
      toast.error('Failed to submit. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hotels-resorts" className="py-20 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Hotel className="w-12 h-12 text-amber-600 mr-3" />
            <h2 className="section-title mb-0" data-testid="hotels-title">Hotels & Resorts Worldwide</h2>
          </div>
          <p className="section-subtitle">
            Find and book the perfect accommodation anywhere in the world - From budget hotels to luxury resorts
          </p>
        </div>

        <Card className="max-w-5xl mx-auto shadow-2xl border-2 border-amber-100">
          <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <MapPin className="w-6 h-6 mr-3" /> Search Hotels & Resorts
            </CardTitle>
            <p className="text-amber-50 mt-2">Search accommodations worldwide and get personalized recommendations</p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="hotel-inquiry-form">
              <div>
                <Label htmlFor="destination" className="text-base font-bold text-gray-800 flex items-center mb-2">
                  <MapPin className="w-5 h-5 mr-2 text-amber-600" /> Destination (Worldwide Search) *
                </Label>
                <Input id="destination" name="destination" value={formData.destination} onChange={handleInputChange}
                  placeholder="Enter city, country, or hotel name (e.g., Paris, Dubai, Maldives)"
                  className="text-base py-6" required data-testid="hotel-destination-input" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="checkInDate" className="text-base font-semibold flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-amber-600" /> Check-in Date *
                  </Label>
                  <Input id="checkInDate" name="checkInDate" type="date" value={formData.checkInDate}
                    onChange={handleInputChange} min={new Date().toISOString().split('T')[0]}
                    className="text-base py-3" required />
                </div>
                <div>
                  <Label htmlFor="checkOutDate" className="text-base font-semibold flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-amber-600" /> Check-out Date *
                  </Label>
                  <Input id="checkOutDate" name="checkOutDate" type="date" value={formData.checkOutDate}
                    onChange={handleInputChange} min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                    className="text-base py-3" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="adults" className="text-base font-semibold flex items-center mb-2">
                    <Users className="w-5 h-5 mr-2 text-amber-600" /> Number of Adults *
                  </Label>
                  <Input id="adults" name="adults" type="number" min="1" value={formData.adults}
                    onChange={handleInputChange} className="text-base py-3" required />
                </div>
                <div>
                  <Label htmlFor="children" className="text-base font-semibold mb-2 block">Number of Children</Label>
                  <Input id="children" name="children" type="number" min="0" value={formData.children}
                    onChange={handleInputChange} className="text-base py-3" />
                </div>
              </div>

              {formData.children !== '0' && parseInt(formData.children) > 0 && (
                <div>
                  <Label htmlFor="childAges" className="text-base font-semibold mb-2 block">Ages of Children *</Label>
                  <Input id="childAges" name="childAges" value={formData.childAges} onChange={handleInputChange}
                    placeholder="Enter ages separated by commas (e.g., 5, 8, 12)"
                    className="text-base py-3" required={formData.children !== '0'} />
                </div>
              )}

              <div>
                <Label htmlFor="mealPlan" className="text-base font-semibold flex items-center mb-2">
                  <Utensils className="w-5 h-5 mr-2 text-amber-600" /> Meal Plan Preference *
                </Label>
                <select id="mealPlan" name="mealPlan" value={formData.mealPlan} onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                  <option value="Room Only">Room Only (No Meals)</option>
                  <option value="Bed & Breakfast">Bed & Breakfast (BB)</option>
                  <option value="Half Board">Half Board (Breakfast + Dinner)</option>
                  <option value="Full Board">Full Board (All Meals)</option>
                  <option value="All Inclusive">All Inclusive</option>
                </select>
              </div>

              <div className="border-t-2 border-amber-100 pt-6">
                <h3 className="text-lg font-bold mb-1 text-gray-800">Get Your Personalized Quote</h3>
                <p className="text-sm text-gray-500 mb-4">Share your contact details and we'll send you the best rates directly</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="hotel-email" className="text-base font-semibold flex items-center mb-2">
                      <Mail className="w-5 h-5 mr-2 text-amber-600" /> Email Address *
                    </Label>
                    <Input id="hotel-email" name="email" type="email" value={formData.email}
                      onChange={handleInputChange} placeholder="your@email.com"
                      className="text-base py-3" required data-testid="hotel-email-input" />
                  </div>
                  <div>
                    <Label htmlFor="hotel-whatsapp" className="text-base font-semibold flex items-center mb-2">
                      <Phone className="w-5 h-5 mr-2 text-amber-600" /> WhatsApp Number *
                    </Label>
                    <Input id="hotel-whatsapp" name="whatsapp" type="tel" value={formData.whatsapp}
                      onChange={handleInputChange} placeholder="+91 98765 43210"
                      className="text-base py-3" required data-testid="hotel-whatsapp-input" />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} data-testid="hotel-submit-btn"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg py-6 font-bold">
                <Send className="w-5 h-5 mr-2" />
                {loading ? 'Submitting...' : 'Get My Hotel Quote via Email & WhatsApp'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <MapPin className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Worldwide Coverage</h3>
            <p className="text-sm text-gray-600">Search hotels in any destination globally</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Hotel className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Best Price Guarantee</h3>
            <p className="text-sm text-gray-600">Get competitive rates for all properties</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Phone className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Instant WhatsApp Support</h3>
            <p className="text-sm text-gray-600">24/7 assistance for all your queries</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelsResorts;
