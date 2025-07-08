"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Story {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images: string[];
  };
  title: string;
  description: string;
  createdAt: string;
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  // const router = useRouter();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/admin/stories');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error('Failed to fetch stories:', error);
        toast.error('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleDelete = async (storyId: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      try {
        const response = await fetch(`/api/admin/stories/${storyId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete story');
        }

        setStories(stories.filter(story => story._id !== storyId));
        toast.success('Story deleted successfully');
      } catch (error) {
        console.error('Error deleting story:', error);
        toast.error('Failed to delete story');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Product Stories</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-100 p-4 rounded-lg">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Stories</h1>
        <Link 
          href="/dashboard/admin/stories/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg text-center">
          <p className="mb-4">No product stories found. Start adding authentic stories to enhance your products!</p>
          <Link 
            href="/dashboard/admin/stories/create"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
          >
            Create Your First Story
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {stories.map((story) => (
            <div key={story._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-1/4">
                  <img 
                    src={story.productId.images?.[0] || '/images/product-placeholder.png'} 
                    alt={story.productId.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-4 md:w-3/4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{story.title}</h3>
                      <p className="text-sm text-gray-500">
                        For product: {story.productId.name}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        href={`/dashboard/admin/stories/edit/${story._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(story._id)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                    {story.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Link
                      href={`/products/${story.productId._id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                      target="_blank"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
