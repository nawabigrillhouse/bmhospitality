import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Home, Sparkles, IndianRupee, Users, Check } from 'lucide-react';

const BohraCommunityShowcase = () => {
  const scrollToBohra = () => {
    const element = document.getElementById('bohra-stay');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stayTypes = [
    {
      name: "Private Villa with Private Pool",
      subtitle: "Premium & Luxury Stay",
      icon: "🏊",
      tag: "Luxurious & Premium",
      priceStart: "22,000",
      features: [
        "Private swimming pool",
        "Fully furnished villa",
        "2BHK to 5BHK options",
        "4-14 person capacity"
      ],
      gradient: "from-purple-600 to-pink-600"
    },
    {
      name: "Private Villa with Common Pool",
      subtitle: "Semi Luxury & Furnished",
      icon: "🏘️",
      tag: "Budget Friendly",
      priceStart: "18,500",
      features: [
        "Common swimming pool",
        "Full in-house amenities",
        "2BHK to 5BHK options",
        "4-15 person capacity"
      ],
      gradient: "from-teal-600 to-cyan-600"
    },
    {
      name: "Apartments with Common Pool",
      subtitle: "Semi & Fully Furnished",
      icon: "🏢",
      tag: "Best for Families",
      priceStart: "16,500",
      features: [
        "Common pool access",
        "Modern amenities",
        "2BHK & 3BHK options",
        "4-9 person capacity"
      ],
      gradient: "from-orange-600 to-red-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-teal-50/30 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #14b8a6 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4 bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 rounded-full">
            <Sparkles className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-bold text-sm">EXCLUSIVE FOR DAWOODI BOHRA COMMUNITY</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Premium Goa Stays for Dawoodi Bohra Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Exclusive accommodations with traditional amenities, prayer facilities, and authentic Bohra cuisine
          </p>
          
          {/* Special Features Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="bg-white px-4 py-2 rounded-full shadow-md border-2 border-teal-100">
              <span className="text-sm font-semibold text-gray-700">🍽️ Bohra Cuisine Available</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md border-2 border-teal-100">
              <span className="text-sm font-semibold text-gray-700">🥘 Thaal, Safra & Kunli</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md border-2 border-teal-100">
              <span className="text-sm font-semibold text-gray-700">🕌 Prayer Facilities</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md border-2 border-teal-100">
              <span className="text-sm font-semibold text-gray-700">✨ Stay + Food + Sightseeing</span>
            </div>
          </div>
        </div>

        {/* Stay Types Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stayTypes.map((stay, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-teal-100 group">
              {/* Header with Gradient */}
              <div className={`bg-gradient-to-r ${stay.gradient} p-6 text-white relative`}>
                <div className="absolute top-3 right-3 text-4xl opacity-20">{stay.icon}</div>
                <div className="text-5xl mb-3">{stay.icon}</div>
                <h3 className="text-xl font-bold mb-1">{stay.name}</h3>
                <p className="text-sm text-white/90">{stay.subtitle}</p>
              </div>

              <CardContent className="p-6">
                {/* Tag */}
                <div className="mb-4">
                  <span className="inline-flex items-center bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {stay.tag}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-teal-700 flex items-center">
                    <IndianRupee className="w-7 h-7" />{stay.priceStart}
                  </p>
                  <p className="text-xs text-gray-500">per night onwards</p>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {stay.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <Check className="w-4 h-4 text-teal-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <Button 
                  onClick={scrollToBohra}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-5"
                >
                  View All Options
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <Home className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-4">
              2BHK, 3BHK, 4BHK & 5BHK Options Available
            </h3>
            <p className="text-xl text-teal-50 mb-6">
              Choose from luxury private villas, semi-luxury villas, or modern apartments - all with complete Dawoodi Bohra amenities and facilities
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={scrollToBohra}
                size="lg"
                className="bg-white text-teal-700 hover:bg-teal-50 px-8 py-6 text-lg font-bold shadow-lg"
              >
                Explore All Stay Types
              </Button>
              <Button 
                onClick={scrollToBohra}
                size="lg"
                variant="outline"
                className="bg-teal-700 text-white border-2 border-white hover:bg-teal-800 px-8 py-6 text-lg font-bold"
              >
                Get Pricing Details
              </Button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-orange-50 border-2 border-orange-200 rounded-xl p-6 text-center">
          <p className="text-orange-800 font-semibold text-lg">
            ⚠️ Rate valid for minimum 3 night stay | Rate includes: Stay + Sightseeing + Transfers + Food
          </p>
        </div>
      </div>
    </section>
  );
};

export default BohraCommunityShowcase;
