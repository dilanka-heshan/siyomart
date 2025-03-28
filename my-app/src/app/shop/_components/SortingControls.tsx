'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Grid2X2, List, SlidersHorizontal } from 'lucide-react';

export default function SortingControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortOption, setSortOption] = useState(
    searchParams.get('sort') || 'createdAt_desc'
  );
  
  // Handle sort change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = event.target.value;
    setSortOption(newSort);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/shop?${params.toString()}`);
  };
  
  // Toggle view mode
  const toggleViewMode = (mode: string) => {
    setViewMode(mode);
  };
  
  // Toggle filter visibility for mobile
  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
      {/* Mobile filter toggle */}
      <button 
        className="flex items-center sm:hidden mb-4 sm:mb-0 text-sm text-gray-600"
        onClick={toggleFilterVisibility}
      >
        <SlidersHorizontal size={16} className="mr-2" />
        Filters
      </button>
      
      {/* Sort by dropdown */}
      <div className="flex-1 w-full sm:w-auto">
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm text-gray-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="bg-white border border-gray-300 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          >
            <option value="createdAt_desc">Newest</option>
            <option value="createdAt_asc">Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Best Rating</option>
          </select>
        </div>
      </div>
      
      {/* View mode toggle */}
      <div className="flex items-center mt-4 sm:mt-0">
        <span className="text-sm text-gray-600 mr-2">View:</span>
        <button 
          className={`p-1 rounded ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'bg-white text-gray-600'}`}
          onClick={() => toggleViewMode('grid')}
          aria-label="Grid view"
        >
          <Grid2X2 size={16} />
        </button>
        <button 
          className={`p-1 rounded ml-2 ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'bg-white text-gray-600'}`}
          onClick={() => toggleViewMode('list')}
          aria-label="List view"
        >
          <List size={16} />
        </button>
      </div>
    </div>
  );
}
