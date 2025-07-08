import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCategories } from '@/lib/services/categoryService'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const categories = await getCategories();
    const category = categories.find(cat => cat.slug === params.slug);
    
    if (!category) {
      return {
        title: 'Category Not Found | SiyoMart',
      };
    }
    
    return {
      title: `${category.name} | SiyoMart`,
      description: `Explore our collection of ${category.name.toLowerCase()} on SiyoMart.`,
    };
  } catch (error) {
    console.error('Error fetching category for metadata:', error);
    return {
      title: 'Shop Categories | SiyoMart',
    };
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Redirect to shop page with category filter
  redirect(`/shop?category=${params.slug}`);
}
