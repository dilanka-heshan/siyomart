'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Heart, Share2 } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Loader } from '@/app/components/ui/Loader'
import { LoginPrompt } from '@/app/components/auth/LoginPrompt'
import { useCart } from '@/app/providers/CartProvider'
import { useWishlist } from '@/app/providers/WishlistProvider'

// Product interface
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  // add other fields as needed
}

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const cart = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  // Debug log to check if cart provider is initialized correctly
  useEffect(() => {
    console.log("Cart provider initialized:", !!cart);
    console.log("AddToCart function available:", !!cart.addToCart);
  }, [cart]);
  
  // Check if the product is in the wishlist
  const productInWishlist = isInWishlist(product._id);
  
  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(product.stock, value));
    setQuantity(newQuantity);
  };
  
  // Add to cart handler
  const handleAddToCart = async () => {
    console.log('Add to Cart button clicked'); // Debug log
    if (!cart.addToCart) {
      console.error('Cart functionality is not available'); // Debug log
      toast.error('Cart functionality is not available');
      return;
    }

    if (!session) {
      console.log('User not logged in, showing login prompt'); // Debug log
      setShowLoginPrompt(true);
      return;
    }

    if (product.stock <= 0) {
      console.error('Product is out of stock'); // Debug log
      toast.error('This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      console.log('Calling cart.addToCart with productId:', product._id, 'quantity:', quantity); // Debug log
      const success = await cart.addToCart(product._id, quantity);
      if (success) {
        console.log('Add to Cart successful'); // Debug log
        window.dispatchEvent(new CustomEvent('cart-updated'));
        toast.success(`Added ${product.name} to your cart`);
      } else {
        console.error('Add to Cart failed'); // Debug log
        toast.error("Couldn't add item to cart. Please try again.");
      }
    } catch (error) {
      console.error('Add to Cart Exception:', error); // Debug log
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Buy now handler
  const handleBuyNow = async () => {
    console.log('Buy Now button clicked'); // Debug log
    if (!cart.addToCart) {
      console.error('Cart functionality is not available'); // Debug log
      toast.error('Cart functionality is not available');
      return;
    }

    if (!session) {
      console.log('User not logged in, showing login prompt'); // Debug log
      setShowLoginPrompt(true);
      return;
    }

    if (product.stock <= 0) {
      console.error('Product is out of stock'); // Debug log
      toast.error('This product is out of stock');
      return;
    }

    setIsBuyingNow(true);
    try {
      console.log('Calling cart.addToCart with productId:', product._id, 'quantity:', quantity); // Debug log
      const success = await cart.addToCart(product._id, quantity);
      if (success) {
        console.log('Buy Now successful'); // Debug log
        window.dispatchEvent(new CustomEvent('cart-updated'));
        toast.success('Proceeding to checkout...');
        router.push('/checkout'); // Redirect to checkout
      } else {
        console.error('Buy Now failed'); // Debug log
        toast.error('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Buy Now Exception:', error); // Debug log
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsBuyingNow(false);
    }
  };
  
  // Toggle wishlist handler
  const handleToggleWishlist = async () => {
    if (!session) {
      setShowLoginPrompt(true);
      return;
    }
    
    try {
      let success;
      
      if (productInWishlist) {
        success = await removeFromWishlist(product._id);
      } else {
        success = await addToWishlist(product._id);
      }
      
      if (success) {
        toast.success(productInWishlist 
          ? 'Removed from wishlist' 
          : 'Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };
  
  // Share product handler
  const handleShareProduct = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on SiyoMart!`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Login prompt modal */}
      <LoginPrompt 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)}
        title="Login Required"
        description="Please login to add items to your cart"
      />
      
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
        <span className="text-sm text-gray-500">
          {product.stock} available
        </span>
      </div>
      
      {/* Add to Cart Button */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button 
          onClick={() => {
            console.log("Button clicked directly"); // Debug log
            handleAddToCart();
          }}
          disabled={isAddingToCart || isBuyingNow || product.stock <= 0}
          variant="outline" 
          className="flex-1"
        >
          {isAddingToCart ? <Loader className="h-5 w-5" /> : 'Add to Cart'}
        </Button>
        
        <Button 
          onClick={handleBuyNow}
          disabled={isAddingToCart || isBuyingNow || product.stock <= 0}
          className="flex-1"
        >
          {isBuyingNow ? <Loader className="h-5 w-5" /> : 'Buy Now'}
        </Button>
      </div>
      
      {/* Wishlist and Share */}
      <div className="flex space-x-4">
        <button
          onClick={handleToggleWishlist}
          className="flex items-center text-sm text-gray-600 hover:text-amber-600"
        >
          <Heart 
            size={18} 
            className={`mr-1 ${productInWishlist ? 'fill-amber-600 text-amber-600' : ''}`} 
          />
          {productInWishlist ? 'Saved' : 'Add to Wishlist'}
        </button>
        
        <button
          onClick={handleShareProduct}
          className="flex items-center text-sm text-gray-600 hover:text-amber-600"
        >
          <Share2 size={18} className="mr-1" />
          Share
        </button>
      </div>
    </div>
  );
}
