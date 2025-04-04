'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import category from '@/lib/db/models/Category';

interface CategoryGridProps {
  categories: category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  return (
    <section className="py-16 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 font-heading">
            Explore Our Categories
          </h2>
          <div className="w-24 h-1 bg-[var(--color-turmeric)] mx-auto mb-4"></div>
          <p className="max-w-2xl mx-auto text-black-600 dark:text-gray-600">
            Discover traditional Sri Lankan artisanal categories, each with a rich cultural heritage and distinctive craftsmanship techniques passed down through generations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/shop?category=${category.slug}`}
              className="group relative block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="relative h-80 w-full">
                {/* Category Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className={`object-cover transition-transform duration-700 ease-in-out ${
                    hoveredCategory === category._id ? 'scale-110' : 'scale-100'
                  }`}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                
                {/* Region Badge - Optional if you have this data */}
                {category.metadata?.region && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {category.metadata.region}
                  </div>
                )}
              </div>
              
              {/* Category Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white font-heading mb-2">
                  {category.name}
                </h3>
                <p className="text-white/80 mb-4 line-clamp-2">
                  {category.description || ''}
                </p>
                
                {/* Browse Button */}
                <span className={`inline-flex items-center text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  hoveredCategory === category._id ? 'opacity-100 transform translate-x-1' : 'opacity-80'
                }`}>
                  Browse Products
                  <ArrowRight size={16} className="ml-2" />
                </span>
              </div>
              
              {/* Decorative Pattern */}
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
          ))}
        </div>
        
        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-6 py-3 rounded-md font-medium transition-colors duration-300"
          >
            View All Categories
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
