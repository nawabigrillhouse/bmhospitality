import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { IndianRupee, Check, Clock, MapPin, Palmtree, Users, Calendar } from 'lucide-react';
import { goaTravelPackageTypes, goaPackages, sendWhatsAppMessage } from '../mock';
import { toast } from 'sonner';

const GoaPackage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageType, setPackageType] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfAdults: '2',
    numberOfChildren: '0',
    packagePreference: '',
    hotelPreference: '',
    activities: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePackageSelection = (pkg, type) => {
    setSelectedPackage(pkg);
    setPackageType(type);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare WhatsApp message
    let message = `*Goa Travel Package Inquiry - BM Hospitality*\n\n`;
    message += `🏖️ *Package:* ${selectedPackage?.name}\n`;
    if (packageType === 'Package') {
      message += `⏱️ *Duration:* ${selectedPackage?.duration}\n`;
      message += `💰 *Price:* ₹${selectedPackage?.price} per person\n`;
    } else {
      message += `📍 *Location:* ${selectedPackage?.location}\n`;
      message += `💰 *Starting From:* ₹${selectedPackage?.priceStart} per night\n`;
    }
    message += `\n*Guest Details:*\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📧 Email: ${formData.email}\n`;
    message += `📱 Phone: ${formData.phone}\n\n`;
    message += `*Travel Information:*\n`;
    message += `📅 Check-in: ${formData.checkInDate}\n`;
    message += `📅 Check-out: ${formData.checkOutDate}\n`;
    message += `👥 Adults: ${formData.numberOfAdults}\n`;
    message += `👶 Children: ${formData.numberOfChildren}\n`;
    
    if (formData.packagePreference) {
      message += `📦 Package Preference: ${formData.packagePreference}\n`;
    }
    if (formData.hotelPreference) {
      message += `🏨 Hotel Preference: ${formData.hotelPreference}\n`;
    }
    if (formData.activities) {
      message += `🎯 Preferred Activities: ${formData.activities}\n`;
    }
    if (formData.message) {
      message += `\n💬 *Special Requirements:*\n${formData.message}\n`;
    }
    
    message += `\n_Goa Travel Package - BM Hospitality_`;
    
    // Send to WhatsApp
    sendWhatsAppMessage(message);
    
    // Show success toast
    toast.success('Inquiry sent to WhatsApp! We will send you a customized Goa package quotation shortly.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfAdults: '2',
      numberOfChildren: '0',
      packagePreference: '',
      hotelPreference: '',
      activities: '',
      message: ''
    });
    setIsDialogOpen(false);
  };

  return (
    <section id="goa-packages" className="py-20 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Palmtree className="w-12 h-12 text-orange-600 mr-3" />
            <h2 className="section-title mb-0">Goa Travel Packages</h2>
          </div>
          <p className="section-subtitle max-w-3xl mx-auto">
            Fully customizable Goa packages with hotels & resorts starting from ₹3,500/night - Beach, Adventure, Romance, and More!
          </p>
          <div className="mt-6 inline-flex items-center bg-gradient-to-r from-orange-600 to-red-500 px-8 py-3 rounded-full shadow-lg">
            <span className="text-white font-bold text-lg">🏖️ Complete Goa Experience - Stay + Sightseeing + Activities</span>
          </div>
        </div>

        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="packages" className="text-base">Travel Packages</TabsTrigger>
            <TabsTrigger value="hotels" className="text-base">Hotels & Resorts</TabsTrigger>
          </TabsList>
          
          {/* Travel Packages Tab */}
          <TabsContent value="packages">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {goaTravelPackageTypes.map((pkg) => (
                <Card key={pkg.id} className="package-card group overflow-hidden">
                  <div className="relative overflow-hidden h-56">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {pkg.duration}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800 group-hover:text-orange-700 transition-colors">
                      {pkg.name}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-semibold text-gray-700">Package Highlights:</p>
                      <ul className="space-y-1">
                        {pkg.highlights.slice(0, 4).map((highlight, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <Check className="w-4 h-4 mr-2 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-3xl font-bold text-orange-700 flex items-center">
                        <IndianRupee className="w-6 h-6" />{pkg.price}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => handlePackageSelection(pkg, 'Package')}
                    >
                      Customize
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Hotels & Resorts Tab */}
          <TabsContent value="hotels">
            <div className="mb-8 text-center">
              <div className="inline-block bg-orange-50 px-6 py-3 rounded-full border-2 border-orange-200">
                <p className="text-orange-800 font-bold">
                  🏨 Hotels & Resorts starting from ₹3,500/night onwards
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {goaPackages.map((hotel) => (
                <Card key={hotel.id} className="package-card group overflow-hidden">
                  <div className="relative overflow-hidden h-52">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">{hotel.name}</CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hotel.location}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hotel.description}</p>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-700">Amenities:</p>
                      <ul className="space-y-1">
                        {hotel.amenities.slice(0, 3).map((amenity, index) => (
                          <li key={index} className="flex items-start text-xs text-gray-600">
                            <Check className="w-3 h-3 mr-1 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-3 pt-4 border-t">
                    <div className="w-full">
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-orange-700 flex items-center">
                        <IndianRupee className="w-5 h-5" />{hotel.priceStart}
                      </p>
                      <p className="text-xs text-gray-500">per night onwards</p>
                    </div>
                    
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => handlePackageSelection(hotel, 'Hotel')}
                    >
                      Get Quote
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Customization Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Customize Your Goa Package</DialogTitle>
              <DialogDescription className="text-base">
                <strong>{selectedPackage?.name}</strong>
                {packageType === 'Package' && (
                  <> | {selectedPackage?.duration} | Starting ₹{selectedPackage?.price}/person</>
                )}
                {packageType === 'Hotel' && (
                  <> | {selectedPackage?.location} | From ₹{selectedPackage?.priceStart}/night</>
                )}
                <br />
                <span className="text-orange-600 font-semibold">Customize your package and get a personalized quote via WhatsApp</span>
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="goa-name" className="text-base font-semibold">Full Name *</Label>
                  <Input 
                    id="goa-name" 
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
                    <Label htmlFor="goa-email" className="text-base font-semibold">Email *</Label>
                    <Input 
                      id="goa-email" 
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
                    <Label htmlFor="goa-phone" className="text-base font-semibold">Phone Number *</Label>
                    <Input 
                      id="goa-phone" 
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
                    <Label htmlFor="goa-checkin" className="text-base font-semibold">Check-in Date *</Label>
                    <Input 
                      id="goa-checkin" 
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
                    <Label htmlFor="goa-checkout" className="text-base font-semibold">Check-out Date *</Label>
                    <Input 
                      id="goa-checkout" 
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
                    <Label htmlFor="goa-adults" className="text-base font-semibold">Number of Adults *</Label>
                    <Input 
                      id="goa-adults" 
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
                    <Label htmlFor="goa-children" className="text-base font-semibold">Number of Children</Label>
                    <Input 
                      id="goa-children" 
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
                  <Label htmlFor="packagePreference" className="text-base font-semibold">Package Type Preference</Label>
                  <Input 
                    id="packagePreference" 
                    name="packagePreference"
                    value={formData.packagePreference}
                    onChange={handleInputChange}
                    placeholder="e.g., Beach, Adventure, Honeymoon, Family"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hotelPreference" className="text-base font-semibold">Hotel/Resort Preference</Label>
                  <Input 
                    id="hotelPreference" 
                    name="hotelPreference"
                    value={formData.hotelPreference}
                    onChange={handleInputChange}
                    placeholder="Budget / 3-star / 4-star / 5-star Luxury"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="activities" className="text-base font-semibold">Preferred Activities</Label>
                  <Input 
                    id="activities" 
                    name="activities"
                    value={formData.activities}
                    onChange={handleInputChange}
                    placeholder="e.g., Water sports, Sightseeing, Nightlife, Relaxation"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="goa-message" className="text-base font-semibold">Special Requirements / Questions</Label>
                  <Textarea 
                    id="goa-message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any specific preferences, dietary requirements, or questions?"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 font-bold">
                Send Customized Request via WhatsApp
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GoaPackage;
