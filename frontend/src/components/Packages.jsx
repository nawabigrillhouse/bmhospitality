import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Clock, MapPin, Check, IndianRupee, Send } from 'lucide-react';
import { domesticPackages, internationalPackages, goaPackages } from '../mock';
import { useAdminImages, getAdminImage } from '../hooks/useAdminImages';
import { useContent } from '../hooks/useContent';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Packages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageType, setPackageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', travelDate: '',
    numberOfAdults: '2', numberOfChildren: '0',
    duration: '', destination: '', message: ''
  });

  const { images: domesticImages } = useAdminImages('domestic-packages');
  const { images: intlImages } = useAdminImages('international-packages');
  const { images: goaImages } = useAdminImages('goa-hotels');

  const { items: domesticItems } = useContent('domestic-packages', domesticPackages);
  const { items: intlItems } = useContent('international-packages', internationalPackages);
  const { items: goaItems } = useContent('goa-packages', goaPackages);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuoteRequest = (pkg, type) => {
    setSelectedPackage(pkg);
    setPackageType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to DB (email notification sent automatically by backend)
      await fetch(`${API_URL}/api/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_type: packageType,
          name: formData.name, email: formData.email, phone: formData.phone,
          destination: formData.destination || selectedPackage?.destination || selectedPackage?.location || '',
          check_in_date: formData.travelDate, check_out_date: formData.travelDate,
          number_of_adults: formData.numberOfAdults,
          number_of_children: formData.numberOfChildren,
          budget: null, requirements: formData.message || null
        })
      });

      toast.success('Request submitted! We will send you a quotation on your email and WhatsApp shortly.');
      setFormData({ name: '', email: '', phone: '', travelDate: '',
        numberOfAdults: '2', numberOfChildren: '0', duration: '', destination: '', message: '' });
    } catch {
      toast.error('Failed to submit. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const PackageCard = ({ pkg, type }) => {
    const sectionImages = type === 'Domestic' ? domesticImages : type === 'International' ? intlImages : goaImages;
    const cardImage = getAdminImage(sectionImages, String(pkg.id), pkg.image);
    return (
    <Card className="package-card group">
      <div className="relative overflow-hidden rounded-t-lg h-64">
        <img src={cardImage} alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 group-hover:text-teal-700 transition-colors">{pkg.name}</CardTitle>
        <CardDescription className="flex items-center space-x-4 text-base mt-2">
          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{pkg.destination || pkg.location}</span>
          {pkg.duration && <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{pkg.duration}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">{pkg.highlights ? 'Package Highlights:' : 'Amenities:'}</p>
          <ul className="space-y-1">
            {(pkg.highlights || pkg.amenities).slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-teal-600 flex-shrink-0 mt-0.5" /><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t">
        {pkg.priceStart ? (
          <div>
            <p className="text-sm text-gray-500">Starting from</p>
            <p className="text-2xl font-bold text-teal-700 flex items-center">
              <IndianRupee className="w-5 h-5" />{pkg.priceStart}
            </p>
            <p className="text-xs text-gray-500">per night onwards</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-bold text-teal-700">Request Quote</p>
            <p className="text-xs text-gray-500">Get personalized pricing</p>
          </div>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => handleQuoteRequest(pkg, type)}>
              Get Quote
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Quotation - {selectedPackage?.name || selectedPackage?.location}</DialogTitle>
              <DialogDescription>
                Fill in your travel details and we'll send you a customized quotation via email & WhatsApp
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange}
                  placeholder="Enter your full name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={formData.email}
                    onChange={handleInputChange} placeholder="your@email.com" required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone / WhatsApp *</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone}
                    onChange={handleInputChange} placeholder="+91 98765 43210" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="travelDate">Travel Date *</Label>
                  <Input id="travelDate" name="travelDate" type="date" value={formData.travelDate}
                    onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div>
                  <Label htmlFor="numberOfAdults">Adults *</Label>
                  <Input id="numberOfAdults" name="numberOfAdults" type="number" min="1"
                    value={formData.numberOfAdults} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="numberOfChildren">Children</Label>
                  <Input id="numberOfChildren" name="numberOfChildren" type="number" min="0"
                    value={formData.numberOfChildren} onChange={handleInputChange} />
                </div>
              </div>
              {(type === 'Domestic' || type === 'International') && (
                <>
                  <div>
                    <Label htmlFor="duration">Preferred Duration</Label>
                    <Input id="duration" name="duration" value={formData.duration}
                      onChange={handleInputChange} placeholder="e.g., 5 Days / 4 Nights" />
                  </div>
                  <div>
                    <Label htmlFor="destination">Preferred Destinations</Label>
                    <Input id="destination" name="destination" value={formData.destination}
                      onChange={handleInputChange} placeholder="Any specific cities or places?" />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="message">Special Requirements</Label>
                <Textarea id="message" name="message" value={formData.message}
                  onChange={handleInputChange} placeholder="Any preferences, dietary requirements, or questions?" rows={3} />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Sending...' : 'Send Request via Email & WhatsApp'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
    );
  };

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title" data-testid="packages-title">Our Travel Packages</h2>
          <p className="section-subtitle">Explore our handpicked destinations and get personalized quotations</p>
        </div>

        <Tabs defaultValue="domestic" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="domestic" className="text-base">Domestic Packages</TabsTrigger>
            <TabsTrigger value="international" className="text-base">International Packages</TabsTrigger>
            <TabsTrigger value="goa" className="text-base">Goa Hotels & Resorts</TabsTrigger>
          </TabsList>
          <TabsContent value="domestic">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {domesticItems.map((pkg, idx) => <PackageCard key={pkg.id || idx} pkg={pkg} type="Domestic" />)}
            </div>
          </TabsContent>
          <TabsContent value="international">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {intlItems.map((pkg, idx) => <PackageCard key={pkg.id || idx} pkg={pkg} type="International" />)}
            </div>
          </TabsContent>
          <TabsContent value="goa">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {goaItems.map((pkg, idx) => <PackageCard key={pkg.id || idx} pkg={pkg} type="Goa Hotel/Resort" />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Packages;
