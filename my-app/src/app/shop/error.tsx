'use client'; // Error components must be client components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">
        We couldn't load the products. Please try again.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={reset}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
