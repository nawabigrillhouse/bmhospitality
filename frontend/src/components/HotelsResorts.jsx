import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Hotel, MapPin, Calendar, Users, Utensils } from 'lucide-react';
import { sendWhatsAppMessage } from '../mock';
import { toast } from 'sonner';

const HotelsResorts = () => {
  const [formData, setFormData] = useState({
    destination: '',
    checkInDate: '',
    checkOutDate: '',
    adults: '2',
    children: '0',
    childAges: '',
    mealPlan: 'Room Only'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    let message = `*Hotel/Resort Booking Inquiry - BM Hospitality*\n\n`;
    message += `🏨 *Booking Details:*\n`;
    message += `📍 Destination: ${formData.destination}\n`;
    message += `📅 Check-in: ${formData.checkInDate}\n`;
    message += `📅 Check-out: ${formData.checkOutDate}\n`;
    message += `🌙 Number of Nights: ${nights}\n`;
    message += `👥 Adults: ${formData.adults}\n`;
    message += `👶 Children: ${formData.children}\n`;
    if (formData.children !== '0' && formData.childAges) {
      message += `🎂 Children Ages: ${formData.childAges}\n`;
    }
    message += `🍽️ Meal Plan: ${formData.mealPlan}\n\n`;
    message += `_Hotel/Resort Inquiry - BM Hospitality_`;
    
    sendWhatsAppMessage(message);
    toast.success('Hotel inquiry sent! We will send you the best options on WhatsApp.');
    
    setFormData({
      destination: '',
      checkInDate: '',
      checkOutDate: '',
      adults: '2',
      children: '0',
      childAges: '',
      mealPlan: 'Room Only'
    });
  };

  return (
    <section id="hotels-resorts" className="py-20 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Hotel className="w-12 h-12 text-amber-600 mr-3" />
            <h2 className="section-title mb-0">Hotels & Resorts Worldwide</h2>
          </div>
          <p className="section-subtitle">
            Find and book the perfect accommodation anywhere in the world - From budget hotels to luxury resorts
          </p>
        </div>

        <Card className="max-w-5xl mx-auto shadow-2xl border-2 border-amber-100">
          <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <MapPin className="w-6 h-6 mr-3" />
              Search Hotels & Resorts
            </CardTitle>
            <p className="text-amber-50 mt-2">Search accommodations worldwide and get personalized recommendations</p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination */}
              <div>
                <Label htmlFor="destination" className="text-base font-bold text-gray-800 flex items-center mb-2">
                  <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                  Destination (Worldwide Search) *
                </Label>
                <Input
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Enter city, country, or hotel name (e.g., Paris, Dubai, Maldives)"
                  className="text-base py-6"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Search any destination worldwide</p>
              </div>

              {/* Check-in and Check-out */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="checkInDate" className="text-base font-semibold flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                    Check-in Date *
                  </Label>
                  <Input
                    id="checkInDate"
                    name="checkInDate"
                    type="date"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="text-base py-3"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="checkOutDate" className="text-base font-semibold flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                    Check-out Date *
                  </Label>
                  <Input
                    id="checkOutDate"
                    name="checkOutDate"
                    type="date"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                    className="text-base py-3"
                    required
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="adults" className="text-base font-semibold flex items-center mb-2">
                    <Users className="w-5 h-5 mr-2 text-amber-600" />
                    Number of Adults *
                  </Label>
                  <Input
                    id="adults"
                    name="adults"
                    type="number"
                    min="1"
                    value={formData.adults}
                    onChange={handleInputChange}
                    className="text-base py-3"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="children" className="text-base font-semibold mb-2 block">
                    Number of Children
                  </Label>
                  <Input
                    id="children"
                    name="children"
                    type="number"
                    min="0"
                    value={formData.children}
                    onChange={handleInputChange}
                    className="text-base py-3"
                  />
                </div>
              </div>

              {/* Child Ages */}
              {formData.children !== '0' && parseInt(formData.children) > 0 && (
                <div>
                  <Label htmlFor="childAges" className="text-base font-semibold mb-2 block">
                    Ages of Children *
                  </Label>
                  <Input
                    id="childAges"
                    name="childAges"
                    value={formData.childAges}
                    onChange={handleInputChange}
                    placeholder="Enter ages separated by commas (e.g., 5, 8, 12)"
                    className="text-base py-3"
                    required={formData.children !== '0'}
                  />
                  <p className="text-sm text-gray-500 mt-1">Required for accurate pricing and room allocation</p>
                </div>
              )}

              {/* Meal Plan */}
              <div>
                <Label htmlFor="mealPlan" className="text-base font-semibold flex items-center mb-2">
                  <Utensils className="w-5 h-5 mr-2 text-amber-600" />
                  Meal Plan Preference *
                </Label>
                <select
                  id="mealPlan"
                  name="mealPlan"
                  value={formData.mealPlan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="Room Only">Room Only (No Meals)</option>
                  <option value="Bed & Breakfast">Bed & Breakfast (BB)</option>
                  <option value="Half Board">Half Board (Breakfast + Dinner)</option>
                  <option value="Full Board">Full Board (All Meals)</option>
                  <option value="All Inclusive">All Inclusive</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg py-6 font-bold"
              >
                Search Hotels & Get Best Rates
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-bold text-gray-800 mb-2">Worldwide Coverage</h3>
            <p className="text-sm text-gray-600">Search hotels in any destination globally</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-bold text-gray-800 mb-2">Best Price Guarantee</h3>
            <p className="text-sm text-gray-600">Get competitive rates for all properties</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="font-bold text-gray-800 mb-2">Instant WhatsApp Support</h3>
            <p className="text-sm text-gray-600">24/7 assistance for all your queries</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelsResorts;
