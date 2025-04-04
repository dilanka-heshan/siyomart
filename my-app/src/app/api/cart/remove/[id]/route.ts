import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/connect';
import Cart from '@/lib/db/models/Cart';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const itemId = params.id;

    if (!itemId) {
      return NextResponse.json(
        { message: 'Item ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    console.log('Finding cart for user:', session.user.id); // Debug log
    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      return NextResponse.json(
        { message: 'Cart not found' },
        { status: 404 }
      );
    }

    console.log('Removing item from cart:', itemId); // Debug log
    const itemIndex = cart.items.findIndex(
      (item: any) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { message: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // Update cart totals
    cart.itemCount = cart.items.reduce((count: number, item: any) => count + item.quantity, 0);
    cart.cartTotal = cart.items.reduce((total: number, item: any) => total + item.subtotal, 0);
    cart.lastUpdated = new Date();

    console.log('Updated item count after removal:', cart.itemCount); // Debug log
    console.log('Updated cart total after removal:', cart.cartTotal); // Debug log

    await cart.save();

    console.log('Item removed successfully, updated cart:', cart); // Debug log
    return NextResponse.json({ message: 'Item removed from cart successfully', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error); // Debug log
    return NextResponse.json(
      { message: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
