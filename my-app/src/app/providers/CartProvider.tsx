'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface CartItem {
  _id: string
  productId: {
    _id: string
    name: string
    images: string[]
    price: number
    stock: number
  }
  quantity: number
  price: number
  subtotal: number
  selectedOptions?: Record<string, any>
  addedAt: string
}

interface Cart {
  _id: string
  userId: string
  items: CartItem[]
  cartTotal: number
  itemCount: number
  lastUpdated: string
  createdAt: string
}

interface CartContextType {
  cart: Cart | null
  loading: boolean
  addToCart: (productId: string, quantity: number, options?: Record<string, any>) => Promise<boolean>
  updateCartItem: (itemId: string, quantity: number) => Promise<boolean>
  removeCartItem: (itemId: string) => Promise<boolean>
  clearCart: () => Promise<boolean>
  showLoginPrompt: () => void
  fetchCart: () => Promise<void> // Add fetchCart to the context type
}

const CartContext = createContext<CartContextType>({
  cart: null,
  loading: false,
  addToCart: async () => false,
  updateCartItem: async () => false,
  removeCartItem: async () => false,
  clearCart: async () => false,
  showLoginPrompt: () => {},
  fetchCart: async () => {} // Add default implementation
})

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  
  // Fetch cart when session changes
  useEffect(() => {
    if (session) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [session])
  
  const fetchCart = async (forceRefresh = false) => {
    if (!session) {
      console.log('Skipping fetchCart: no session'); // Debug log
      return;
    }

    if (!forceRefresh && cart) {
      console.log('Skipping fetchCart: cart already exists and no forceRefresh'); // Debug log
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching cart data from API'); // Debug log
      const res = await fetch('/api/cart');

      if (!res.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await res.json();
      setCart(data); // Update cart state
      console.log('Cart data fetched successfully:', data); // Debug log
      console.log('Updated item count:', data.itemCount); // Debug log
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load your cart');
    } finally {
      setLoading(false);
    }
  };
  
  const addToCart = async (productId: string, quantity: number, options: Record<string, any> = {}) => {
    console.log('addToCart called with productId:', productId, 'quantity:', quantity, 'options:', options); // Debug log
    if (!session) {
      console.log('User not logged in, showing login prompt'); // Debug log
      showLoginPrompt();
      return false;
    }

    try {
      setLoading(true);
      console.log('Sending POST request to /api/cart/add'); // Debug log
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, selectedOptions: options }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Add to Cart API Error:', error); // Debug log
        toast.error(error.message || 'Failed to add item to cart');
        return false;
      }

      console.log('Add to Cart API call successful, refreshing cart'); // Debug log
      await fetchCart(true); // Force refresh the cart
      window.dispatchEvent(new CustomEvent('cart-updated'));
      toast.success('Item added to cart');
      return true;
    } catch (error) {
      console.error('Add to Cart Exception:', error); // Debug log
      toast.error('Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  }
  
  const updateCartItem = async (itemId: string, quantity: number) => {
    console.log('updateCartItem called with itemId:', itemId, 'quantity:', quantity); // Debug log
    if (!session) {
      showLoginPrompt();
      return false;
    }

    try {
      setLoading(true);
      console.log('Sending PUT request to /api/cart/update'); // Debug log
      const res = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Update Cart Item API Error:', error); // Debug log
        toast.error(error.message || 'Failed to update cart');
        return false;
      }

      console.log('Update Cart Item API call successful, refreshing cart'); // Debug log
      await fetchCart(true); // Force refresh the cart
      return true;
    } catch (error) {
      console.error('Update Cart Item Exception:', error); // Debug log
      toast.error('Failed to update cart');
      return false;
    } finally {
      setLoading(false);
    }
  }
  
  const removeCartItem = async (itemId: string) => {
    console.log('removeCartItem called with itemId:', itemId); // Debug log
    if (!session) {
      console.log('User not logged in, showing login prompt'); // Debug log
      showLoginPrompt();
      return false;
    }

    try {
      setLoading(true);
      console.log('Sending DELETE request to /api/cart/remove/:itemId'); // Debug log
      const res = await fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Remove Cart Item API Error:', error); // Debug log
        toast.error(error.message || 'Failed to remove item from cart');
        return false;
      }

      console.log('Remove Cart Item API call successful, refreshing cart'); // Debug log
      await fetchCart(true); // Force refresh the cart
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      console.error('Remove Cart Item Exception:', error); // Debug log
      toast.error('Failed to remove item from cart');
      return false;
    } finally {
      setLoading(false);
    }
  }
  
  const clearCart = async () => {
    if (!session) {
      showLoginPrompt()
      return false
    }
    
    try {
      setLoading(true);
      console.log('Sending DELETE request to clear cart'); // Debug log
      const res = await fetch('/api/cart', {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to clear cart');
      }

      console.log('Clear Cart API call successful, resetting cart state'); // Debug log
      setCart(null); // Reset cart state
      toast.success('Cart cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error); // Debug log
      toast.error('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  }
  
  const showLoginPrompt = () => {
    toast.custom((t) => (
      <div className="px-6 py-4 bg-white rounded shadow-lg">
        <p className="text-red-600">Please login to manage your cart</p>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            router.push('/login');
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    ), { duration: 4000 })
  }
  
  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    showLoginPrompt,
    fetchCart // Expose fetchCart to consumers
  }
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
