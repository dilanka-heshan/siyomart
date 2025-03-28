import { Suspense } from 'react';
import ProductCard from '@/app/products/_components/ProductCard';
import Pagination from '@/app/ui/shop/Pagination';

interface ProductGridProps {
  category?: string;
  page: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

async function fetchProducts({ 
  category, 
  page = 1,
  sort = 'createdAt_desc',
  minPrice,
  maxPrice,
  search
}: ProductGridProps) {
  // Build the query params
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', '9'); // 9 products per page
  
  if (category) params.append('category', category);
  if (sort) params.append('sort', sort);
  if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
  if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
  if (search) params.append('search', search);
  
  // In a real app, replace with your absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
      next: { revalidate: 60 } ,// Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
        // console.log(response)
    return response.json();
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], pagination: { total: 0, pages: 0, currentPage: 1 } };
  }
}

export default async function ProductGrid({ 
  category, 
  page = 1,
  sort,
  minPrice,
  maxPrice,
  search
}: ProductGridProps) {
  const { products, pagination } = await fetchProducts({ 
    category, 
    page, 
    sort,
    minPrice,
    maxPrice,
    search
  });
  
  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No products found. Try adjusting your filters.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            name={product.name}
            price={product.price}
            images={product.images || []}
            rating={product.rating ? {
              value: Array.isArray(product.rating) && product.rating.length > 0
                ? product.rating.reduce((avg: number, r: any) => avg + r.value, 0) / product.rating.length
                : 0
            } : undefined}
          />
        ))}
      </div>
      
      <div className="mt-12">
        <Pagination 
          currentPage={pagination.currentPage} 
          totalPages={pagination.pages} 
        />
      </div>
    </div>
  );
}
