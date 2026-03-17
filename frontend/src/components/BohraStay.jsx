import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Home, Users, Waves, IndianRupee, Check, Sparkles, Send } from 'lucide-react';
import { bohraStayOptions, bohraAmenities, bohraSpecialFeatures, bohraPackageIncludes, sendWhatsAppMessage } from '../mock';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const BohraStay = () => {
  const [selectedStayType, setSelectedStayType] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfAdults: '4',
    numberOfChildren: '0',
    selectedSubOption: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStaySelection = (stayTypeName, option) => {
    setSelectedStayType(stayTypeName);
    setSelectedOption(option);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await fetch(`${API_URL}/api/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_type: `Bohra Stay - ${selectedStayType} - ${selectedOption.bhk}`,
          name: formData.name, email: formData.email, phone: formData.phone,
          destination: 'Goa - Dawoodi Bohra Stay',
          check_in_date: formData.checkInDate, check_out_date: formData.checkOutDate,
          number_of_adults: formData.numberOfAdults,
          number_of_children: formData.numberOfChildren,
          budget: null, requirements: formData.message || null
        })
      });

      // Prepare WhatsApp message
      let message = `*Dawoodi Bohra Stay Inquiry - BM Hospitality*\n\n`;
      message += `*Stay Type:* ${selectedStayType}\n`;
      message += `*Configuration:* ${selectedOption.bhk}\n`;
      message += `*Capacity:* ${selectedOption.capacity}\n`;
      message += `*Starting Price:* ${selectedOption.price}/night onwards\n`;
      if (formData.selectedSubOption) {
        message += `*Selected Option:* ${formData.selectedSubOption}\n`;
      }
      message += `\n*Guest Details:*\n`;
      message += `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n`;
      message += `*Booking:*\nCheck-in: ${formData.checkInDate}\nCheck-out: ${formData.checkOutDate}\n`;
      message += `Adults: ${formData.numberOfAdults}\nChildren: ${formData.numberOfChildren}\n`;
      if (formData.message) {
        message += `\n*Special Requirements:*\n${formData.message}\n`;
      }
      message += `\n_Note: Rate valid for minimum 3 night stay_\n`;
      message += `_Dawoodi Bohra Community - BM Hospitality_`;
      sendWhatsAppMessage(message);
    } catch {
      // WhatsApp still opens even if API fails
    }
    
    toast.success('Inquiry sent! We will send you exact cost & accommodation details via email and WhatsApp.');
    
    // Reset form and close dialog
    setFormData({
      name: '',
      email: '',
      phone: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfAdults: '4',
      numberOfChildren: '0',
      selectedSubOption: '',
      message: ''
    });
    setIsDialogOpen(false);
  };

  const StayTypeSection = ({ stayKey, stayData }) => (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">{stayData.name}</h3>
        <p className="text-lg text-gray-600 mb-4">{stayData.subtitle}</p>
        
        {/* Tag Badge */}
        <div className="inline-flex items-center bg-gradient-to-r from-teal-600 to-teal-500 px-8 py-3 rounded-full shadow-lg mb-4">
          <Sparkles className="w-5 h-5 text-white mr-2" />
          <span className="text-white font-bold text-base">{stayData.tag}</span>
        </div>
        
        <div className="inline-block bg-teal-50 px-6 py-2 rounded-full ml-3">
          <p className="text-sm font-semibold text-teal-800">
            ⏱️ Rate valid for minimum 3 night stay
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stayData.options.map((option, index) => (
          <Card key={index} className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-teal-500">
            <div className="relative overflow-hidden rounded-t-lg h-56">
              <img 
                src={option.image}
                alt={option.bhk}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {option.bhk}
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold text-gray-800">{option.bhk}</CardTitle>
              <CardDescription className="flex items-center text-base font-semibold text-gray-700">
                <Users className="w-5 h-5 mr-2 text-teal-600" />
                {option.capacity}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="bg-teal-50 p-3 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">Available Options:</p>
                <div className="space-y-1.5">
                  <div className="flex items-start text-sm text-gray-600">
                    <Check className="w-4 h-4 mr-2 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{option.option1}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <Check className="w-4 h-4 mr-2 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{option.option2}</span>
                  </div>
                </div>
              </div>
              
              {option.note && (
                <p className="text-xs text-teal-700 font-semibold bg-teal-50 p-2 rounded">
                  💡 {option.note}
                </p>
              )}
              
              <div className="border-t pt-3">
                <p className="text-sm text-gray-500 mb-1">Starting from</p>
                <p className="text-3xl font-bold text-teal-700 flex items-center">
                  <IndianRupee className="w-6 h-6" />{option.price}
                </p>
                <p className="text-xs text-gray-500 mt-1">Per night onwards</p>
                
                {/* Rate Includes */}
                <div className="mt-3 bg-gradient-to-r from-teal-50 to-blue-50 p-3 rounded-lg border border-teal-100">
                  <p className="text-xs font-bold text-teal-800 mb-2">Rate Includes:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center text-xs text-gray-700">
                      <Check className="w-3 h-3 mr-1 text-teal-600" />
                      <span>Stay</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-700">
                      <Check className="w-3 h-3 mr-1 text-teal-600" />
                      <span>Sightseeing</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-700">
                      <Check className="w-3 h-3 mr-1 text-teal-600" />
                      <span>Transfers</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-700">
                      <Check className="w-3 h-3 mr-1 text-teal-600" />
                      <span>Food</span>
                    </div>
                  </div>
                </div>
                
                {/* Special Bohra Features */}
                <div className="mt-3 bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
                  <p className="text-xs font-bold text-orange-800 mb-2">🕌 Bohra Special Features:</p>
                  <div className="space-y-1">
                    <div className="flex items-start text-xs text-gray-700">
                      <span className="mr-1">🍽️</span>
                      <span>Bohra Cuisine Available</span>
                    </div>
                    <div className="flex items-start text-xs text-gray-700">
                      <span className="mr-1">🥘</span>
                      <span>Thaal, Safra & Kunli</span>
                    </div>
                    <div className="flex items-start text-xs text-gray-700">
                      <span className="mr-1">🚪</span>
                      <span>Food at Doorstep</span>
                    </div>
                    <div className="flex items-start text-xs text-gray-700">
                      <span className="mr-1">📿</span>
                      <span>Prayer Facilities on Request</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleStaySelection(stayData.name, option)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
              >
                Fill Inquiry Form
              </Button>
              <p className="text-xs text-center text-gray-500 italic">
                Get your exact cost & accommodation
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <section id="bohra-stay" className="py-20 bg-gradient-to-b from-white to-teal-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Home className="w-12 h-12 text-teal-600 mr-3" />
            <h2 className="section-title mb-0">Dawoodi Bohra Stay Types in Goa</h2>
          </div>
          <p className="section-subtitle max-w-3xl mx-auto">
            Exclusive accommodations for the Dawoodi Bohra community with premium facilities and full in-house amenities
          </p>
          <div className="mt-6 inline-flex items-center bg-gradient-to-r from-teal-600 to-teal-500 px-8 py-3 rounded-full shadow-lg">
            <Waves className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-bold text-lg">Premium Goa Properties</span>
          </div>
        </div>

        {/* Private Villa with Common Pool */}
        <StayTypeSection 
          stayKey="privateVillaCommonPool" 
          stayData={bohraStayOptions.privateVillaCommonPool} 
        />

        {/* Private Villa with Private Pool */}
        <StayTypeSection 
          stayKey="privateVillaPrivatePool" 
          stayData={bohraStayOptions.privateVillaPrivatePool} 
        />

        {/* Apartments */}
        <StayTypeSection 
          stayKey="apartments" 
          stayData={bohraStayOptions.apartments} 
        />

        {/* Special Dawoodi Bohra Features */}
        <div className="mt-16 mb-12 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl shadow-xl p-10 border-2 border-teal-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Special Features for Dawoodi Bohra Community</h3>
            <p className="text-lg text-gray-600">Exclusive facilities catering to the Dawoodi Bohra tradition and culture</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bohraSpecialFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-3 text-center">{feature.icon}</div>
                <h4 className="text-lg font-bold text-gray-800 mb-2 text-center">{feature.title}</h4>
                <p className="text-sm text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border-2 border-teal-100">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Complete Amenities Package</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bohraAmenities.map((amenity, index) => (
              <div key={index} className="flex items-center space-x-3 bg-teal-50 p-3 rounded-lg hover:bg-teal-100 transition-colors">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Inquiry Form - {selectedOption?.bhk}</DialogTitle>
              <DialogDescription className="text-base">
                <strong>{selectedStayType}</strong>
                <br />
                Capacity: {selectedOption?.capacity} | Starting ₹{selectedOption?.price}/night onwards
                <br />
                <span className="text-teal-600 font-semibold">Fill details to get exact cost & accommodation</span>
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="bohra-name" className="text-base font-semibold">Full Name *</Label>
                  <Input 
                    id="bohra-name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bohra-email" className="text-base font-semibold">Email *</Label>
                    <Input 
                      id="bohra-email" 
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
                    <Label htmlFor="bohra-phone" className="text-base font-semibold">Phone Number *</Label>
                    <Input 
                      id="bohra-phone" 
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkInDate" className="text-base font-semibold">Check-in Date *</Label>
                    <Input 
                      id="checkInDate" 
                      name="checkInDate"
                      type="date"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="checkOutDate" className="text-base font-semibold">Check-out Date *</Label>
                    <Input 
                      id="checkOutDate" 
                      name="checkOutDate"
                      type="date"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bohra-adults" className="text-base font-semibold">Number of Adults *</Label>
                    <Input 
                      id="bohra-adults" 
                      name="numberOfAdults"
                      type="number"
                      min="1"
                      value={formData.numberOfAdults}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bohra-children" className="text-base font-semibold">Number of Children</Label>
                    <Input 
                      id="bohra-children" 
                      name="numberOfChildren"
                      type="number"
                      min="0"
                      value={formData.numberOfChildren}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="selectedSubOption" className="text-base font-semibold">Preferred Option</Label>
                  <select
                    id="selectedSubOption"
                    name="selectedSubOption"
                    value={formData.selectedSubOption}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select your preferred option</option>
                    <option value={selectedOption?.option1}>{selectedOption?.option1}</option>
                    <option value={selectedOption?.option2}>{selectedOption?.option2}</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="bohra-message" className="text-base font-semibold">Special Requirements / Questions</Label>
                  <Textarea 
                    id="bohra-message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any specific preferences or requirements?"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-sm text-teal-800 font-semibold">
                  ⚠️ Note: Rate valid for minimum 3 night stay
                </p>
              </div>
              
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white text-lg py-6 font-bold">
                Send Inquiry via Email & WhatsApp
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default BohraStay;
