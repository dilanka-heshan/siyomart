'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Grid, List, SlidersHorizontal } from 'lucide-react';

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
    
    // Update URL while preserving other parameters
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
    <div className="mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center mb-4 md:mb-0">
          <button 
            onClick={() => toggleFilterVisibility()}
            className="md:hidden flex items-center mr-4 text-sm text-gray-600"
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Filters
          </button>
          
          <p className="text-gray-500 text-sm">
            Showing <span className="font-medium">{searchParams.get('page') || '1'}</span> 
            {searchParams.get('search') && 
              <span> • Search: <span className="font-medium">{searchParams.get('search')}</span></span>
            }
          </p>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="py-1 px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
          
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => toggleViewMode('grid')}
              className={`p-1 ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-500'}`}
              title="Grid View"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => toggleViewMode('list')}
              className={`p-1 ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-500'}`}
              title="List View"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
