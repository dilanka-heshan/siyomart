/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.app.goo.gl',
      'lh3.googleusercontent.com', // For Google images that might redirect here
      'images.unsplash.com',       // Common image source
      'plus.unsplash.com',         // Another Unsplash domain
      'res.cloudinary.com',
      'storage.siyomart.com'        // If you use Cloudinary for images
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Add API retry configuration
  api: {
    responseLimit: false, // Remove size limit for API responses
    bodyParser: {
      sizeLimit: '2mb', // Increase the body parser size limit
    },
  },
}

module.exports = nextConfig
