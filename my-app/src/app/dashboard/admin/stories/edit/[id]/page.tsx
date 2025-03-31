"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import StoryForm from '../../_components/StoryForm';

interface StoryData {
  _id: string;
  productId: string;
  title: string;
  description: string;
  artisanName?: string;
  region?: string;
  traditionalSignificance?: string;
  craftProcess?: string;
  imageUrl?: string;
}

export default function EditStoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/stories/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }
        
        const data = await response.json();
        setStory(data);
      } catch (error) {
        console.error('Error fetching story:', error);
        toast.error('Failed to load story');
        router.push('/dashboard/admin/stories');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStory();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Story</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-32 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product Story</h1>
        <p className="text-gray-600 mt-1">
          Update the story details to enhance authenticity and customer connection.
        </p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <StoryForm 
          editMode={true} 
          storyId={params.id}
          initialData={story}
        />
      </div>
    </div>
  );
}
