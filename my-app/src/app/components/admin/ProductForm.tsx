'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Textarea } from '@/app/components/ui/Textarea';
import { Select } from '@/app/components/ui/Select';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  category: string;
  categoryId: string;
  price: number;
  discount: number;
  shipping_weight: string;
  stock: number;
  images: string[];
}

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    category: '',
    categoryId: '',
    price: 0,
    discount: 0,
    shipping_weight: '',
    stock: 0,
    images: []
  });

  // Populate form data if editing
  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.categoryId || 
          !formData.price || !formData.shipping_weight || formData.stock === undefined) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Find category name from categoryId
      const selectedCategory = categories.find(cat => cat._id === formData.categoryId);
      if (!selectedCategory) {
        toast.error('Please select a valid category');
        return;
      }

      const productData = {
        ...formData,
        category: selectedCategory.name,
        price: parseFloat(formData.price.toString()),
        discount: parseFloat(formData.discount.toString()),
        stock: parseInt(formData.stock.toString())
      };

      const url = product 
        ? `/api/admin/products/${product._id}`
        : '/api/admin/products';
      
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(product ? 'Product updated successfully!' : 'Product created successfully!');
        onSuccess();
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const images = value.split(',').map(img => img.trim()).filter(img => img !== '');
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name *"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter product name"
          required
        />

        <Select
          label="Category *"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Description *"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Enter product description"
        rows={4}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Price ($) *"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="0.00"
          required
        />

        <Input
          label="Discount ($)"
          name="discount"
          type="number"
          min="0"
          step="0.01"
          value={formData.discount}
          onChange={handleInputChange}
          placeholder="0.00"
        />

        <Input
          label="Stock Quantity *"
          name="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={handleInputChange}
          placeholder="0"
          required
        />
      </div>

      <Input
        label="Shipping Weight *"
        name="shipping_weight"
        value={formData.shipping_weight}
        onChange={handleInputChange}
        placeholder="e.g., 2kg, 500g, 1.5lb"
        required
      />

      <Input
        label="Product Images"
        name="images"
        value={formData.images.join(', ')}
        onChange={handleImageChange}
        placeholder="Enter image URLs separated by commas"
      />

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
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
