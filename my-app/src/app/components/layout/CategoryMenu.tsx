'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default function CategoryMenu({ isMobile = false }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative group" ref={menuRef}>
      <button 
        className="flex items-center text-gray-700 hover:text-amber-600 focus:outline-none"
        onClick={toggleMenu}
      >
        Categories
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      <div 
        className={`${isMobile ? '' : 'absolute left-0'} mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 
                  ${isMobile ? (isOpen ? 'block' : 'hidden') : 'md:group-hover:block hidden'}`}
      >
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
