import Link from 'next/link';
import { UserIcon, StarIcon } from '@heroicons/react/24/solid';

interface SellerInfoProps {
  seller: {
    _id: string;
    name: string;
    rating?: number;
  };
}

export default function SellerInfo({ seller }: SellerInfoProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-3">Seller Information</h3>
      
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-amber-100 p-2 rounded-full">
          <UserIcon className="h-6 w-6 text-amber-800" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{seller.name}</p>
          {seller.rating && (
            <div className="flex items-center text-sm">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{seller.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3">
        <Link 
          href={`/seller/${seller._id}`}
          className="text-amber-600 hover:text-amber-800 text-sm font-medium"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}
