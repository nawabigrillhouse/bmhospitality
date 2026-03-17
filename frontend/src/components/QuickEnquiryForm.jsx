import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar, MapPin, Users, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const QuickEnquiryForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    packageType: '', name: '', email: '', phone: '', destination: '',
    checkInDate: '', checkOutDate: '', numberOfAdults: '2',
    numberOfChildren: '0', budget: '', requirements: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_type: formData.packageType,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          destination: formData.destination,
          check_in_date: formData.checkInDate,
          check_out_date: formData.checkOutDate,
          number_of_adults: formData.numberOfAdults,
          number_of_children: formData.numberOfChildren,
          budget: formData.budget || null,
          requirements: formData.requirements || null
        })
      });
      if (res.ok) {
        toast.success('Inquiry sent successfully! We will contact you shortly with the best package options.');
        setFormData({
          packageType: '', name: '', email: '', phone: '', destination: '',
          checkInDate: '', checkOutDate: '', numberOfAdults: '2',
          numberOfChildren: '0', budget: '', requirements: ''
        });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Failed to submit. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="quick-enquiry" className="py-20 bg-gradient-to-b from-teal-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title" data-testid="quick-enquiry-title">Quick Travel Inquiry</h2>
            <p className="section-subtitle">Fill in your travel requirements and get personalized package options</p>
          </div>

          <Card className="shadow-2xl border-2 border-teal-100">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <MessageSquare className="w-6 h-6 mr-3" /> Get Your Custom Travel Package
              </CardTitle>
              <CardDescription className="text-teal-50 text-base">
                Choose your package type, fill in details, and receive instant quotation
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="quick-enquiry-form">
                <div>
                  <Label htmlFor="packageType" className="text-base font-bold text-gray-800 mb-2 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-teal-600" /> Select Package Type *
                  </Label>
                  <select id="packageType" name="packageType" value={formData.packageType}
                    onChange={handleInputChange}
                    className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                    required>
                    <option value="">-- Select Your Travel Package --</option>
                    <option value="Domestic Package (India)">Domestic Package (India)</option>
                    <option value="International Package">International Package</option>
                    <option value="Goa Package">Goa Hotels & Resorts</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="enquiry-name" className="text-base font-semibold text-gray-700">Full Name *</Label>
                    <Input id="enquiry-name" name="name" value={formData.name} onChange={handleInputChange}
                      placeholder="Enter your full name" className="mt-2 py-3 text-base" required data-testid="enquiry-name-input" />
                  </div>
                  <div>
                    <Label htmlFor="enquiry-email" className="text-base font-semibold text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-1 text-teal-600" /> Email Address *
                    </Label>
                    <Input id="enquiry-email" name="email" type="email" value={formData.email}
                      onChange={handleInputChange} placeholder="your@email.com" className="mt-2 py-3 text-base" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="enquiry-phone" className="text-base font-semibold text-gray-700 flex items-center">
                      <Phone className="w-4 h-4 mr-1 text-teal-600" /> Phone Number *
                    </Label>
                    <Input id="enquiry-phone" name="phone" type="tel" value={formData.phone}
                      onChange={handleInputChange} placeholder="+91 98765 43210" className="mt-2 py-3 text-base" required />
                  </div>
                  <div>
                    <Label htmlFor="enquiry-destination" className="text-base font-semibold text-gray-700">
                      Destination / Location *
                    </Label>
                    <Input id="enquiry-destination" name="destination" value={formData.destination}
                      onChange={handleInputChange} placeholder="e.g., Kashmir, Dubai, Goa"
                      className="mt-2 py-3 text-base" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="enquiry-checkin" className="text-base font-semibold text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-teal-600" /> Check-in Date *
                    </Label>
                    <Input id="enquiry-checkin" name="checkInDate" type="date" value={formData.checkInDate}
                      onChange={handleInputChange} min={new Date().toISOString().split('T')[0]}
                      className="mt-2 py-3 text-base" required />
                  </div>
                  <div>
                    <Label htmlFor="enquiry-checkout" className="text-base font-semibold text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-teal-600" /> Check-out Date *
                    </Label>
                    <Input id="enquiry-checkout" name="checkOutDate" type="date" value={formData.checkOutDate}
                      onChange={handleInputChange} min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                      className="mt-2 py-3 text-base" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="enquiry-adults" className="text-base font-semibold text-gray-700 flex items-center">
                      <Users className="w-4 h-4 mr-1 text-teal-600" /> Adults *
                    </Label>
                    <Input id="enquiry-adults" name="numberOfAdults" type="number" min="1"
                      value={formData.numberOfAdults} onChange={handleInputChange}
                      className="mt-2 py-3 text-base" required />
                  </div>
                  <div>
                    <Label htmlFor="enquiry-children" className="text-base font-semibold text-gray-700">Children</Label>
                    <Input id="enquiry-children" name="numberOfChildren" type="number" min="0"
                      value={formData.numberOfChildren} onChange={handleInputChange}
                      className="mt-2 py-3 text-base" />
                  </div>
                  <div>
                    <Label htmlFor="enquiry-budget" className="text-base font-semibold text-gray-700">Budget (Optional)</Label>
                    <Input id="enquiry-budget" name="budget" value={formData.budget}
                      onChange={handleInputChange} placeholder="e.g., 50,000"
                      className="mt-2 py-3 text-base" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="enquiry-requirements" className="text-base font-semibold text-gray-700">
                    Special Requirements / Preferences
                  </Label>
                  <Textarea id="enquiry-requirements" name="requirements" value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Tell us about your preferences, activities you'd like, dietary requirements, special occasions, etc."
                    rows={4} className="mt-2 text-base" />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading} data-testid="enquiry-submit-btn"
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? 'Submitting...' : 'Send Travel Inquiry'}
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    We'll get back to you with personalized package options
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
              <p className="text-gray-600">Destinations Covered</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
              <p className="text-gray-600">WhatsApp Support</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl font-bold text-teal-600 mb-2">1000+</div>
              <p className="text-gray-600">Happy Travelers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickEnquiryForm;
