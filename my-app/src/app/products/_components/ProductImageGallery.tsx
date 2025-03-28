"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';


interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  
  // Fallback image if no images are provided
  const displayImages = images.length > 0 
    ? images 
    : ['/images/product-placeholder.png'];
  
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 border">
        <Image
          src={displayImages[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover object-center cursor-zoom-in"
          priority={true}
          onClick={() => setIsZoomOpen(true)}
        />
        <button 
          className="absolute right-2 top-2 bg-white/80 p-1 rounded-full shadow-md"
          onClick={() => setIsZoomOpen(true)}
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
        </button>
      </div>
      
      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto py-2">
          {displayImages.map((image, index) => (
            <div 
              key={index}
              className={`relative w-20 h-20 flex-shrink-0 rounded border-2 cursor-pointer 
                ${selectedImage === index ? 'border-amber-600' : 'border-transparent'}`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center rounded"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Zoom Dialog */}
      <Dialog 
        open={isZoomOpen} 
        onClose={() => setIsZoomOpen(false)} 
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <button 
              onClick={() => setIsZoomOpen(false)}
              className="absolute right-2 top-2 bg-white/80 p-1 rounded-full shadow-md z-10"
            >
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
            
            <div className="p-2">
              <Image
                src={displayImages[selectedImage]}
                alt={`${productName} - Large View`}
                width={1200}
                height={1200}
                className="w-full h-auto object-contain"
              />
            </div>
            
            {/* Thumbnail Strip in Modal */}
            {displayImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto p-2 bg-gray-100">
                {displayImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`relative w-16 h-16 flex-shrink-0 rounded border-2 cursor-pointer 
                      ${selectedImage === index ? 'border-amber-600' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image}
                      alt={`${productName} thumbnail ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover object-center rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
