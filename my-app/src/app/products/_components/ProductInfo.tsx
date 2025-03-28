"use client";

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils/format';
import { useState } from 'react';

interface ProductInfoProps {
  product: {
    name: string;
    description: string;
    price: number;
    discount?: number;
    stock: number;
    rating?: number;
    category: string;
    // Add any other fields needed
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const {
    name,
    description,
    price,
    discount = 0,
    stock,
    rating = 0,
    category,
  } = product;
  
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const discountedPrice = price - (price * (discount / 100));
  const isOnSale = discount > 0;
  
  // Generate full stars based on rating
  const renderRatingStars = () => {
    // Return early if rating is 0
    if (!rating) {
      return Array(5).fill(0).map((_, i) => (
        <StarOutline key={i} className="h-5 w-5 text-gray-300" />
      ));
    }
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        // Improved half star rendering
        stars.push(
          <span key={i} className="relative inline-block h-5 w-5">
            <StarOutline className="h-5 w-5 text-yellow-400 absolute inset-0" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className="h-5 w-5 text-yellow-400" />
            </div>
          </span>
        );
      } else {
        stars.push(<StarOutline key={i} className="h-5 w-5 text-yellow-400" />);
      }
    }
    
    return stars;
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{name}</h1>
        <p className="text-sm text-gray-500 mt-1">Category: {category}</p>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center">
          {renderRatingStars()}
          <span className="ml-2 text-gray-600">{rating ? rating.toFixed(1) : '0.0'}</span>
        </div>
      </div>
      
      <div>
        {isOnSale ? (
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-900">{formatCurrency(discountedPrice)}</span>
            <span className="ml-2 text-xl text-gray-500 line-through">{formatCurrency(price)}</span>
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-md">
              {discount}% OFF
            </span>
          </div>
        ) : (
          <span className="text-3xl font-bold text-gray-900">{formatCurrency(price)}</span>
        )}
      </div>
      
      <div className="py-1">
        <span className={`text-sm font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock > 0 
            ? stock > 10 
              ? 'In Stock' 
              : `Only ${stock} left` 
            : 'Out of Stock'}
        </span>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <p className={`text-gray-700 ${!showFullDescription ? 'line-clamp-3' : ''}`}>
          {description}
        </p>
        {description.length > 150 && (
          <button 
            onClick={() => setShowFullDescription(!showFullDescription)} 
            className="text-amber-600 hover:text-amber-700 text-sm font-medium mt-1"
          >
            {showFullDescription ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
}
