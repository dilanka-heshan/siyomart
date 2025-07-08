import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Story from '@/lib/db/models/Story';

// GET /api/stories/[productId] - Get story for a specific product
export async function GET(
  _request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB();
    
    const story = await Story.findOne({ productId: params.productId }).lean();
    
    if (!story) {
      return NextResponse.json(
        { message: 'No story found for this product' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching product story:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product story' },
      { status: 500 }
    );
  }
}
