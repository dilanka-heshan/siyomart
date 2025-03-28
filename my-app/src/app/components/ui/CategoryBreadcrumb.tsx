'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CategoryBreadcrumbProps {
  categorySlug?: string;
}

interface Category {
  name: string;
  slug: string;
}

export default function CategoryBreadcrumb({ categorySlug }: CategoryBreadcrumbProps) {
  const [categoryName, setCategoryName] = useState<string | null>(null);

  useEffect(() => {
    if (categorySlug) {
      async function fetchCategoryName() {
        try {
          const response = await fetch('/api/categories');
          if (!response.ok) throw new Error('Failed to fetch categories');
          const categories = await response.json();
          
          const category = categories.find((cat: Category) => cat.slug === categorySlug);
          if (category) {
            setCategoryName(category.name);
          }
        } catch (error) {
          console.error('Error fetching category name:', error);
        }
      }
      
      fetchCategoryName();
    }
  }, [categorySlug]);

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-amber-600">Home</Link>
      <ChevronRight className="h-4 w-4 mx-2" />
      <Link href="/shop" className="hover:text-amber-600">Shop</Link>
      
      {categorySlug && categoryName && (
        <>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link 
            href={`/shop?category=${categorySlug}`}
            className="text-amber-600 font-medium"
          >
            {categoryName}
          </Link>
        </>
      )}
    </nav>
  );
}
