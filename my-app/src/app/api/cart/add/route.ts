import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import Cart from '@/lib/db/models/Cart';
import Product from '@/lib/db/models/Product';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { productId, quantity = 1, selectedOptions = {} } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: 'Invalid Product ID' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    try {
      const product = await Product.findById(productId);
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
      // Calculate price and subtotal
      const price = product.price;
      const subtotal = price * quantity;
      
      // Find or create user's cart
      let cart = await Cart.findOne({ userId: session.user.id });
      
      if (!cart) {
        // Create new cart if it doesn't exist
        cart = new Cart({
          userId: session.user.id,
          items: [],
          cartTotal: 0,
          itemCount: 0
        });
      }
      
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (item: any) => item.productId.toString() === productId
      );
      
      if (existingItemIndex > -1) {
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
  
        if (newQuantity > product.stock) {
          return NextResponse.json(
            { message: 'Cannot add more of this item - stock limit reached' },
            { status: 400 }
          );
        }
  
        cart.items[existingItemIndex].quantity = newQuantity;
        cart.items[existingItemIndex].subtotal = price * newQuantity;
      } else {
        cart.items.push({
          productId,
          quantity,
          price,
          subtotal,
          selectedOptions,
          addedAt: new Date(),
        });
      }
  
      // Update cart totals
      cart.itemCount = cart.items.reduce((count: number, item: any) => count + item.quantity, 0);
      cart.cartTotal = cart.items.reduce((total: number, item: any) => total + item.subtotal, 0);
      cart.lastUpdated = new Date();
  
      await cart.save();
  
      return NextResponse.json({ message: 'Item added to cart successfully', cart });
      
    } catch (error) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { message: 'Failed to fetch product' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { message: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
