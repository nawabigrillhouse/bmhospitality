import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Clock, MapPin, Check } from 'lucide-react';
import { travelPackages } from '../mock';
import { toast } from 'sonner';

const Packages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelDate: '',
    numberOfPeople: '2',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = (e) => {
    e.preventDefault();
    // Mock booking - will be replaced with backend API call
    console.log('Booking submitted:', { ...formData, package: selectedPackage });
    toast.success('Booking request submitted! We will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      travelDate: '',
      numberOfPeople: '2',
      message: ''
    });
  };

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">Popular Travel Packages</h2>
          <p className="section-subtitle">
            Handpicked destinations and carefully crafted experiences for your perfect getaway
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {travelPackages.map((pkg) => (
            <Card key={pkg.id} className="package-card group">
              <div className="relative overflow-hidden rounded-t-lg h-64">
                <img 
                  src={pkg.image} 
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {pkg.category}
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 group-hover:text-teal-700 transition-colors">
                  {pkg.name}
                </CardTitle>
                <CardDescription className="flex items-center space-x-4 text-base mt-2">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {pkg.destination}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {pkg.duration}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Package Highlights:</p>
                  <ul className="space-y-1">
                    {pkg.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <Check className="w-4 h-4 mr-2 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-3xl font-bold text-teal-700">${pkg.price}</p>
                  <p className="text-xs text-gray-500">per person</p>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Book {selectedPackage?.name}</DialogTitle>
                      <DialogDescription>
                        Fill in your details and we'll get back to you with the best deals.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleBooking} className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input 
                            id="name" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input 
                            id="email" 
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input 
                            id="phone" 
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 234 567 8900"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="travelDate">Travel Date *</Label>
                            <Input 
                              id="travelDate" 
                              name="travelDate"
                              type="date"
                              value={formData.travelDate}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="numberOfPeople">No. of People *</Label>
                            <Input 
                              id="numberOfPeople" 
                              name="numberOfPeople"
                              type="number"
                              min="1"
                              value={formData.numberOfPeople}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Special Requests</Label>
                          <Textarea 
                            id="message" 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Any special requirements or questions?"
                            rows={3}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                        Submit Booking Request
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
