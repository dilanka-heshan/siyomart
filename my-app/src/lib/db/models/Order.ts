import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  subTotal: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'Sri Lanka'
  }
});

const receiverDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  }
});

const orderSummarySchema = new mongoose.Schema({
  subtotal: {
    type: Number,
    required: true
  },
  shipping_charges: {
    type: Number,
    required: true
  },
  coupon_discount: {
    type: Number,
    default: 0
  },
  final_total: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Stripe', 'PayPal', 'Cash on Delivery', 'Bank Transfer'],
    required: true
  },
  transactionId: {
    type: String
  },
  shipping_address: shippingAddressSchema,
  receiver_details: receiverDetailsSchema,
  shipping_method: {
    type: String,
    enum: ['Standard', 'Express', 'Priority'],
    default: 'Standard'
  },
  shipping_charges: {
    type: Number,
    required: true
  },
  applied_coupon: {
    type: couponSchema,
    default: null
  },
  customer_message: {
    type: String,
    default: ''
  },
  order_summary: {
    type: orderSummarySchema,
    required: true
  }
}, {
  timestamps: true
});

const Order = mongoose.models?.Order || mongoose.model('Order', orderSchema);

export default Order;
