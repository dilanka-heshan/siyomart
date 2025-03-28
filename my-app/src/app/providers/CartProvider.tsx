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
}

const CartContext = createContext<CartContextType>({
  cart: null,
  loading: false,
  addToCart: async () => false,
  updateCartItem: async () => false,
  removeCartItem: async () => false,
  clearCart: async () => false,
  showLoginPrompt: () => {}
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
  
  const fetchCart = async () => {
    if (!session) return
    
    try {
      setLoading(true)
      const res = await fetch('/api/cart')
      
      if (!res.ok) {
        throw new Error('Failed to fetch cart')
      }
      
      const data = await res.json()
      setCart(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.error('Failed to load your cart')
    } finally {
      setLoading(false)
    }
  }
  
  const addToCart = async (productId: string, quantity: number, options: Record<string, any> = {}) => {
    if (!session) {
      showLoginPrompt()
      return false
    }
    
    try {
      setLoading(true)
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, selectedOptions: options })
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to add item to cart')
      }
      
      await fetchCart()
      return true
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item to cart')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!session) {
      showLoginPrompt()
      return false
    }
    
    try {
      setLoading(true)
      const res = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity })
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to update cart')
      }
      
      await fetchCart()
      return true
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  const removeCartItem = async (itemId: string) => {
    if (!session) {
      showLoginPrompt()
      return false
    }
    
    try {
      setLoading(true)
      const res = await fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to remove item from cart')
      }
      
      await fetchCart()
      return true
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  const clearCart = async () => {
    if (!session) {
      showLoginPrompt()
      return false
    }
    
    try {
      setLoading(true)
      const res = await fetch('/api/cart', {
        method: 'DELETE'
      })
      
      if (!res.ok) {
        throw new Error('Failed to clear cart')
      }
      
      setCart(null)
      return true
    } catch (error) {
      toast.error('Failed to clear cart')
      return false
    } finally {
      setLoading(false)
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
    showLoginPrompt
  }
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
