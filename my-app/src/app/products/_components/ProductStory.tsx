"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

interface Story {
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

export default function ProductStory({ productId }: { productId: string }) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stories/${productId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // No story found is normal, don't show an error
            setStory(null);
            return;
          }
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        setStory(data);
      } catch (err) {
        console.error('Error fetching product story:', err);
        setError('Failed to load the product story.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchStory();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="my-8 p-6 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5 mb-3"></div>
      </div>
    );
  }

  if (error) {
    console.error('Error:', error);
    return null; // Don't show errors to users, just hide the component
  }

  if (!story) {
    console.log('No story found for this product.');
    return null; // If no story, don't render anything
  }

  return (
    <div className="my-8 p-6 bg-amber-50 rounded-lg border border-amber-100">
      <div className="flex items-center mb-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-amber-700 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
          />
        </svg>
        <h3 className="text-xl font-semibold text-amber-800">{story.title}</h3>
      </div>
      
      <div className="prose prose-amber max-w-none">
        <ReactMarkdown>{story.description}</ReactMarkdown>
      </div>
      
      {(story.artisanName || story.region || story.traditionalSignificance || story.craftProcess) && (
        <Disclosure as="div" className="mt-6">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center px-4 py-2 text-sm font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg">
                <span>More about this handcraft</span>
                <ChevronDownIcon
                  className={`${open ? 'transform rotate-180' : ''} w-5 h-5`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-700 space-y-3">
                {story.artisanName && (
                  <div>
                    <h4 className="font-semibold text-amber-800">Artisan</h4>
                    <p>{story.artisanName}</p>
                  </div>
                )}
                
                {story.region && (
                  <div>
                    <h4 className="font-semibold text-amber-800">Region</h4>
                    <p>{story.region}</p>
                  </div>
                )}
                
                {story.traditionalSignificance && (
                  <div>
                    <h4 className="font-semibold text-amber-800">Cultural Significance</h4>
                    <p>{story.traditionalSignificance}</p>
                  </div>
                )}
                
                {story.craftProcess && (
                  <div>
                    <h4 className="font-semibold text-amber-800">Traditional Craft Process</h4>
                    <p>{story.craftProcess}</p>
                  </div>
                )}
                
                {story.imageUrl && (
                  <div className="mt-4">
                    <div className="relative h-60 w-full">
                      <Image
                        src={story.imageUrl}
                        alt={`${story.title} - Crafting process`}
                        fill
                        sizes="100vw"
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      )}
    </div>
  );
}
