import React from 'react';
import { Palmtree, MapPin, Globe, Home, Map, Phone } from 'lucide-react';
import { services } from '../mock';

const iconMap = {
  Palmtree,
  MapPin,
  Globe,
  Home,
  Map,
  Phone
};

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-teal-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive travel solutions tailored to your every need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon];
            return (
              <div 
                key={service.id}
                className="service-card group"
              >
                <div className="service-icon-wrapper">
                  <IconComponent className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
