import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plane, Calendar, Users, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const FlightInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', from: '', to: '',
    departureDate: '', returnDate: '', passengers: '1',
    class: 'Economy', tripType: 'Round Trip'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to DB (email notification sent automatically by backend)
      await fetch(`${API_URL}/api/flight-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, email: formData.email, phone: formData.phone,
          from_city: formData.from, to_city: formData.to,
          departure_date: formData.departureDate,
          return_date: formData.tripType === 'Round Trip' ? formData.returnDate : null,
          passengers: formData.passengers, travel_class: formData.class,
          trip_type: formData.tripType
        })
      });

      toast.success('Flight inquiry submitted! We will get back to you with the best flight options.');
      setFormData({ name: '', email: '', phone: '', from: '', to: '',
        departureDate: '', returnDate: '', passengers: '1', class: 'Economy', tripType: 'Round Trip' });
    } catch {
      toast.error('Failed to submit. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="flight-inquiry" className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Plane className="w-12 h-12 text-blue-600 mr-3" />
            <h2 className="section-title mb-0" data-testid="flight-inquiry-title">Flight Booking Inquiry</h2>
          </div>
          <p className="section-subtitle">
            Share your travel details and we'll find you the best flight deals at competitive prices
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <CardTitle className="text-2xl">Book Your Flight</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="flight-inquiry-form">
              <div>
                <Label className="text-base font-semibold">Trip Type</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input type="radio" name="tripType" value="Round Trip"
                      checked={formData.tripType === 'Round Trip'} onChange={handleInputChange} className="mr-2" />
                    <span>Round Trip</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="tripType" value="One Way"
                      checked={formData.tripType === 'One Way'} onChange={handleInputChange} className="mr-2" />
                    <span>One Way</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="from" className="text-base font-semibold flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-blue-600" /> From (City/Airport) *
                  </Label>
                  <Input id="from" name="from" value={formData.from} onChange={handleInputChange}
                    placeholder="e.g., Mumbai" className="mt-1" required data-testid="flight-from-input" />
                </div>
                <div>
                  <Label htmlFor="to" className="text-base font-semibold flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-blue-600" /> To (City/Airport) *
                  </Label>
                  <Input id="to" name="to" value={formData.to} onChange={handleInputChange}
                    placeholder="e.g., Dubai" className="mt-1" required data-testid="flight-to-input" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="departureDate" className="text-base font-semibold flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-blue-600" /> Departure Date *
                  </Label>
                  <Input id="departureDate" name="departureDate" type="date"
                    value={formData.departureDate} onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]} className="mt-1" required />
                </div>
                {formData.tripType === 'Round Trip' && (
                  <div>
                    <Label htmlFor="returnDate" className="text-base font-semibold flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-blue-600" /> Return Date *
                    </Label>
                    <Input id="returnDate" name="returnDate" type="date"
                      value={formData.returnDate} onChange={handleInputChange}
                      min={formData.departureDate || new Date().toISOString().split('T')[0]}
                      className="mt-1" required={formData.tripType === 'Round Trip'} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="passengers" className="text-base font-semibold flex items-center">
                    <Users className="w-4 h-4 mr-1 text-blue-600" /> Number of Passengers *
                  </Label>
                  <Input id="passengers" name="passengers" type="number" min="1"
                    value={formData.passengers} onChange={handleInputChange} className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="class" className="text-base font-semibold">Travel Class *</Label>
                  <select id="class" name="class" value={formData.class} onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business Class</option>
                    <option value="First">First Class</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="flight-name">Full Name *</Label>
                    <Input id="flight-name" name="name" value={formData.name} onChange={handleInputChange}
                      placeholder="Enter your name" required data-testid="flight-name-input" />
                  </div>
                  <div>
                    <Label htmlFor="flight-email">Email *</Label>
                    <Input id="flight-email" name="email" type="email" value={formData.email}
                      onChange={handleInputChange} placeholder="your@email.com" required data-testid="flight-email-input" />
                  </div>
                  <div>
                    <Label htmlFor="flight-phone">Phone / WhatsApp *</Label>
                    <Input id="flight-phone" name="phone" type="tel" value={formData.phone}
                      onChange={handleInputChange} placeholder="+91 98765 43210" required data-testid="flight-phone-input" />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} data-testid="flight-submit-btn"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 font-bold">
                <Send className="w-5 h-5 mr-2" />
                {loading ? 'Submitting...' : 'Get Flight Quote via Email & WhatsApp'}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-2">
                Our team will find the best flight options and contact you via email and WhatsApp
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FlightInquiry;
