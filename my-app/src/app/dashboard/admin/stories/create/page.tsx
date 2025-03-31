"use client";

import { Toaster } from 'react-hot-toast';
import StoryForm from '../_components/StoryForm';

export default function CreateStoryPage() {
  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Product Story</h1>
        <p className="text-gray-600 mt-1">
          Add an authentic story to highlight the cultural significance and craftsmanship of your product.
        </p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <StoryForm />
      </div>
    </div>
  );
}
