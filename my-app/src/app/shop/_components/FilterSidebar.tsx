'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PriceRangeSlider from '@/app/ui/shop/PriceRangeSlider';
import { XCircle } from 'lucide-react';

// Fetch categories - In a full implementation, this would come from your API
async function getCategories() {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') as string) : 0,
    max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') as string) : 10000
  });
  const [ratings, setRatings] = useState<number[]>([]);

  useEffect(() => {
    // Fetch categories when component mounts
    getCategories().then(data => {
      setCategories(data || []);
    });
  }, []);

  // Handle category selection
  const handleCategoryChange = (categorySlug: string) => {
    if (selectedCategory === categorySlug) {
      // If clicking the same category, deselect it
      setSelectedCategory(null);
      updateFilters({ category: null });
    } else {
      // Select the new category
      setSelectedCategory(categorySlug);
      updateFilters({ category: categorySlug });
    }
  };

  // Handle price range change
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    updateFilters({ minPrice: min.toString(), maxPrice: max.toString() });
  };

  // Handle rating selection
  const handleRatingChange = (rating: number) => {
    const newRatings = ratings.includes(rating)
      ? ratings.filter(r => r !== rating)
      : [...ratings, rating];

    setRatings(newRatings);
    updateFilters({ ratings: newRatings.join(',') });
  };

  // Update URL params when filters change
  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 when filters change
    params.set('page', '1');

    // Update or remove params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Update the URL using replace instead of push to prevent scroll reset
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  // Handle clearing all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange({ min: 0, max: 100000 });
    setRatings([]);
    router.replace('/shop', { scroll: false });
  };

  // Add a method to clear category filter specifically
  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            onClick={clearFilters}
            className="text-sm text-amber-600 hover:text-amber-800"
          >
            Clear All
          </button>
        </div>
        <div className="h-px bg-gray-200 my-4"></div>
      </div>
      
      {/* Category filter with active indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Categories</h3>
          {selectedCategory && (
            <button 
              onClick={clearCategoryFilter} 
              className="text-xs text-amber-600 hover:text-amber-800 flex items-center"
            >
              <XCircle size={14} className="mr-1" />
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.slug} className="flex items-center">
              <input
                type="radio"
                id={`category-${category.slug}`}
                name="category"
                checked={selectedCategory === category.slug}
                onChange={() => handleCategoryChange(category.slug)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500"
              />
              <label 
                htmlFor={`category-${category.slug}`} 
                className={`ml-2 text-sm ${selectedCategory === category.slug 
                  ? 'text-amber-600 font-medium' 
                  : 'text-gray-700'}`}
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price range filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Price Range</h3>
        <PriceRangeSlider 
          min={0} 
          max={100000} 
          initialMin={priceRange.min} 
          initialMax={priceRange.max}
          onChange={handlePriceChange}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Rs. {priceRange.min.toLocaleString()}</span>
          <span>Rs. {priceRange.max.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Rating filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                type="checkbox"
                id={`rating-${rating}`}
                checked={ratings.includes(rating)}
                onChange={() => handleRatingChange(rating)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
              />
              <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                <div className="flex text-amber-400">
                  {[...Array(rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {[...Array(5 - rating)].map((_, i) => (
                    <span key={i} className="text-gray-300">★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-1">& up</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Apply filters button for mobile */}
      <div className="md:hidden">
        <button
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-md transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
