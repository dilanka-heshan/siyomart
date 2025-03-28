import { TruckIcon, ClockIcon, ArrowPathRoundedSquareIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';


export default function ShippingInfo() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium text-gray-900 mb-3">Shipping & Delivery Information</h3>
      
      <div className="space-y-3">
        <div className="flex gap-3 items-start">
        <TruckIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-gray-700">Free Standard Shipping</p>
            <p className="text-xs text-gray-500">For orders over LKR 5,000</p>
          </div>
        </div>
        
        <div className="flex gap-3 items-start">
          <ClockIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Delivery Estimate</p>
            <p className="text-xs text-gray-500">3-5 business days (Colombo)</p>
            <p className="text-xs text-gray-500">5-7 business days (Other areas)</p>
          </div>
        </div>
        
        <div className="flex gap-3 items-start">
          <CurrencyRupeeIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Cash on Delivery</p>
            <p className="text-xs text-gray-500">Available for orders under LKR 15,000</p>
          </div>
        </div>
        
        <div className="flex gap-3 items-start">
           <ArrowPathRoundedSquareIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
           <div>
             <p className="text-sm font-medium text-gray-700">Returns & Exchanges</p>
             <p className="text-xs text-gray-500">7-day return policy for unused items</p>
           </div>
         </div>
       </div>
     </div>
  );
}

