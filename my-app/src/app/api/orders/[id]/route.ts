import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';

// GET order by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const orderId = params.id;
    
    await connectDB();
    
    const order = await Order.findById(orderId)
      .populate('products.productId', 'name images price');
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    // Check if the user is the owner of the order or an admin
    if (order.userId.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// UPDATE order status (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const orderId = params.id;
    const { status } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
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
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: 'Failed to update order' },
      { status: 500 }
    );
  }
}
