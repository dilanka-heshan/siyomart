import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    // Get all orders, sorted by creation date (newest first)
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// This endpoint allows admins to create orders on behalf of users
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const orderData = await request.json();
    
    // Validate required fields
    if (!orderData.userId || !orderData.products || orderData.products.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Create the order
    const order = new Order(orderData);
    await order.save();
    
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
