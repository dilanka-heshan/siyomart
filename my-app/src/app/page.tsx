import Link from 'next/link'
import Image from 'next/image'
import { getCategories } from '@/lib/services/categoryService'
import { getFeaturedProducts } from '@/lib/services/productService';
import ProductCard from '@/app/products/_components/ProductCard'
import { Product } from '@/types/database'
import { category } from '@/lib/db/models/Category'
import HeroSection from './components/home/HeroSection';
import CategoryGrid from './components/home/CategoryGrid';
import { Cat } from 'lucide-react'


export default async function Home() {
  let categories: category[] = [];
  let featuredProducts: Product[] = [];
  let error: string | null = null;

  try {
    // Parallel fetch for better performance
    const [categoriesData, productsData] = await Promise.all([
      getCategories(),
      getFeaturedProducts(10),
    ]);
    
    categories = categoriesData;
    featuredProducts = productsData;

  } catch (err) {
    console.error('Error in Home page:', err);
    error = 'Failed to load content. Please try again later.';
  }

  // Early return for error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
{/* <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1603899968034-12aadcdbfdc0?q=80&w=2071&auto=format&fit=crop"
            alt="Sri Lankan Handmade Product"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Discover Authentic Sri Lankan Craftsmanship</h1>
            <p className="text-xl mb-8">
              Unique handmade products crafted with love and tradition, delivered to your doorstep worldwide.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/shop" className="btn-primary">
                Shop Now
              </Link>
              <Link href="/about" className="bg-transparent border-2 border-white hover:bg-white hover:text-amber-800 text-white font-medium py-2 px-6 rounded-md transition duration-300">
                Learn More
              </Link>
              <Link href="/register" className="bg-white text-amber-800 font-medium py-2 px-6 rounded-md transition duration-300 hover:bg-gray-100">
                Join Us
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1603899968034-12aadcdbfdc0?q=80&w=2071&auto=format&fit=crop"
            alt="Sri Lankan Handmade Product"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Discover Authentic Sri Lankan Craftsmanship</h1>
            <p className="text-xl mb-8">
              Unique handmade products crafted with love and tradition, delivered to your doorstep worldwide.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/shop" className="btn-primary">
                Shop Now
              </Link>
              <Link href="/about" className="bg-transparent border-2 border-white hover:bg-white hover:text-amber-800 text-white font-medium py-2 px-6 rounded-md transition duration-300">
                Learn More
              </Link>
              <Link href="/register" className="bg-white text-amber-800 font-medium py-2 px-6 rounded-md transition duration-300 hover:bg-gray-100">
                Join Us
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      <section>
        <HeroSection />
        <CategoryGrid categories={categories} />
      </section>

      {/* Categories Section
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link 
                key={category._id} 
                href={`/shop?category=${category.slug}`}
                className="group relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white text-xl font-medium p-4 w-full">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}


      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: Product) => (
              <ProductCard 
                key={product._id}
                _id={product._id}
                name={product.name}
                price={product.price}
                images={product.images}
                rating={{ 
                  value: product.rating && product.rating.length > 0
                    ? product.rating.reduce((avg, r) => avg + r.value, 0) / product.rating.length
                    : 0
                }}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/shop" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dyaleu8gi/image/upload/t_1024 x 576/v1743446837/anthony-lim-EZGPy_HOZWQ-unsplash_csrvno.jpg"
                alt="Sri Lankan Artisans"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-6">
              SiyoMart was born from a passion for Sri Lanka’s rich heritage and the artisans who keep it alive. We bridge the gap between skilled local craftsmen and a global audience that cherishes authenticity. Every handmade piece carries a story—a story of tradition, culture, and the artisans who pour their hearts into their work. By choosing SiyoMart, you are not just buying a product; you are preserving heritage and empowering communities.
               </p>
              <p className="text-gray-700 mb-6">
                Each product tells a story of cultural heritage, passed down through generations and crafted with meticulous attention to detail.
              </p>
              <Link href="/about" className="btn-primary">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Create an account today to start shopping or selling on SiyoMart and be part of our growing community of artisans and customers.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/login" className="bg-white text-amber-600 border-2 border-amber-600 font-medium py-2 px-6 rounded-md transition duration-300 hover:bg-amber-50">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// The testimonials const remains unchanged
const testimonials = [
  {
    name: "Sarah Johnson",
    location: "United States",
    text: "The handcrafted wooden elephant I purchased is absolutely stunning. The attention to detail is remarkable, and it arrived beautifully packaged with a handwritten note. Truly special!"
  },
  {
    name: "David Chen",
    location: "Canada",
    text: "I've ordered Sri Lankan spices multiple times, and they're always fresh and aromatic. The customer service is excellent, and shipping is faster than I expected for international delivery."
  },
  {
    name: "Emma Williams",
    location: "United Kingdom",
    text: "The handwoven textiles are gorgeous and unique. I appreciate that each product comes with information about the artisan who made it. It makes the purchase feel more meaningful."
  }
];
