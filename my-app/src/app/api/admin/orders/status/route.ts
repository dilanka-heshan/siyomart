import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json(
        { message: 'Order ID and status are required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { message: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
