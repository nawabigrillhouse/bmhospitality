import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Check, MapPin, Palmtree, Star, Calendar, Users, Mail, Phone, Send, Hotel, UserCheck, Heart, UsersRound } from 'lucide-react';
import { sendWhatsAppMessage } from '../mock';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const stayCategories = [
  { value: 'Budget Hotels - 3 Star', label: 'Budget Hotels - 3 Star', stars: 3, icon: Star },
  { value: 'Premium Hotels & Resorts - 4 Star', label: 'Premium Hotels & Resorts - 4 Star', stars: 4, icon: Star },
  { value: 'Luxury Hotels & Resorts - 5 Star', label: 'Luxury Hotels & Resorts - 5 Star', stars: 5, icon: Star },
  { value: 'Stay for Bachelors', label: 'Stay for Bachelors', stars: 0, icon: UserCheck },
  { value: 'Stay for Family', label: 'Stay for Family', stars: 0, icon: UsersRound },
  { value: 'Stay for Couples', label: 'Stay for Couples', stars: 0, icon: Heart },
  { value: 'Stay for Groups', label: 'Stay for Groups', stars: 0, icon: Users },
];

const GoaPackage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goaRegion: '',
    stayPreference: '',
    name: '', email: '', whatsapp: '',
    checkInDate: '', checkOutDate: '',
    numberOfAdults: '2', numberOfChildren: '0',
    roomType: '', mealPlan: 'Room Only', specialRequests: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nights = Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24));

      // Send WhatsApp FIRST (before async fetch for mobile compatibility)
      let msg = `*Goa Hotel/Resort Inquiry - BM Hospitality*\n\n`;
      msg += `*Region:* ${formData.goaRegion}\n`;
      msg += `*Stay Preference:* ${formData.stayPreference}\n\n`;
      msg += `*Guest:*\nName: ${formData.name}\nEmail: ${formData.email}\nWhatsApp: ${formData.whatsapp}\n\n`;
      msg += `*Booking:*\nCheck-in: ${formData.checkInDate}\nCheck-out: ${formData.checkOutDate}\nNights: ${nights}\n`;
      msg += `Adults: ${formData.numberOfAdults}\nChildren: ${formData.numberOfChildren}\n`;
      if (formData.roomType) msg += `Room Type: ${formData.roomType}\n`;
      msg += `Meal Plan: ${formData.mealPlan}\n`;
      if (formData.specialRequests) msg += `\nSpecial Requests:\n${formData.specialRequests}`;
      sendWhatsAppMessage(msg);

      // Save to DB in background
      fetch(`${API_URL}/api/hotel-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: `${formData.goaRegion} - ${formData.stayPreference}`,
          check_in_date: formData.checkInDate,
          check_out_date: formData.checkOutDate,
          adults: formData.numberOfAdults,
          children: formData.numberOfChildren,
          child_ages: null,
          meal_plan: formData.mealPlan,
          email: formData.email,
          whatsapp: formData.whatsapp
        })
      });

      toast.success('Goa hotel inquiry submitted! We will send you the best options via email and WhatsApp.');
      setFormData({
        goaRegion: '', stayPreference: '', name: '', email: '', whatsapp: '',
        checkInDate: '', checkOutDate: '', numberOfAdults: '2',
        numberOfChildren: '0', roomType: '', mealPlan: 'Room Only', specialRequests: ''
      });
    } catch {
      toast.error('Failed to submit. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const PreferenceCard = ({ cat, selected, onChange }) => {
    const Icon = cat.icon;
    return (
      <label
        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
          selected === cat.value
            ? 'border-orange-500 bg-orange-50 shadow-lg'
            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
        }`}
        data-testid={`stay-pref-${cat.value.replace(/\s+/g, '-').toLowerCase()}`}>
        <input type="radio" name="stayPreference" value={cat.value}
          checked={selected === cat.value} onChange={onChange} className="sr-only" />
        <div className="flex items-center w-full">
          {cat.stars > 0 ? (
            <div className="flex mr-3">
              {Array.from({ length: cat.stars }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-500" />
              ))}
            </div>
          ) : (
            <Icon className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0" />
          )}
          <span className="font-semibold text-gray-800 text-sm">{cat.label}</span>
        </div>
      </label>
    );
  };

  return (
    <section id="goa-packages" className="py-20 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Palmtree className="w-12 h-12 text-orange-600 mr-3" />
            <h2 className="section-title mb-0" data-testid="goa-packages-title">Goa Hotels & Resorts</h2>
          </div>
          <p className="section-subtitle max-w-3xl mx-auto">
            Exclusive selection of premium hotels and resorts in North & South Goa
          </p>
        </div>

        <Card className="max-w-5xl mx-auto shadow-2xl border-2 border-orange-100 mb-16" data-testid="goa-inquiry-card">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-500 text-white">
            <CardTitle className="text-2xl flex items-center">
              <Hotel className="w-6 h-6 mr-3" /> Book Goa Hotels & Resorts
            </CardTitle>
            <p className="text-orange-50 mt-2">Select your region, stay preference and get personalized quotes</p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8" data-testid="goa-inquiry-form">
              {/* Step 1: Region Selection */}
              <div>
                <Label className="text-lg font-bold text-gray-800 mb-4 block">Step 1: Select Your Region *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.goaRegion === 'North Goa'
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`} data-testid="region-north-goa">
                    <input type="radio" name="goaRegion" value="North Goa"
                      checked={formData.goaRegion === 'North Goa'} onChange={handleInputChange} className="sr-only" required />
                    <MapPin className="w-10 h-10 text-orange-600 mb-2" />
                    <span className="text-xl font-bold text-gray-800">North Goa</span>
                    <span className="text-sm text-gray-500 mt-1">Calangute, Baga, Anjuna, Vagator, Candolim</span>
                  </label>

                  <label className={`flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.goaRegion === 'South Goa'
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`} data-testid="region-south-goa">
                    <input type="radio" name="goaRegion" value="South Goa"
                      checked={formData.goaRegion === 'South Goa'} onChange={handleInputChange} className="sr-only" required />
                    <MapPin className="w-10 h-10 text-orange-600 mb-2" />
                    <span className="text-xl font-bold text-gray-800">South Goa</span>
                    <span className="text-sm text-gray-500 mt-1">Palolem, Colva, Benaulim, Cavelossim, Varca</span>
                  </label>
                </div>
              </div>

              {/* Step 2: Stay Preference */}
              {formData.goaRegion && (
                <div>
                  <Label className="text-lg font-bold text-gray-800 mb-4 block">
                    Step 2: Select Stay Preference for {formData.goaRegion} *
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {stayCategories.map((cat) => (
                      <PreferenceCard key={cat.value} cat={cat} selected={formData.stayPreference} onChange={handleInputChange} />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Check-in Details */}
              {formData.stayPreference && (
                <>
                  <div>
                    <Label className="text-lg font-bold text-gray-800 mb-4 block">Step 3: Check-in Details</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="goa-checkin" className="text-base font-semibold flex items-center mb-2">
                          <Calendar className="w-5 h-5 mr-2 text-orange-600" /> Check-in Date *
                        </Label>
                        <Input id="goa-checkin" name="checkInDate" type="date" value={formData.checkInDate}
                          onChange={handleInputChange} min={new Date().toISOString().split('T')[0]}
                          className="text-base py-3" required />
                      </div>
                      <div>
                        <Label htmlFor="goa-checkout" className="text-base font-semibold flex items-center mb-2">
                          <Calendar className="w-5 h-5 mr-2 text-orange-600" /> Check-out Date *
                        </Label>
                        <Input id="goa-checkout" name="checkOutDate" type="date" value={formData.checkOutDate}
                          onChange={handleInputChange} min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                          className="text-base py-3" required />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="goa-adults" className="text-base font-semibold flex items-center mb-2">
                        <Users className="w-5 h-5 mr-2 text-orange-600" /> Number of Adults *
                      </Label>
                      <Input id="goa-adults" name="numberOfAdults" type="number" min="1"
                        value={formData.numberOfAdults} onChange={handleInputChange} className="text-base py-3" required />
                    </div>
                    <div>
                      <Label htmlFor="goa-children" className="text-base font-semibold mb-2 block">Number of Children</Label>
                      <Input id="goa-children" name="numberOfChildren" type="number" min="0"
                        value={formData.numberOfChildren} onChange={handleInputChange} className="text-base py-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="goa-roomType" className="text-base font-semibold mb-2 block">Room Type Preference</Label>
                      <select id="goa-roomType" name="roomType" value={formData.roomType} onChange={handleInputChange}
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="">Select room type</option>
                        <option value="Standard Room">Standard Room</option>
                        <option value="Deluxe Room">Deluxe Room</option>
                        <option value="Suite">Suite</option>
                        <option value="Villa">Villa</option>
                        <option value="Sea View Room">Sea View Room</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="goa-mealPlan" className="text-base font-semibold mb-2 block">Meal Plan</Label>
                      <select id="goa-mealPlan" name="mealPlan" value={formData.mealPlan} onChange={handleInputChange}
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="Room Only">Room Only</option>
                        <option value="Bed & Breakfast">Bed & Breakfast</option>
                        <option value="Half Board">Half Board (Breakfast + Dinner)</option>
                        <option value="Full Board">Full Board (All Meals)</option>
                        <option value="All Inclusive">All Inclusive</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="border-t-2 border-orange-100 pt-6">
                    <h3 className="text-lg font-bold mb-1 text-gray-800">Your Contact Details</h3>
                    <p className="text-sm text-gray-500 mb-4">We'll send the quote directly to your email and WhatsApp</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="goa-name" className="text-base font-semibold">Full Name *</Label>
                        <Input id="goa-name" name="name" value={formData.name} onChange={handleInputChange}
                          placeholder="Enter your name" className="mt-1" required data-testid="goa-name-input" />
                      </div>
                      <div>
                        <Label htmlFor="goa-email" className="text-base font-semibold flex items-center">
                          <Mail className="w-4 h-4 mr-1 text-orange-600" /> Email *
                        </Label>
                        <Input id="goa-email" name="email" type="email" value={formData.email}
                          onChange={handleInputChange} placeholder="your@email.com" className="mt-1" required data-testid="goa-email-input" />
                      </div>
                      <div>
                        <Label htmlFor="goa-whatsapp" className="text-base font-semibold flex items-center">
                          <Phone className="w-4 h-4 mr-1 text-orange-600" /> WhatsApp *
                        </Label>
                        <Input id="goa-whatsapp" name="whatsapp" type="tel" value={formData.whatsapp}
                          onChange={handleInputChange} placeholder="+91 98765 43210" className="mt-1" required data-testid="goa-whatsapp-input" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="goa-requests" className="text-base font-semibold">Special Requests (Optional)</Label>
                    <Textarea id="goa-requests" name="specialRequests" value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any preferences, celebrations, dietary needs, or questions?"
                      rows={3} className="mt-1" />
                  </div>

                  <Button type="submit" disabled={loading} data-testid="goa-submit-btn"
                    className="w-full bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white text-lg py-6 font-bold">
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? 'Submitting...' : 'Get Goa Resort Quote via Email & WhatsApp'}
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Why Choose Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-100">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Book Goa Hotels with BM Hospitality?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Star className="w-10 h-10 text-amber-500 mx-auto mb-3 fill-amber-400" />
              <h4 className="font-bold text-gray-800 mb-2">3 to 5 Star Options</h4>
              <p className="text-sm text-gray-600">Budget to luxury resorts</p>
            </div>
            <div className="text-center">
              <MapPin className="w-10 h-10 text-orange-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">North & South Goa</h4>
              <p className="text-sm text-gray-600">Properties across all Goa</p>
            </div>
            <div className="text-center">
              <Hotel className="w-10 h-10 text-orange-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">All Stay Types</h4>
              <p className="text-sm text-gray-600">Bachelors, family, couples, groups</p>
            </div>
            <div className="text-center">
              <Phone className="w-10 h-10 text-orange-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">Instant WhatsApp assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoaPackage;
