import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import Wishlist from '@/lib/db/models/Wishlist';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const productId = params.id;
    
    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Update wishlist by removing the product
    const result = await Wishlist.updateOne(
      { userId: session.user.id },
      { $pull: { products: productId } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Wishlist not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Product removed from wishlist',
      productId
    });
    
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { message: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
