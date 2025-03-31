import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductImageGallery from '@/app/products/_components/ProductImageGallery';
import ProductInfo from '@/app/products/_components/ProductInfo';
import ProductActions from '@/app/products/_components/ProductActions';
import ProductTabs from '@/app/products/_components/ProductTabs';
import ProductStory from '@/app/products/_components/ProductStory'; // Add this import
import RelatedProducts from '@/app/products/_components/RelatedProducts';
import RecentlyViewed from '@/app/products/_components/RecentlyViewed';
import ShippingInfo from '@/app/products/_components/ShippingInfo';
import SellerInfo from '@/app/products/_components/SellerInfo';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { getProductById } from '@/lib/services/productService';
import ErrorFallback from '@/components/ui/ErrorDisplay';

export const revalidate = 3600; // Refresh data every hour

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const product = await getProductById(params.id);
  
  if (!product) {
    return {
      title: 'Product Not Found | SiyoMart',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} | SiyoMart`,
    description: product.description?.substring(0, 160) || "Explore our latest products.",
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160),
      images: product.images?.length
        ? product.images.map((img: string) => ({ url: img }))
        : [{ url: "/fallback-image.jpg" }], // Ensure fallback image exists
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id);
    
    if (!product || !product._id) {
      return notFound();
    }

    const safeProduct = {
      _id: product._id,
      name: product.name || "Unnamed Product",
      description: product.description || "",
      price: product.price || 0,
      images: Array.isArray(product.images) ? product.images : [],
      stock: typeof product.stock === 'number' ? product.stock : 0,
      category: product.category || "Uncategorized",
      categoryId: product.categoryId || "",
      OperatorId: typeof product.OperatorId === 'string' ? product.OperatorId : "Unknown Seller",
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { name: 'Home', href: '/' },
            { name: 'Products', href: '/shop' },
            { name: safeProduct.category || 'Category', href: `/shop?category=${safeProduct.categoryId || ''}` },
            { name: safeProduct.name, href: '#' },
          ]}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ProductImageGallery images={safeProduct.images} productName={safeProduct.name} />
          <div className="space-y-6">
            <ProductInfo product={safeProduct} />
            <ProductActions product={safeProduct} />
            <ShippingInfo />
            <SellerInfo seller={safeProduct.OperatorId} />
          </div>
        </div>

        <ProductStory productId={safeProduct._id} />

        <ProductTabs product={safeProduct} />
        <RelatedProducts categoryId={safeProduct.categoryId} currentProductId={safeProduct._id} />
        <RecentlyViewed currentProductId={safeProduct._id} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering product page:", error);
    return <ErrorFallback error={error} />;
  }
}
