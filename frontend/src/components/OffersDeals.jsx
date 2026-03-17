import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Gift, Clock, Tag, Percent } from 'lucide-react';

const OffersDeals = () => {
  const offers = [
    {
      id: 1,
      title: "Early Bird Discount",
      description: "Book 60 days in advance and save up to 25% on all packages",
      discount: "25% OFF",
      validTill: "March 31, 2025",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      category: "All Packages"
    },
    {
      id: 2,
      title: "Goa Summer Special",
      description: "Exclusive deals on Goa hotels and resorts for summer season",
      discount: "₹5,000 OFF",
      validTill: "April 30, 2025",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      category: "Goa Packages"
    },
    {
      id: 3,
      title: "Honeymoon Package Offer",
      description: "Special honeymoon packages with complimentary romantic dinner",
      discount: "Free Upgrades",
      validTill: "Ongoing",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      category: "International"
    },
    {
      id: 4,
      title: "Family Fun Deal",
      description: "Book for 4+ members and get special family discounts",
      discount: "20% OFF",
      validTill: "May 15, 2025",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      category: "Domestic"
    },
    {
      id: 5,
      title: "Bohra Community Special",
      description: "Exclusive rates for Dawoodi Bohra community stays in Goa",
      discount: "₹3,000 OFF",
      validTill: "June 30, 2025",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      category: "Bohra Stays"
    },
    {
      id: 6,
      title: "Last Minute Deals",
      description: "Book within 7 days of travel and get instant discounts",
      discount: "15% OFF",
      validTill: "Ongoing",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
      category: "All Packages"
    }
  ];

  const scrollToEnquiry = () => {
    const element = document.getElementById('quick-enquiry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="offers" className="py-20 bg-gradient-to-b from-white to-red-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-12 h-12 text-red-600 mr-3" />
            <h2 className="section-title mb-0">Exclusive Offers & Deals</h2>
          </div>
          <p className="section-subtitle">
            Special discounts and limited-time offers on travel packages - Save big on your next adventure!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center">
                  <Percent className="w-4 h-4 mr-1" />
                  {offer.discount}
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                  {offer.category}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl group-hover:text-red-600 transition-colors">
                  {offer.title}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {offer.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2 text-red-600" />
                  <span>Valid till: <strong>{offer.validTill}</strong></span>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-red-700">Special Discount</span>
                    <span className="text-2xl font-bold text-red-600">{offer.discount}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={scrollToEnquiry}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-5"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Claim This Offer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Special Banner */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-center text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-3">Limited Time Offers!</h3>
          <p className="text-xl mb-6">Don't miss out on these amazing deals. Book now and save big on your dream vacation!</p>
          <Button
            onClick={scrollToEnquiry}
            size="lg"
            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold"
          >
            View All Packages & Book Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OffersDeals;
