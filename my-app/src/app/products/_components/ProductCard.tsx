import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating?: {
    value: number | string | undefined;
  };
}

export default function ProductCard({ _id, name, price, images, rating }: ProductCardProps) {
  // Format the rating safely
  const formattedRating = (): string => {
    if (!rating || rating.value === undefined) return '';
    
    if (typeof rating.value === 'number') {
      return rating.value.toFixed(1);
    }
    
    return String(rating.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${_id}`}>
        <div className="relative h-52 w-full">
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 truncate">{name}</h3>
          <p className="text-amber-600 font-medium mt-1">{formatPrice(price)}</p>
          
          {rating && rating.value !== undefined && (
            <div className="flex items-center mt-1">
              <span className="text-amber-500">★</span>
              <span className="ml-1 text-sm text-gray-600">{formattedRating()}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
