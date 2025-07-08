import connectDB from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

// Timeout wrapper for fetch requests
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number) => {
  // Create an AbortController with a more conservative timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      // Add proper cache control headers
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache',
      },
      // Set a shorter next.js cache setting
      next: { revalidate: 0 }
    });

    clearTimeout(timeoutId); // Clear the timeout once the request completes

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId); // Make sure to clear timeout on error
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out:', url);
        throw new Error('Request timed out. Please try again later.');
      }
      
      // Check for specific header timeout errors
      if (error.cause && 
          typeof error.cause === 'object' && 
          'code' in error.cause && 
          error.cause.code === 'UND_ERR_HEADERS_TIMEOUT') {
        console.error('Headers timeout error:', url);
        throw new Error('Server response took too long. Please try again later.');
      }
    }
    
    console.error('Fetch error:', error);
    throw error; // Propagate any other errors
  }
};

/**
 * Get a product by its ID with timeout
 */
export async function getProductById(id: string) {
  try {
    console.log("Fetching product with ID:", id);
    
    // Use a safer URL construction method
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Default to localhost during development
    const url = `${baseUrl}/api/products/${id}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal
    });

    console.log("Raw API response:", response);
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Parsed Product Data:", data);
    
    // Check if the response contains the product data or is properly structured
    if (!data || (data && !data._id)) {
      console.error("Invalid product data received:", data);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Error fetching product:", err);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error("Request timed out. Please try again later.");
    }
    throw err;
  }
}

/**
 * Get related products based on category
 */
export async function getRelatedProducts(categoryId: string, currentProductId: string, limit = 4) {
  try {
    const url = `/api/products?category=${categoryId}&limit=${limit}&exclude=${currentProductId}`;
    
    const response = await fetch(url, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch related products');
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

/**
 * Submit a product review with timeout
 */
export async function submitProductReview(productId: string, reviewData: any) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    
    // Use the same safe URL construction approach
    let url;
    try {
      if (baseUrl) {
        const base = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
        url = new URL(`api/reviews/${productId}`, base).toString();
      } else {
        url = `/api/reviews/${productId}`;
      }
    } catch (err) {
      console.warn("URL construction failed, falling back to relative path:", err);
      url = `/api/reviews/${productId}`;
    }
    
    const timeout = 8000;
    
    const data = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    }, timeout);

    return data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 4) {
  try {
    console.log('Starting getFeaturedProducts...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Log the query we're about to make
    console.log('Querying products with:', { 
      stock: { $gt: 0 },
      sort: { 'rating.value': -1, createdAt: -1 },
      limit 
    });
    
    const products = await Product.find({ stock: { $gt: 0 } })
      .sort({ 'rating.value': -1, createdAt: -1 })
      .limit(limit)
      .populate('OperatorId', 'name')
      .lean();

    console.log('Raw products from DB:', products);
    
    if (!products || products.length === 0) {
      console.log('No products found');
      return [];
    }

    return JSON.parse(JSON.stringify(products));

  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
