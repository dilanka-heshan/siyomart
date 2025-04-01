import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/connect';
import Wishlist from '@/lib/db/models/Wishlist';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    // Get user's wishlist with populated product details
    let wishlist = await Wishlist.findOne({ userId: session.user.id })
      .populate('products', 'name images price stock slug category');
    
    // If no wishlist exists yet, create an empty one
    if (!wishlist) {
      return NextResponse.json({ products: [] });
    }
    
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { message: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}
