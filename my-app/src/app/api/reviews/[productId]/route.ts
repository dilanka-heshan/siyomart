import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/db/connect';
import Review from '@/lib/db/models/Review';
import Product from '@/lib/db/models/Product';

// GET /api/reviews/[productId] - Get reviews for a product
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB();
    
    const reviews = await Review.find({ productId: params.productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews/[productId] - Add a new review
export async function POST(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    // Verify authentication
    const token = await getToken({ req: request as any });
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { rating, comment, photos } = data;
    
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if product exists
    const product = await Product.findById(params.productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      productId: params.productId,
      userId: token.id,
    });
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }
    
    // Create new review
    const review = new Review({
      productId: params.productId,
      userId: token.id,
      rating,
      comment,
      photos: photos || [],
      verified_purchase: true, // In a real app, verify if the user purchased the product
      helpful_votes: 0,
    });
    
    await review.save();
    
    // Update product rating
    const allReviews = await Review.find({ productId: params.productId });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    await Product.findByIdAndUpdate(params.productId, {
      $set: { rating: averageRating },
      $push: { reviews: review._id }
    });
    
    // Return populated review
    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name')
      .lean();
    
    return NextResponse.json(populatedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}
