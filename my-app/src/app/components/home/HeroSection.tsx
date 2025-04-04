'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Slide {
  image: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  region: string;
}

const heroSlides: Slide[] = [
  {
    image: 'https://res.cloudinary.com/dyaleu8gi/image/upload/t_1024 x 576/v1743446888/emy-XoByiBymX20-unsplash_jlqop1.jpg',
    heading: 'Discover Authentic Sri Lankan Craftsmanship',
    subheading: 'Handcrafted treasures direct from talented artisans',
    ctaText: 'Explore Collection',
    ctaLink: '/shop',
    region: 'Southern Province'
  },
  {
    image: 'https://res.cloudinary.com/dyaleu8gi/image/upload/t_1024 x 576/v1743686346/Srilankan-symbol-01_ulfmg1.png',
    heading: 'Traditional Batik Textiles',
    subheading: 'Centuries-old techniques creating modern masterpieces',
    ctaText: 'Shop Batik',
    ctaLink: '/shop?category=batik',
    region: 'Central Province'
  },
  {
    image: 'https://res.cloudinary.com/dyaleu8gi/image/upload/t_1024 x 576/v1743446919/swapnil-dwivedi-w46tRF64qNc-unsplash_qbbuhl.jpg',
    heading: 'Handcrafted Clay Pottery',
    subheading: 'Connecting you to ancient pottery traditions',
    ctaText: 'View Pottery',
    ctaLink: '/shop?category=pottery',
    region: 'North Central Province'
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle slide change
  const changeSlide = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  };
  
  const slide = heroSlides[currentSlide];
  
  return (
    <div className="relative h-[600px] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}>
        <Image 
          src={slide.image} 
          alt={slide.heading}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
      </div>
      
      {/* Decorative element - pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'url(/patterns/sri-lankan-pattern.png)',
          backgroundSize: '200px',
          backgroundRepeat: 'repeat'
        }}
      ></div>
      
      {/* Content */}
      <div className={`relative h-full container mx-auto px-4 flex flex-col justify-center transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-2xl">
          <div className="mb-4">
            <span className="inline-block bg-[#E67000] text-white px-3 py-1 text-sm rounded-full">
              {slide.region}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-heading">
            {slide.heading}
          </h1>
          
          <p className="text-lg md:text-xl text-[#f3f4f6] mb-8">
            {slide.subheading}
          </p>
          
          <Link 
            href={slide.ctaLink}
            className="inline-flex items-center bg-[#E67000] hover:bg-[#BF4C00] text-white px-6 py-3 rounded-md font-medium transition-colors duration-300"
          >
            {slide.ctaText}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index 
                ? 'w-8 bg-[#E67000]' 
                : 'w-2 bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
