import React from 'react';
import { Hotel } from 'lucide-react';

const HotelsResorts = () => {
  return (
    <section id="hotels-resorts" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Hotel className="w-12 h-12 text-amber-600 mr-3" />
            <h2 className="section-title mb-0">Hotels & Resorts</h2>
          </div>
          <p className="section-subtitle">
            Premium accommodation options across all destinations - From budget stays to luxury resorts
          </p>
          <div className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-amber-800 font-semibold text-lg">
              🏨 Browse our complete collection of hotels and resorts in the Goa Packages section above, or use the Quick Inquiry Form to get personalized hotel recommendations for any destination.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelsResorts;
