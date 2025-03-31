import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import Cart from '@/lib/db/models/Cart';
import Product from '@/lib/db/models/Product';

// GET all orders (admin/seller) or user orders
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    // Parse query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    // Check if the user is requesting their own orders or if they're admin
    if (userId && userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    // Filter orders by user ID if specified, otherwise return user's own orders
    const query = userId ? { userId } : { userId: session.user.id };
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name images');
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create a new order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const {
      products,
      shipping_address,
      receiver_details,
      shipping_method,
      shipping_charges,
      paymentMethod,
      applied_coupon,
      customer_message,
      order_summary,
      transactionId
    } = await request.json();
    
    // Validate required fields
    if (!products || !shipping_address || !receiver_details || !order_summary) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Calculate total price from products
    const totalPrice = order_summary.final_total;
    
    // Create the order
    const order = new Order({
      userId: session.user.id,
      products,
      totalPrice,
      status: 'Pending',
      paymentMethod,
      transactionId,
      shipping_address,
      receiver_details,
      shipping_method,
      shipping_charges,
      applied_coupon,
      customer_message,
      order_summary
    });
    
    await order.save();
    
    // Clear the user's cart after successful order
    await Cart.findOneAndDelete({ userId: session.user.id });
    
    // Update product stock
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    return NextResponse.json({ 
      message: 'Order created successfully',
      orderId: order._id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    );
  }
}
