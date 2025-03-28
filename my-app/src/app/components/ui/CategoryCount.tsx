'use client';

import { useState, useEffect } from 'react';

interface CategoryCountProps {
  categorySlug: string;
}

export default function CategoryCount({ categorySlug }: CategoryCountProps) {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryCount() {
      try {
        const response = await fetch(`/api/products/count?category=${categorySlug}`);
        if (!response.ok) throw new Error('Failed to fetch count');
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error('Error fetching product count:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategoryCount();
  }, [categorySlug]);

  if (isLoading) {
    return <span className="text-xs text-gray-400">Loading...</span>;
  }

  return (
    <span className="text-xs text-gray-500 ml-2">
      ({count} {count === 1 ? 'product' : 'products'})
    </span>
  );
}
