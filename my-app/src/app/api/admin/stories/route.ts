import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/db/connect';
import Story from '@/lib/db/models/Story';
import Product from '@/lib/db/models/Product';

// GET all stories (admin only)
export async function GET(request: Request) {
  try {
    const token = await getToken({ req: request as any });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const stories = await Story.find().populate('productId', 'name images').lean();
    
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

// POST create a new story (admin only)
export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request as any });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { productId, title, description, artisanName, region, traditionalSignificance, craftProcess, imageUrl } = data;
    
    if (!productId || !title || !description) {
      return NextResponse.json(
        { error: 'Product ID, title and description are required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if story already exists for this product
    const existingStory = await Story.findOne({ productId });
    if (existingStory) {
      return NextResponse.json(
        { error: 'A story already exists for this product' },
        { status: 400 }
      );
    }
    
    const story = new Story({
      productId,
      title,
      description,
      artisanName,
      region,
      traditionalSignificance,
      craftProcess,
      imageUrl,
    });
    
    await story.save();
    
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
}
