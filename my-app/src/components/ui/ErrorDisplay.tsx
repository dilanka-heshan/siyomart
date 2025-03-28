"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorDisplayProps {
  error: unknown;
  resetAction?: () => void;
}

export default function ErrorDisplay({ error, resetAction }: ErrorDisplayProps) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  
  const handleTryAgain = () => {
    if (resetAction) {
      resetAction();
    } else {
      window.location.reload();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        There was an error loading this content
      </h1>
      <p className="mb-4">
        We're experiencing technical difficulties. Please try again later.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Error: {errorMessage}
      </p>
      <button 
        onClick={handleTryAgain}
        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
      >
        Try Again
      </button>
    </div>
  );
}
