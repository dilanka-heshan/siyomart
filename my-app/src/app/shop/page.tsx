import { Suspense } from 'react';
import ProductGrid from './_components/ProductGrid';
import FilterSidebar from './_components/FilterSidebar';
import SortingControls from './_components/SortingControls';
import { Metadata } from 'next';
import { getCategories } from '@/lib/services/categoryService'
import CategoryBreadcrumb from '@/app/components/ui/CategoryBreadcrumb';

export const metadata: Metadata = {
  title: 'Shop | SiyoMart',
  description: 'Discover authentic Sri Lankan handcrafted products',
};

export default async function ShopPage({ 
  searchParams 
}: { 
  searchParams: { 
    category?: string; 
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
  } 
}) {
  // Get category name for selected category
  let categoryName = "All Products";
  
  if (searchParams.category) {
    try {
      const categories = await getCategories();
      const selectedCategory = categories.find(cat => cat.slug === searchParams.category);
      if (selectedCategory) {
        categoryName = selectedCategory.name;
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  }

  // Construct the page title based on search parameters
  let pageTitle = searchParams.search 
    ? `Search: ${searchParams.search}` 
    : searchParams.category 
      ? categoryName 
      : 'Discover Our Products';

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryBreadcrumb categorySlug={searchParams.category} />
      
      <h1 className="text-3xl font-bold mb-2">
        {pageTitle}
      </h1>
      
      {searchParams.category && !searchParams.search && (
        <div className="mb-6">
          <p className="text-gray-600">Browse our collection of {categoryName.toLowerCase()}</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4">
          <FilterSidebar />
        </div>
        
        {/* Main content area */}
        <div className="w-full md:w-3/4">
          {/* Sorting and view options */}
          <SortingControls />
          
          {/* Product grid with loading state */}
          <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>}>
            <ProductGrid 
              category={searchParams.category}
              page={searchParams.page ? parseInt(searchParams.page) : 1}
              sort={searchParams.sort}
              minPrice={searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined}
              maxPrice={searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined}
              search={searchParams.search}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
