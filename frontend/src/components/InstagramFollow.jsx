import React from 'react';
import { Instagram, Heart, Users } from 'lucide-react';
import { Button } from './ui/button';

const INSTAGRAM_URL = 'https://www.instagram.com/bm_hospitality?igsh=MTZ4Z280NnVvbmVlYw%3D%3D&utm_source=qr';

const InstagramFollow = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-white rounded-lg rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-6 rounded-3xl shadow-2xl">
              <Instagram className="w-16 h-16 text-pink-600" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Follow Us on Instagram
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our travel community and get daily inspiration, exclusive offers, and travel tips!
          </p>

          <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-full inline-block mb-8">
            <p className="text-2xl font-bold text-white flex items-center">
              <Instagram className="w-6 h-6 mr-2" />
              @BM_Hospitality
            </p>
          </div>

          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="flex items-center text-white">
                <Users className="w-5 h-5 mr-2" />
                <div>
                  <p className="text-2xl font-bold">1000+</p>
                  <p className="text-sm">Followers</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="flex items-center text-white">
                <Heart className="w-5 h-5 mr-2" />
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm">Happy Travelers</p>
                </div>
              </div>
            </div>
          </div>

          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" data-testid="instagram-follow-link">
            <Button size="lg"
              className="bg-white text-pink-600 hover:bg-gray-100 px-10 py-7 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Instagram className="w-6 h-6 mr-3" />
              Follow @BM_Hospitality
            </Button>
          </a>

          <p className="mt-6 text-white/80 text-sm">
            Tag us in your travel photos for a chance to be featured!
          </p>
        </div>
      </div>
    </section>
  );
};

export default InstagramFollow;
