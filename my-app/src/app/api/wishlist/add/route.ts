import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import Wishlist from '@/lib/db/models/Wishlist';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find user's wishlist or create a new one
    let wishlist = await Wishlist.findOne({ userId: session.user.id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ 
        userId: session.user.id,
        products: [productId]
      });
    } else {
      // Check if product already exists in wishlist
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }
    
    await wishlist.save();
    
    return NextResponse.json({ 
      message: 'Product added to wishlist',
      productId
    });
    
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { message: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}
