import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Home, Users, Waves } from 'lucide-react';
import { bohraStayOptions, sendWhatsAppMessage } from '../mock';
import { toast } from 'sonner';

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
    numberOfAdults: '2',
    numberOfChildren: '0',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStaySelection = (stayType, option) => {
    setSelectedStayType(stayType);
    setSelectedOption(option);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare WhatsApp message
    let message = `*Dawoodi Bohra Stay Inquiry - BM Hospitality*\n\n`;
    message += `🏠 *Stay Type:* ${selectedStayType}\n`;
    message += `🏘️ *Configuration:* ${selectedOption.bhk}\n`;
    message += `👥 *Capacity:* ${selectedOption.capacity}\n\n`;
    message += `*Guest Details:*\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📧 Email: ${formData.email}\n`;
    message += `📱 Phone: ${formData.phone}\n\n`;
    message += `*Booking Information:*\n`;
    message += `📅 Check-in: ${formData.checkInDate}\n`;
    message += `📅 Check-out: ${formData.checkOutDate}\n`;
    message += `👥 Adults: ${formData.numberOfAdults}\n`;
    message += `👶 Children: ${formData.numberOfChildren}\n`;
    
    if (formData.message) {
      message += `\n💬 *Special Requirements:*\n${formData.message}\n`;
    }
    
    message += `\n_Dawoodi Bohra Community - BM Hospitality_`;
    
    // Send to WhatsApp
    sendWhatsAppMessage(message);
    
    // Show success toast
    toast.success('Request sent to WhatsApp! We will send you a quotation shortly.');
    
    // Reset form and close dialog
    setFormData({
      name: '',
      email: '',
      phone: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfAdults: '2',
      numberOfChildren: '0',
      message: ''
    });
    setIsDialogOpen(false);
  };

  const StayTypeCard = ({ stayKey, stayData }) => (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{stayData.name}</h3>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {stayData.amenities.map((amenity, index) => (
            <span key={index} className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
              {amenity}
            </span>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stayData.options.map((option, index) => (
          <Card key={index} className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
            <div className="relative overflow-hidden rounded-t-lg h-48">
              <img 
                src={option.image}
                alt={option.bhk}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {option.bhk}
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{option.bhk}</CardTitle>
              <CardDescription className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {option.capacity}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Button 
                onClick={() => handleStaySelection(stayData.name, option)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                Request Quote
              </Button>
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
            <Home className="w-10 h-10 text-teal-600 mr-3" />
            <h2 className="section-title mb-0">Dawoodi Bohra Stay Types in Goa</h2>
          </div>
          <p className="section-subtitle">
            Exclusive accommodations for the Dawoodi Bohra community with premium facilities
          </p>
          <div className="mt-6 inline-flex items-center bg-teal-50 px-6 py-3 rounded-full">
            <Waves className="w-5 h-5 text-teal-600 mr-2" />
            <span className="text-teal-800 font-semibold">Premium Goa Properties</span>
          </div>
        </div>

        {/* Luxury Private Villas */}
        <StayTypeCard 
          stayKey="luxuryPrivateVilla" 
          stayData={bohraStayOptions.luxuryPrivateVilla} 
        />

        {/* Semi-Luxury Villas */}
        <StayTypeCard 
          stayKey="semiLuxuryVilla" 
          stayData={bohraStayOptions.semiLuxuryVilla} 
        />

        {/* Apartments */}
        <StayTypeCard 
          stayKey="apartments" 
          stayData={bohraStayOptions.apartments} 
        />

        {/* Booking Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Quotation - {selectedOption?.bhk}</DialogTitle>
              <DialogDescription>
                {selectedStayType} | Capacity: {selectedOption?.capacity}
                <br />Fill in your details and we'll send you a customized quotation on WhatsApp
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="bohra-name">Full Name *</Label>
                  <Input 
                    id="bohra-name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bohra-email">Email *</Label>
                    <Input 
                      id="bohra-email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bohra-phone">Phone Number *</Label>
                    <Input 
                      id="bohra-phone" 
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkInDate">Check-in Date *</Label>
                    <Input 
                      id="checkInDate" 
                      name="checkInDate"
                      type="date"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="checkOutDate">Check-out Date *</Label>
                    <Input 
                      id="checkOutDate" 
                      name="checkOutDate"
                      type="date"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bohra-adults">Number of Adults *</Label>
                    <Input 
                      id="bohra-adults" 
                      name="numberOfAdults"
                      type="number"
                      min="1"
                      value={formData.numberOfAdults}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bohra-children">Number of Children</Label>
                    <Input 
                      id="bohra-children" 
                      name="numberOfChildren"
                      type="number"
                      min="0"
                      value={formData.numberOfChildren}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bohra-message">Special Requirements / Questions</Label>
                  <Textarea 
                    id="bohra-message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any specific preferences or requirements?"
                    rows={3}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Send Request via WhatsApp
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default BohraStay;
