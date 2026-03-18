import React from 'react';
import { Card, CardContent } from './ui/card';
import { Star } from 'lucide-react';
import { testimonials as defaultTestimonials } from '../mock';
import { useContent } from '../hooks/useContent';

const Testimonials = () => {
  const { items: testimonials } = useContent('testimonials', defaultTestimonials);

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-teal-50/30 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">What Our Travelers Say</h2>
          <p className="section-subtitle">
            Real experiences from real travelers who trusted us with their dream vacations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="testimonial-card">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  "{testimonial.comment}"
                </p>
                
                <p className="text-xs text-teal-600 font-semibold">
                  {testimonial.package}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
