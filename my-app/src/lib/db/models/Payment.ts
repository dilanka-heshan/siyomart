import mongoose from 'mongoose';

const paymentDetailsSchema = new mongoose.Schema({
  cardType: {
    type: String
  },
  lastFourDigits: {
    type: String
  },
  expiryMonth: {
    type: String
  },
  expiryYear: {
    type: String
  }
});

const billingAddressSchema = new mongoose.Schema({
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

const metadataSchema = new mongoose.Schema({
  customerIp: {
    type: String
  },
  deviceType: {
    type: String
  },
  gatewayResponse: {
    type: String
  },
  refundStatus: {
    type: String,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  }
});

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Stripe', 'PayPal', 'Cash on Delivery', 'Bank Transfer'],
    required: true
  },
  paymentDetails: {
    type: paymentDetailsSchema,
    default: {}
  },
  billingAddress: {
    type: billingAddressSchema,
    required: true
  },
  metadata: {
    type: metadataSchema,
    default: {}
  }
}, {
  timestamps: true
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;
