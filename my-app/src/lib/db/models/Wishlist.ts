import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Wishlist document
export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only have one wishlist document
WishlistSchema.index({ userId: 1 }, { unique: true });

// Check if the model is already defined to prevent mongoose overwrite model error
const Wishlist = mongoose.models?.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;
