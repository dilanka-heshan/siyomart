"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/format';

interface RecentlyViewedProps {
  currentProductId: string;
}

interface RecentProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [products, setProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    // Retrieve recently viewed products from localStorage
    const getRecentlyViewedProducts = () => {
      try {
        const recentlyViewed = localStorage.getItem('recentlyViewed');
        if (recentlyViewed) {
          const parsedProducts = JSON.parse(recentlyViewed) as RecentProduct[];
          // Filter out the current product
          return parsedProducts.filter(product => product._id !== currentProductId).slice(0, 4);
        }
        return [];
      } catch (error) {
        console.error('Error retrieving recently viewed products:', error);
        return [];
      }
    };

    // Get current product info from the page and add it to recently viewed
    const saveCurrentProductToRecentlyViewed = () => {
      try {
        // This is a simplified version. In a real app, you would get this data from props or context
        // For now, we'll use a mock implementation
        const productName = document.querySelector('h1')?.textContent || '';
        const productPrice = document.querySelector('.text-3xl')?.textContent || '';
        const productImage = document.querySelector('.aspect-square img')?.getAttribute('src') || '';
        
        if (!productName) return; // Don't save if we can't get the product info
        
        const newProduct: RecentProduct = {
          _id: currentProductId,
          name: productName,
          price: parseFloat(productPrice.replace(/[^0-9.-]+/g, '')) || 0,
          image: productImage,
        };
        
        const existingProducts = getRecentlyViewedProducts();
        
        // Create a new array with the current product at the beginning, avoiding duplicates
        const updatedProducts = [
          newProduct,
          ...existingProducts.filter(p => p._id !== currentProductId)
        ].slice(0, 8); // Store only the 8 most recent products
        
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedProducts));
      } catch (error) {
        console.error('Error saving to recently viewed:', error);
      }
    };

    setProducts(getRecentlyViewedProducts());
    
    // Save the current product to recently viewed
    // This is wrapped in a setTimeout to ensure the page has fully loaded
    setTimeout(saveCurrentProductToRecentlyViewed, 1000);
    
  }, [currentProductId]);

  if (products.length === 0) {
    return null; // Don't show if there are no recently viewed products
  }

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link 
            href={`/products/${product._id}`}
            key={product._id}
            className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
          >
            <div className="relative aspect-square">
              <Image
                src={product.image || '/images/product-placeholder.png'}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition duration-300"
              />
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
              <span className="font-bold text-gray-800">{formatCurrency(product.price)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
