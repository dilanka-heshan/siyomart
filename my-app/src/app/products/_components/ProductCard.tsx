import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingCart } from 'lucide-react';
import { WishlistButton } from '@/app/components/ui/WishlistButton';

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating?: {
    value: number | string | undefined;
  };
  discount?: number;
  stock?: number;
}

export default function ProductCard({ 
  _id, 
  name, 
  price, 
  images, 
  rating,
  discount = 0,
  stock = 10
}: ProductCardProps) {
  // Format the rating safely
  const formattedRating = (): string => {
    if (!rating || rating.value === undefined) return '';
    
    if (typeof rating.value === 'number') {
      return rating.value.toFixed(1);
    }
    
    return String(rating.value);
  };

  // Calculate discounted price if applicable
  const discountedPrice = discount > 0 ? price - (price * (discount / 100)) : price;
  const isOnSale = discount > 0;
  const isOutOfStock = stock <= 0;

  // Generate rating stars
  const renderStars = () => {
    if (!rating || rating.value === undefined) return null;
    
    const ratingValue = typeof rating.value === 'number' ? rating.value : 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array(5).fill(0).map((_, i) => (
          <Star 
            key={i}
            className={`w-3.5 h-3.5 ${i < fullStars ? 'fill-amber-400 text-amber-400' : 
              (i === fullStars && hasHalfStar ? 'text-amber-400 fill-amber-400/50' : 'text-gray-300')}`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">{formattedRating()}</span>
      </div>
    );
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
      {/* Wishlist button */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <WishlistButton productId={_id} className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md" />
      </div>
      
      {/* Status badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isOnSale && (
          <span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-md">
            {discount}% OFF
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md">
            Out of Stock
          </span>
        )}
      </div>

      <Link href={`/products/${_id}`} className="block">
        {/* Product Image with hover overlay */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {images && images.length > 0 ? (
            <>
              <Image
                src={images[0]}
                alt={name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                priority
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              
              {/* Quick action button on hover */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <button className="bg-white text-gray-800 hover:bg-amber-500 hover:text-white rounded-full py-2 px-4 flex items-center gap-2 transition-colors duration-200 shadow-lg text-sm font-medium">
                  <ShoppingCart className="h-4 w-4" />
                  Quick View
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-1">
            {renderStars()}
          </div>
          
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 group-hover:text-amber-600 transition-colors">
            {name}
          </h3>
          
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-semibold text-amber-600">
              {formatPrice(discountedPrice)}
            </span>
            
            {isOnSale && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
