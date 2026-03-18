import React, { useState } from 'react';
import { galleryImages } from '../mock';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { X } from 'lucide-react';
import { useAdminImages } from '../hooks/useAdminImages';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { images: adminGallery } = useAdminImages('gallery');

  const displayImages = adminGallery.length > 0
    ? adminGallery.map((img, i) => ({ id: img.id || i, url: img.url, title: img.label || 'Gallery', location: '' }))
    : galleryImages;

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">Destination Gallery</h2>
          <p className="section-subtitle">
            Explore breathtaking destinations that await your discovery
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayImages.map((image) => (
            <div 
              key={image.id}
              className="gallery-item group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image.url}
                alt={image.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="gallery-overlay">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">{image.title}</h3>
                  <p className="text-sm text-white/90">{image.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-0">
            <DialogTitle className="sr-only">Gallery Image</DialogTitle>
            <div className="relative">
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X size={32} />
              </button>
              {selectedImage && (
                <div>
                  <img 
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="text-center mt-4 text-white">
                    <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                    <p className="text-lg">{selectedImage.location}</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
