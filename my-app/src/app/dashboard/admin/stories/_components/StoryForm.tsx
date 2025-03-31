"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface Product {
  _id: string;
  name: string;
  images: string[];
}

interface StoryFormProps {
  editMode?: boolean;
  storyId?: string;
  initialData?: {
    productId: string;
    title: string;
    description: string;
    artisanName?: string;
    region?: string;
    traditionalSignificance?: string;
    craftProcess?: string;
    imageUrl?: string;
  };
}

export default function StoryForm({ editMode = false, storyId, initialData }: StoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [formData, setFormData] = useState({
    productId: initialData?.productId || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    artisanName: initialData?.artisanName || '',
    region: initialData?.region || '',
    traditionalSignificance: initialData?.traditionalSignificance || '',
    craftProcess: initialData?.craftProcess || '',
    imageUrl: initialData?.imageUrl || '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await fetch('/api/admin/products?withoutStories=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editMode 
        ? `/api/admin/stories/${storyId}` 
        : '/api/admin/stories';
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save story');
      }

      toast.success(editMode ? 'Story updated successfully' : 'Story created successfully');
      router.push('/dashboard/admin/stories');
      router.refresh();
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 mt-4">
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
            Product
          </label>
          <select
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            disabled={editMode || loadingProducts}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          {loadingProducts && (
            <p className="text-sm text-gray-500 mt-1">Loading products...</p>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Story Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Story Description (Markdown supported)
          </label>
          <textarea
            name="description"
            id="description"
            rows={6}
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            placeholder="Tell the story of this handcraft..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Use Markdown for formatting. For example, **bold text**, *italic text*, ## headings.
          </p>
        </div>

        <div>
          <label htmlFor="artisanName" className="block text-sm font-medium text-gray-700">
            Artisan Name
          </label>
          <input
            type="text"
            name="artisanName"
            id="artisanName"
            value={formData.artisanName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Region/Province
          </label>
          <input
            type="text"
            name="region"
            id="region"
            value={formData.region}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            placeholder="e.g., Central Province, Kandy"
          />
        </div>

        <div>
          <label htmlFor="traditionalSignificance" className="block text-sm font-medium text-gray-700">
            Cultural/Traditional Significance
          </label>
          <textarea
            name="traditionalSignificance"
            id="traditionalSignificance"
            rows={3}
            value={formData.traditionalSignificance}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="craftProcess" className="block text-sm font-medium text-gray-700">
            Craft Process
          </label>
          <textarea
            name="craftProcess"
            id="craftProcess"
            rows={3}
            value={formData.craftProcess}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            placeholder="Describe the traditional crafting process"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL (optional)
          </label>
          <input
            type="url"
            name="imageUrl"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            Add an image of the crafting process or artisan
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          disabled={loading}
        >
          {loading ? 'Saving...' : editMode ? 'Update Story' : 'Create Story'}
        </button>
      </div>
    </form>
  );
}
