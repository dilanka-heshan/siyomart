import mongoose, { Schema } from 'mongoose'

// Define the contact inquiry schema
const contactInquirySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  inquiryType: {
    type: String,
    required: [true, 'Inquiry type is required'],
    enum: ['general', 'product', 'seller', 'order', 'shipping', 'other'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // If this inquiry was responded to
  response: {
    text: String,
    date: Date,
    respondedBy: String,
  },
  // Track if the user has viewed the response
  responseViewed: {
    type: Boolean,
    default: false,
  }
})

// Prevent multiple models initialization
export const ContactInquiry = mongoose.models?.ContactInquiry || mongoose.model('ContactInquiry', contactInquirySchema)
