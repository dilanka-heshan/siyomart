import mongoose, { Schema, Document } from 'mongoose';

export interface StoryDocument extends Document {
  productId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  artisanName?: string;
  region?: string;
  traditionalSignificance?: string;
  craftProcess?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    artisanName: {
      type: String,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    traditionalSignificance: {
      type: String,
    },
    craftProcess: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Story || mongoose.model<StoryDocument>('Story', StorySchema);
