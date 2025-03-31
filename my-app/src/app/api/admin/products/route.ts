import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import Story from '@/lib/db/models/Story';

// GET /api/admin/products - Get products for admin (with option to filter those without stories)
export async function GET(request: Request) {
  try {
    const token = await getToken({ req: request as any });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const withoutStories = searchParams.get('withoutStories') === 'true';
    
    await connectDB();
    
    let products;
    
    if (withoutStories) {
      // Find all product IDs that already have stories
      const productsWithStories = await Story.distinct('productId');
      
      // Find products that don't have stories
      products = await Product.find({
        _id: { $nin: productsWithStories }
      }).select('name images').lean();
    } else {
      products = await Product.find().select('name images').lean();
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
