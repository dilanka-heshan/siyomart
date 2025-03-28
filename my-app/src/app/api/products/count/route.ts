import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Get category slug from query param
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Build query
    const query: any = { stock: { $gt: 0 } };
    if (category) {
      query.category = category;
    }
    
    // Count documents matching the query
    const count = await Product.countDocuments(query);
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting products:', error);
    return NextResponse.json(
      { error: 'Failed to count products' },
      { status: 500 }
    );
  }
}
