'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Textarea } from '@/app/components/ui/Textarea';
import { Select } from '@/app/components/ui/Select';
import toast from 'react-hot-toast';

interface Category {
  _id?: string;
  name: string;
  description: string;
  slug: string;
  parentCategory?: string;
  image: string;
  isActive: boolean;
  displayOrder: number;
}

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Category>({
    name: '',
    description: '',
    slug: '',
    parentCategory: '',
    image: '',
    isActive: true,
    displayOrder: 0
  });

  // Populate form data if editing
  useEffect(() => {
    if (category) {
      setFormData(category);
    }
  }, [category]);

  // Fetch parent categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          // Filter out current category to avoid circular reference
          const filtered = category 
            ? data.filter((cat: Category) => cat._id !== category._id)
            : data;
          setParentCategories(filtered);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [category]);

  // Generate slug from name
  useEffect(() => {
    if (formData.name && !category) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.slug || !formData.image) {
        toast.error('Please fill in all required fields');
        return;
      }

      const categoryData = {
        ...formData,
        parentCategory: formData.parentCategory || null,
        displayOrder: parseInt(formData.displayOrder.toString())
      };

      const url = category 
        ? `/api/admin/categories/${category._id}`
        : '/api/admin/categories';
      
      const method = category ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(category ? 'Category updated successfully!' : 'Category created successfully!');
        onSuccess();
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Category Name *"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter category name"
          required
        />

        <Input
          label="Slug *"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          placeholder="category-slug"
          required
        />
      </div>

      <Textarea
        label="Description *"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Enter category description"
        rows={3}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Parent Category"
          name="parentCategory"
          value={formData.parentCategory || ''}
          onChange={handleInputChange}
        >
          <option value="">No parent (Root category)</option>
          {parentCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </Select>

        <Input
          label="Display Order"
          name="displayOrder"
          type="number"
          min="0"
          value={formData.displayOrder}
          onChange={handleInputChange}
          placeholder="0"
        />
      </div>

      <Input
        label="Category Image URL *"
        name="image"
        value={formData.image}
        onChange={handleInputChange}
        placeholder="https://example.com/image.jpg"
        required
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleInputChange}
          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active Category
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}
