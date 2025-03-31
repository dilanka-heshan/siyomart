'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/app/products/_components/ProductCard';
import Pagination from '@/app/ui/shop/Pagination';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  rating: number;
  description: string;
  category: string;
}

interface ProductGridProps {
  category?: string;
  page?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export default function ProductGrid({ 
  category, 
  page = 1, 
  sort = 'createdAt_desc',
  minPrice,
  maxPrice,
  search
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        // Build the query string
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (page) params.set('page', page.toString());
        if (sort) params.set('sort', sort);
        if (minPrice !== undefined) params.set('minPrice', minPrice.toString());
        if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
        if (search) params.set('query', search);
        
        const response = await fetch(`/api/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        setError('Error fetching products. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, page, sort, minPrice, maxPrice, search]);

  const handlePageChange = (newPage: number) => {
    // Build the current URL parameters
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (minPrice !== undefined) params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
    if (search) params.set('search', search);
    
    // Set the new page
    params.set('page', newPage.toString());
    
    // Navigate to the new URL
    router.push(`/shop?${params.toString()}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">No products found.</p>
        {search && (
          <div className="mt-4">
            <p className="mb-2">No results for "{search}"</p>
            <button 
              onClick={() => {
                const params = new URLSearchParams();
                if (category) params.set('category', category);
                if (sort) params.set('sort', sort);
                if (minPrice !== undefined) params.set('minPrice', minPrice.toString());
                if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
                router.push(`/shop?${params.toString()}`);
              }}
              className="text-amber-600 underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {search && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p>Search results for: <span className="font-medium">"{search}"</span></p>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            name={product.name}
            price={product.price}
            images={product.images}
            rating={{ value: product.rating }}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
