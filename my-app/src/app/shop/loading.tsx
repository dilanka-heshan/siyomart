export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-64 bg-gray-200 rounded-md animate-pulse mb-8"></div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar skeleton */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded w-3/4 mb-3 animate-pulse"></div>
            ))}
            
            <div className="h-6 bg-gray-200 rounded w-1/2 my-4"></div>
            <div className="h-8 bg-gray-100 rounded w-full mb-4 animate-pulse"></div>
            
            <div className="h-6 bg-gray-200 rounded w-1/2 my-4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded w-3/4 mb-3 animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          
          {/* Product grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
