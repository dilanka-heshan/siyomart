import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import Cart from '@/lib/db/models/Cart';

// GET current user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const cart = await Cart.findOne({ userId: session.user.id })
      .populate('items.productId', 'name images stock price');
    
    if (!cart) {
      // Return empty cart structure if no cart exists
      return NextResponse.json({ 
        items: [], 
        cartTotal: 0, 
        itemCount: 0 
      });
    }

    // Ensure itemCount is calculated correctly
    cart.itemCount = cart.items.reduce((count: number, item: any) => count + item.quantity, 0);

    console.log('Cart fetched successfully:', cart); // Debug log
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { message: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// DELETE (clear) current user's cart
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    await Cart.findOneAndDelete({ userId: session.user.id });
    
    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { message: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
