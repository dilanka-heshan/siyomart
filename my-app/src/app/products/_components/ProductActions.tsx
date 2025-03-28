"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';



interface ProductActionsProps {
  product: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  
  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(product.stock, value));
    setQuantity(newQuantity);
  };
  
  // Add to cart handler
  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Please log in to add items to your cart");
      router.push('/login');
      return;
    }
    
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      // Add to cart API call would go here
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to add to cart');
      }
      
      toast.success(`Added ${product.name} to your cart`);
      // Refresh router to update cart count in navbar
      router.refresh();
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Buy now handler
  const handleBuyNow = async () => {
    if (!session) {
      toast.error("Please log in to proceed");
      router.push('/login');
      return;
    }
    
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    
    try {
      // Add to cart first
      await handleAddToCart();
      // Then redirect to checkout
      router.push('/cart?checkout=true');
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  // Toggle wishlist handler
  const handleToggleWishlist = async () => {
    if (!session) {
      toast.error("Please log in to add items to your wishlist");
      router.push('/login');
      return;
    }
    
    try {
      // Toggle wishlist API call
      const endpoint = isInWishlist 
        ? `/api/wishlist/remove/${product._id}` 
        : '/api/wishlist/add';
        
      const method = isInWishlist ? 'DELETE' : 'POST';
      const body = isInWishlist ? undefined : JSON.stringify({ productId: product._id });
      
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      
      if (!res.ok) {
        throw new Error('Failed to update wishlist');
      }
      
      setIsInWishlist(!isInWishlist);
      toast.success(isInWishlist 
        ? `Removed ${product.name} from your wishlist`
        : `Added ${product.name} to your wishlist`
      );
    } catch (error) {
      toast.error("Failed to update wishlist. Please try again.");
    }
  };
  
  // Share product handler
  const handleShareProduct = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on SiyoMart!`,
          url: url
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-3">
        <span className="text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="px-3 py-1 border-r border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            min="1"
            max={product.stock}
            className="w-12 text-center border-none focus:ring-0 p-0"
          />
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
            className="px-3 py-1 border-l border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock <= 0}
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </button>
        
        <button
          onClick={handleBuyNow}
          disabled={product.stock <= 0}
          className="flex-1 bg-amber-800 hover:bg-amber-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>
      
      {/* Wishlist and Share */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={handleToggleWishlist}
          className="flex items-center gap-1.5 text-gray-700 hover:text-amber-600"
        >
          {isInWishlist ? (
            <SolidHeartIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span>Save to Wishlist</span>
        </button>
        
        <button
          onClick={handleShareProduct}
          className="flex items-center gap-1.5 text-gray-700 hover:text-amber-600"
        >
          <ShareIcon className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
