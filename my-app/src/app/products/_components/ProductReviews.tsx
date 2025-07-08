"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { submitProductReview } from '@/lib/services/productService';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
  helpful_votes: number;
  verified_purchase: boolean;
}

interface ProductReviewsProps {
  productId: string;
  initialReviews: Review[];
}

export default function ProductReviews({ productId, initialReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files).slice(0, 3)); // Limit to 3 images
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Please log in to submit a review");
      router.push('/login');
      return;
    }
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you'd upload photos first and get URLs
      // For this example, we'll just simulate the API call
      const photoUrls = photos.length > 0 
        ? Array(photos.length).fill('/images/review-placeholder.jpg')
        : [];

      const reviewData = {
        rating,
        comment,
        photos: photoUrls,
      };
      
      await submitProductReview(productId, reviewData);
      
      // In a real implementation, the response would include the full review object
      // Here we're creating a dummy review object
      const newReview = {
        _id: Date.now().toString(),
        userId: {
          _id: session.user?.id || '',
          name: session.user?.name || 'Anonymous',
        },
        rating,
        comment,
        photos: photoUrls,
        createdAt: new Date().toISOString(),
        helpful_votes: 0,
        verified_purchase: true,
      };
      
      setReviews(prevReviews => [newReview, ...prevReviews]);
      setShowReviewForm(false);
      setRating(0);
      setComment('');
      setPhotos([]);
      toast.success("Review submitted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  };
  
  const ratingCounts = () => {
    const counts = [0, 0, 0, 0, 0]; // 5 stars to 1 star
    reviews.forEach(review => {
      counts[5 - review.rating]++;
    });
    return counts;
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleHelpfulClick = async (reviewId: string) => {
    if (!session) {
      toast.error("Please log in to mark reviews as helpful");
      return;
    }
    
    try {
      // In a real implementation, you'd make an API call here
      // For now, we'll just update the local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review._id === reviewId 
            ? { ...review, helpful_votes: review.helpful_votes + 1 }
            : review
        )
      );
      toast.success("Thanks for your feedback!");
    } catch (error) {
      toast.error("Could not process your request");
    }
  };
  
  return (
    <div>
      {/* Review Summary */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-5xl font-bold text-amber-600 mb-2">
              {calculateAverageRating().toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <StarIcon 
                  key={i}
                  className={`h-5 w-5 ${calculateAverageRating() >= i ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingCounts()[5 - star];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{star} stars</div>
                  <div className="flex-1 mx-3 h-2 bg-gray-200 rounded">
                    <div 
                      className="h-2 bg-yellow-400 rounded"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-sm text-gray-600">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Write a Review Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          {showReviewForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>
      
      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Share Your Experience</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    {star <= rating ? (
                      <StarIcon className="h-8 w-8 text-yellow-400" />
                    ) : (
                      <StarOutline className="h-8 w-8 text-gray-400 hover:text-yellow-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Review
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Share your thoughts about this product..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Photos (optional)
              </label>
              <input
                type="file"
                onChange={handlePhotoChange}
                multiple
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-amber-50 file:text-amber-700
                  hover:file:bg-amber-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can upload up to 3 images (max 5MB each)
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="font-medium">{review.userId.name}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    {formatDate(review.createdAt)}
                    {review.verified_purchase && (
                      <span className="ml-2 text-green-600">✓ Verified Purchase</span>
                    )}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.comment}</p>
              
              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.photos.map((photo, index) => (
                    <div key={index} className="relative w-16 h-16">
                      <Image
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => handleHelpfulClick(review._id)}
                className="text-sm text-gray-500 hover:text-amber-600"
              >
                Helpful ({review.helpful_votes})
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </div>
  );
}
