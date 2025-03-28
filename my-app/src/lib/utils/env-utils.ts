/**
 * Environment and URL utility functions
 */

/**
 * Get the base URL of the application
 * Handles different environments: development, production, and deployment platforms
 */
export function getBaseUrl(): string {
  // Check for Vercel environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Check for custom API URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Default to localhost in development
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : `https://${process.env.NEXT_PUBLIC_DOMAIN || 'example.com'}`;
}

/**
 * Determine if code is running on the server or client
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Ensure a URL is absolute
 * If it's a relative URL, it will be joined with the base URL
 */
export function ensureAbsoluteUrl(path: string): string {
  // If the URL is already absolute, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Make sure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Join with base URL
  const baseUrl = getBaseUrl();
  const baseWithoutTrailingSlash = baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl;
    
  return `${baseWithoutTrailingSlash}${normalizedPath}`;
}
