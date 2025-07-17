import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import Payment from '@/lib/db/models/Payment';
import Order from '@/lib/db/models/Order';
import Stripe from 'stripe';

// Initialize Stripe only when needed to avoid build-time environment variable issues
function getStripeInstance() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  
  return new Stripe(stripeSecretKey, {
    apiVersion: '2025-02-24.acacia'
  });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const {
      orderId,
      paymentMethod,
      paymentDetails,
      billingAddress,
      amount
    } = await request.json();
    
    if (!orderId || !paymentMethod || !amount) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if order exists
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Simple payment processing mock
    // In a real implementation, this would integrate with Stripe or another payment processor
    let transactionId = '';
    let paymentStatus = 'Pending';
    let paymentResponse = 'Payment processing';
    
    if (paymentMethod === 'Stripe') {
      // Create a payment intent with Stripe
      try {
        const stripe = getStripeInstance();
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Stripe expects amount in cents
          currency: 'usd',
          description: `Order ${orderId}`,
          metadata: {
            orderId: orderId.toString(),
            userId: session.user.id
          }
        });
        
        transactionId = paymentIntent.id;
        paymentStatus = 'Pending';
        paymentResponse = 'Payment intent created';
        
      } catch (stripeError: any) {
        console.error('Stripe error:', stripeError);
        return NextResponse.json(
          { message: `Payment processing failed: ${stripeError.message}` },
          { status: 500 }
        );
      }
    } else if (paymentMethod === 'Cash on Delivery') {
      // For Cash on Delivery, just generate a random transaction ID
      transactionId = `COD_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      paymentStatus = 'Pending';
      paymentResponse = 'Cash on Delivery order confirmed';
    }
    
    // Create payment record
    const payment = new Payment({
      userId: session.user.id,
      orderId,
      transactionId,
      amount,
      currency: 'USD',
      status: paymentStatus,
      paymentMethod,
      paymentDetails: paymentDetails || {},
      billingAddress: billingAddress || order.shipping_address,
      metadata: {
        customerIp: request.headers.get('x-forwarded-for') || 'unknown',
        deviceType: request.headers.get('user-agent') || 'unknown',
        gatewayResponse: paymentResponse
      }
    });
    
    await payment.save();
    
    // Update order with transaction ID
    order.transactionId = transactionId;
    await order.save();
    
    return NextResponse.json({
      message: 'Payment processed successfully',
      paymentId: payment._id,
      transactionId,
      status: paymentStatus
    });
    
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { message: `Failed to process payment: ${error.message}` },
      { status: 500 }
    );
  }
}
