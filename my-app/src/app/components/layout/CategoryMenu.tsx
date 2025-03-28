'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="relative group">
      <button className="flex items-center text-gray-700 hover:text-amber-600 transition-colors">
        Shop <ChevronDown className="ml-1 h-4 w-4" />
      </button>
      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
        <Link href="/shop" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
          All Products
        </Link>
        
        {isLoading ? (
          <div className="px-4 py-2 text-gray-400">Loading categories...</div>
        ) : (
          categories.map((category) => (
            <Link 
              key={category._id}
              href={`/shop?category=${category.slug}`}
              className="block px-4 py-2 text-gray-700 hover:bg-amber-50"
            >
              {category.name}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
