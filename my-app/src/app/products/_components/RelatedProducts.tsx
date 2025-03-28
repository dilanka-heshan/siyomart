"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getRelatedProducts } from '@/lib/services/productService';
import { formatCurrency } from '@/lib/utils/format';
import { StarIcon } from '@heroicons/react/24/solid';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  rating?: number;
  OperatorId: {
    name: string;
  };
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getRelatedProducts(categoryId, currentProductId);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  if (isLoading) {
    return (
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg aspect-square mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show the section if there are no related products
  }

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => {
          const discountedPrice = product.discount
            ? product.price - (product.price * (product.discount / 100))
            : product.price;
          
          return (
            <Link 
              href={`/products/${product._id}`}
              key={product._id}
              className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.images[0] || '/images/product-placeholder.png'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition duration-300"
                />
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                
                <div className="flex items-center mb-1">
                  {product.rating && (
                    <>
                      <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="text-xs text-gray-600 ml-1">{product.rating.toFixed(1)}</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    {product.discount && product.discount > 0 ? (
                      <div>
                        <span className="font-bold text-gray-800">{formatCurrency(discountedPrice)}</span>
                        <span className="text-xs text-gray-500 line-through ml-1">{formatCurrency(product.price)}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-gray-800">{formatCurrency(product.price)}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{product.OperatorId.name}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
