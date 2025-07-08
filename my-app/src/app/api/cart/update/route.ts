import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import Cart from '@/lib/db/models/Cart';
import Product from '@/lib/db/models/Product';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { itemId, quantity } = await request.json();
    
    if (!itemId || !quantity) {
      return NextResponse.json(
        { message: 'Item ID and quantity are required' },
        { status: 400 }
      );
    }
    
    if (quantity < 1) {
      return NextResponse.json(
        { message: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find user's cart
    const cart = await Cart.findOne({ userId: session.user.id });
    
    if (!cart) {
      return NextResponse.json(
        { message: 'Cart not found' },
        { status: 404 }
      );
    }
    
    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item: any) => item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { message: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    // Check product stock
    const product = await Product.findById(cart.items[itemIndex].productId);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (product.stock < quantity) {
      return NextResponse.json(
        { message: 'Not enough stock available' },
        { status: 400 }
      );
    }
    
    // Update item quantity and subtotal
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].subtotal = product.price * quantity;
    
    // Update cart totals
    cart.itemCount = cart.items.reduce((count: number, item: any) => count + item.quantity, 0);
    cart.cartTotal = cart.items.reduce((total: number, item: any) => total + item.subtotal, 0);
    cart.lastUpdated = new Date();
    
    // Save cart
    await cart.save();
    
    return NextResponse.json({ 
      message: 'Cart updated successfully',
      cart
    });
    
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { message: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
