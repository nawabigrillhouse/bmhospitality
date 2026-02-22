import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { IndianRupee, Check, MapPin, Palmtree } from 'lucide-react';
import { goaPackages, sendWhatsAppMessage } from '../mock';
import { toast } from 'sonner';

const GoaPackage = () => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfAdults: '2',
    numberOfChildren: '0',
    roomType: '',
    specialRequests: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleHotelSelection = (hotel) => {
    setSelectedHotel(hotel);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate number of nights
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Prepare WhatsApp message
    let message = `*Goa Hotel/Resort Booking Inquiry - BM Hospitality*\n\n`;
    message += `🏨 *Hotel/Resort:* ${selectedHotel?.name}\n`;
    message += `📍 *Location:* ${selectedHotel?.location}\n`;
    message += `💰 *Starting From:* ₹${selectedHotel?.priceStart} per night onwards\n\n`;
    message += `*Guest Details:*\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📧 Email: ${formData.email}\n`;
    message += `📱 Phone: ${formData.phone}\n\n`;
    message += `*Booking Information:*\n`;
    message += `📅 Check-in: ${formData.checkInDate}\n`;
    message += `📅 Check-out: ${formData.checkOutDate}\n`;
    message += `🌙 Number of Nights: ${nights}\n`;
    message += `👥 Adults: ${formData.numberOfAdults}\n`;
    message += `👶 Children: ${formData.numberOfChildren}\n`;
    
    if (formData.roomType) {
      message += `🏠 Room Type: ${formData.roomType}\n`;
    }
    if (formData.specialRequests) {
      message += `\n💬 *Special Requests:*\n${formData.specialRequests}\n`;
    }
    
    message += `\n_Goa Hotels & Resorts - BM Hospitality_`;
    
    // Send to WhatsApp
    sendWhatsAppMessage(message);
    
    // Show success toast
    toast.success('Inquiry sent to WhatsApp! We will send you the best rates and availability shortly.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfAdults: '2',
      numberOfChildren: '0',
      roomType: '',
      specialRequests: ''
    });
    setIsDialogOpen(false);
  };

  return (
    <section id="goa-packages" className="py-20 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Palmtree className="w-12 h-12 text-orange-600 mr-3" />
            <h2 className="section-title mb-0">Goa Hotels & Resorts</h2>
          </div>
          <p className="section-subtitle max-w-3xl mx-auto">
            Exclusive selection of premium hotels and resorts in Goa - Perfect beach stays starting from ₹3,500/night onwards
          </p>
          <div className="mt-6 inline-flex items-center bg-gradient-to-r from-orange-600 to-red-500 px-8 py-3 rounded-full shadow-lg">
            <span className="text-white font-bold text-lg">🏖️ Best Rates & Personalized Service Guaranteed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {goaPackages.map((hotel) => (
            <Card key={hotel.id} className="package-card group overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative overflow-hidden h-56">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg">
                  Starting ₹{hotel.priceStart}/night
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 group-hover:text-orange-700 transition-colors">
                  {hotel.name}
                </CardTitle>
                <CardDescription className="flex items-center text-sm mt-2">
                  <MapPin className="w-4 h-4 mr-1 text-orange-600" />
                  {hotel.location}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Top Amenities:</p>
                  <ul className="space-y-1">
                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                      <li key={index} className="flex items-start text-xs text-gray-600">
                        <Check className="w-3 h-3 mr-1 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t">
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6"
                  onClick={() => handleHotelSelection(hotel)}
                >
                  Check Availability & Rates
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Why Choose Our Goa Hotels */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-100">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Book Goa Hotels with BM Hospitality?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h4 className="font-bold text-gray-800 mb-2">Best Price Guarantee</h4>
              <p className="text-sm text-gray-600">Competitive rates starting from ₹3,500/night</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏖️</div>
              <h4 className="font-bold text-gray-800 mb-2">Prime Locations</h4>
              <p className="text-sm text-gray-600">Beachfront properties in North & South Goa</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="font-bold text-gray-800 mb-2">Customized Packages</h4>
              <p className="text-sm text-gray-600">Tailored to your preferences and budget</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📞</div>
              <h4 className="font-bold text-gray-800 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">Instant assistance via WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Booking Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Book {selectedHotel?.name}</DialogTitle>
              <DialogDescription className="text-base">
                <strong>{selectedHotel?.location}</strong> | Starting from ₹{selectedHotel?.priceStart}/night onwards
                <br />
                <span className="text-orange-600 font-semibold">Fill in your details to get the best rates and availability</span>
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="hotel-name" className="text-base font-semibold">Full Name *</Label>
                  <Input 
                    id="hotel-name" 
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
                    <Label htmlFor="hotel-email" className="text-base font-semibold">Email *</Label>
                    <Input 
                      id="hotel-email" 
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
                    <Label htmlFor="hotel-phone" className="text-base font-semibold">Phone Number *</Label>
                    <Input 
                      id="hotel-phone" 
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
                    <Label htmlFor="hotel-checkin" className="text-base font-semibold">Check-in Date *</Label>
                    <Input 
                      id="hotel-checkin" 
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
                    <Label htmlFor="hotel-checkout" className="text-base font-semibold">Check-out Date *</Label>
                    <Input 
                      id="hotel-checkout" 
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
                    <Label htmlFor="hotel-adults" className="text-base font-semibold">Number of Adults *</Label>
                    <Input 
                      id="hotel-adults" 
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
                    <Label htmlFor="hotel-children" className="text-base font-semibold">Number of Children</Label>
                    <Input 
                      id="hotel-children" 
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
                  <Label htmlFor="roomType" className="text-base font-semibold">Room Type Preference</Label>
                  <select
                    id="roomType"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select room type</option>
                    <option value="Standard Room">Standard Room</option>
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Suite">Suite</option>
                    <option value="Villa">Villa</option>
                    <option value="Sea View Room">Sea View Room</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="hotel-requests" className="text-base font-semibold">Special Requests / Questions</Label>
                  <Textarea 
                    id="hotel-requests" 
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any specific preferences, dietary requirements, celebration occasions, or questions?"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800 font-semibold text-center">
                  🎉 Book Now & Get Best Rates with Instant Confirmation via WhatsApp!
                </p>
              </div>
              
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 font-bold">
                Send Inquiry via WhatsApp
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GoaPackage;
