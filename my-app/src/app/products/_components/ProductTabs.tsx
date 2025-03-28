"use client";

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import ProductReviews from './ProductReviews';
import ProductQuestions from './ProductQuestions';
import classNames from 'classnames';

interface ProductTabsProps {
  product: {
    _id: string;
    name: string;
    description: string;
    specifications?: Record<string, string>;
    reviews?: any[];
  };
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const tabs = [
    { key: 'description', title: 'Description' },
    { key: 'specifications', title: 'Specifications' },
    { key: 'reviews', title: 'Reviews' },
    { key: 'questions', title: 'Questions & Answers' },
  ];
  
  return (
    <div className="my-12">
      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              className={({ selected }) =>
                classNames(
                  'py-3 px-6 text-sm font-medium focus:outline-none',
                  selected
                    ? 'border-b-2 border-amber-600 text-amber-600'
                    : 'text-gray-600 hover:text-amber-600'
                )
              }
            >
              {tab.title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {/* Description Panel */}
          <Tab.Panel className="prose max-w-none p-4">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </Tab.Panel>
          
          {/* Specifications Panel */}
          <Tab.Panel className="p-4">
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                          {key}
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No specifications available for this product.</p>
            )}
          </Tab.Panel>
          
          {/* Reviews Panel */}
          <Tab.Panel className="p-4">
            <ProductReviews productId={product._id} initialReviews={product.reviews || []} />
          </Tab.Panel>
          
          {/* Q&A Panel */}
          <Tab.Panel className="p-4">
            <ProductQuestions productId={product._id} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
