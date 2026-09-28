import React from 'react';
import Image from 'next/image';
import { Instagram, Play } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Gallery - The Style Room',
  description: 'Explore our latest collections, fashion shows, and behind-the-scenes moments.',
};

// Gallery image data structure
const galleryImages = [
  { id: 1, src: '/images/hero_model.jpg', alt: 'Fashion Model', span: 'col-span-2 row-span-2' },
  { id: 2, src: '/images/product-01.jpeg', alt: 'Summer Collection', span: 'col-span-1 row-span-1' },
  { id: 3, src: '/images/product-02.jpeg', alt: 'Elegant Dress', span: 'col-span-1 row-span-1' },
  { id: 4, src: '/images/product-03.jpeg', alt: 'Casual Wear', span: 'col-span-1 row-span-2' },
  { id: 5, src: '/images/product-04.jpeg', alt: 'Accessories', span: 'col-span-1 row-span-1' },
  { id: 6, src: '/images/arrival_banner_model.jpg', alt: 'New Arrivals', span: 'col-span-2 row-span-1' },
  { id: 7, src: '/images/product-07.jpeg', alt: 'Winter Collection', span: 'col-span-1 row-span-1' },
  { id: 8, src: '/images/product-08.jpeg', alt: 'Street Style', span: 'col-span-1 row-span-1' },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#faf9fb] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-900 mb-4">
            The Style Room <span className="text-[#67349a] italic">Gallery</span>
          </h1>
          <p className="text-charcoal-600 max-w-2xl mx-auto mb-8 text-sm md:text-base">
            Step into our world of elegance and style. Explore our latest looks, exclusive collections, and moments that define fashion.
          </p>
          
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Instagram size={20} />
            Follow us on Instagram
          </a>
        </div>

        {/* CSS Grid Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] md:auto-rows-[250px] gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id} 
              className={`relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 ${image.span} animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                  <h3 className="text-white font-bold text-sm md:text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {image.alt}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More / Video Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-cream-200 flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-charcoal-900 mb-3">Watch Our Latest Runway</h2>
            <p className="text-charcoal-600 text-sm md:text-base">Experience the magic of our newest collection brought to life on the runway. Discover the trends setting the season apart.</p>
          </div>
          <button className="shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#241135] text-white rounded-full flex items-center justify-center hover:bg-[#67349a] transition-all hover:scale-105 shadow-lg group">
            <Play size={24} className="ml-1 group-hover:text-purple-200 transition-colors" />
          </button>
        </div>

      </div>
    </div>
  );
}
