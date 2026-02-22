import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar, MapPin, Users, Phone, Mail, MessageSquare } from 'lucide-react';
import { sendWhatsAppMessage } from '../mock';
import { toast } from 'sonner';

const QuickEnquiryForm = () => {
  const [formData, setFormData] = useState({
    packageType: '',
    name: '',
    email: '',
    phone: '',
    destination: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfAdults: '2',
    numberOfChildren: '0',
    budget: '',
    requirements: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate number of nights
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Prepare WhatsApp message
    let message = `*Travel Package Inquiry - BM Hospitality*\n\n`;
    message += `📦 *Package Type:* ${formData.packageType}\n\n`;
    message += `*Guest Details:*\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📧 Email: ${formData.email}\n`;
    message += `📱 Phone: ${formData.phone}\n\n`;
    message += `*Travel Details:*\n`;
    message += `📍 Destination: ${formData.destination}\n`;
    message += `📅 Check-in: ${formData.checkInDate}\n`;
    message += `📅 Check-out: ${formData.checkOutDate}\n`;
    message += `🌙 Duration: ${nights} nights\n`;
    message += `👥 Adults: ${formData.numberOfAdults} | Children: ${formData.numberOfChildren}\n`;
    
    if (formData.budget) {
      message += `💰 Budget: ${formData.budget}\n`;
    }
    if (formData.requirements) {
      message += `\n📝 *Requirements:*\n${formData.requirements}\n`;
    }
    
    message += `\n_Quick Inquiry Form - BM Hospitality_`;
    
    // Send to WhatsApp
    sendWhatsAppMessage(message);
    
    // Show success toast
    toast.success('Inquiry sent successfully! We will contact you on WhatsApp shortly with the best package options.');
    
    // Reset form
    setFormData({
      packageType: '',
      name: '',
      email: '',
      phone: '',
      destination: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfAdults: '2',
      numberOfChildren: '0',
      budget: '',
      requirements: ''
    });
  };

  return (
    <section id="quick-enquiry" className="py-20 bg-gradient-to-b from-teal-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Quick Travel Inquiry</h2>
            <p className="section-subtitle">
              Fill in your travel requirements and get personalized package options via WhatsApp
            </p>
          </div>

          <Card className="shadow-2xl border-2 border-teal-100">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <MessageSquare className="w-6 h-6 mr-3" />
                Get Your Custom Travel Package
              </CardTitle>
              <CardDescription className="text-teal-50 text-base">
                Choose your package type, fill in details, and receive instant quotation on WhatsApp
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Package Type Selection */}
                <div>
                  <Label htmlFor="packageType" className="text-base font-bold text-gray-800 mb-2 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-teal-600" />
                    Select Package Type *
                  </Label>
                  <select
                    id="packageType"
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleInputChange}
                    className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                    required
                  >
                    <option value="">-- Select Your Travel Package --</option>
                    <option value="Domestic Package (India)">🇮🇳 Domestic Package (India)</option>
                    <option value="International Package">✈️ International Package</option>
                    <option value="Goa Package">🏖️ Goa Hotels & Resorts</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <Label htmlFor="enquiry-name" className="text-base font-semibold text-gray-700">
                      Full Name *
                    </Label>
                    <Input 
                      id="enquiry-name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="mt-2 py-3 text-base"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="enquiry-email" className="text-base font-semibold text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-1 text-teal-600" />
                      Email Address *
                    </Label>
                    <Input 
                      id="enquiry-email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="mt-2 py-3 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <Label htmlFor="enquiry-phone" className="text-base font-semibold text-gray-700 flex items-center">
                      <Phone className="w-4 h-4 mr-1 text-teal-600" />
                      Phone Number *
                    </Label>
                    <Input 
                      id="enquiry-phone" 
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="mt-2 py-3 text-base"
                      required
                    />
                  </div>

                  {/* Destination */}
                  <div>
                    <Label htmlFor="enquiry-destination" className="text-base font-semibold text-gray-700">
                      Destination / Location *
                    </Label>
                    <Input 
                      id="enquiry-destination" 
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="e.g., Kashmir, Dubai, Goa"
                      className="mt-2 py-3 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Check-in Date */}
                  <div>
                    <Label htmlFor="enquiry-checkin" className="text-base font-semibold text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-teal-600" />
                      Check-in Date *
                    </Label>
                    <Input 
                      id="enquiry-checkin" 
                      name="checkInDate"
                      type="date"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2 py-3 text-base"
                      required
                    />
                  </div>

                  {/* Check-out Date */}
                  <div>
                    <Label htmlFor="enquiry-checkout" className="text-base font-semibold text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-teal-600" />
                      Check-out Date *
                    </Label>
                    <Input 
                      id="enquiry-checkout" 
                      name="checkOutDate"
                      type="date"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                      className="mt-2 py-3 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Number of Adults */}
                  <div>
                    <Label htmlFor="enquiry-adults" className="text-base font-semibold text-gray-700 flex items-center">
                      <Users className="w-4 h-4 mr-1 text-teal-600" />
                      Adults *
                    </Label>
                    <Input 
                      id="enquiry-adults" 
                      name="numberOfAdults"
                      type="number"
                      min="1"
                      value={formData.numberOfAdults}
                      onChange={handleInputChange}
                      className="mt-2 py-3 text-base"
                      required
                    />
                  </div>

                  {/* Number of Children */}
                  <div>
                    <Label htmlFor="enquiry-children" className="text-base font-semibold text-gray-700">
                      Children
                    </Label>
                    <Input 
                      id="enquiry-children" 
                      name="numberOfChildren"
                      type="number"
                      min="0"
                      value={formData.numberOfChildren}
                      onChange={handleInputChange}
                      className="mt-2 py-3 text-base"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <Label htmlFor="enquiry-budget" className="text-base font-semibold text-gray-700">
                      Budget (Optional)
                    </Label>
                    <Input 
                      id="enquiry-budget" 
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="e.g., ₹50,000"
                      className="mt-2 py-3 text-base"
                    />
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <Label htmlFor="enquiry-requirements" className="text-base font-semibold text-gray-700">
                    Special Requirements / Preferences
                  </Label>
                  <Textarea 
                    id="enquiry-requirements" 
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Tell us about your preferences, activities you'd like, dietary requirements, special occasions, etc."
                    rows={4}
                    className="mt-2 text-base"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Send Inquiry via WhatsApp
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    💬 Get instant response on WhatsApp with personalized package options
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Stats */}
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
