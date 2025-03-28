import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <ExclamationTriangleIcon className="w-16 h-16 text-amber-600 mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        We couldn't find the page you're looking for. The product may have been removed or the URL might be incorrect.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link 
          href="/shop" 
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Browse Products
        </Link>
        <Link 
          href="/" 
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
