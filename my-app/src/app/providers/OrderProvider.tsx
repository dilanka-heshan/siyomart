'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface OrderContextType {
  loading: boolean;
  createOrder: (orderData: any) => Promise<string | null>;
  getOrder: (orderId: string) => Promise<any>;
  getAllOrders: () => Promise<any[]>;
}

// Create a default context value to prevent null checks
const defaultContextValue: OrderContextType = {
  loading: false,
  createOrder: async () => null,
  getOrder: async () => null,
  getAllOrders: async () => [],
};

const OrderContext = createContext<OrderContextType>(defaultContextValue);

export function useOrders() {
  const context = useContext(OrderContext);
  // Return the context even if null - components will handle this gracefully
  return context;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false)
  const { data: session } = useSession()
  const router = useRouter()
  
  // Create a new order
  const createOrder = useCallback(async (orderData: any): Promise<string | null> => {
    if (!session) {
      router.push('/login?callbackUrl=/checkout')
      return null
    }
    
    try {
      setLoading(true)
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to create order')
      }
      
      const data = await res.json()
      return data.orderId
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order')
      return null
    } finally {
      setLoading(false)
    }
  }, [session, router])
  
  // Get a specific order
  const getOrder = useCallback(async (orderId: string) => {
    if (!session) {
      router.push('/login')
      return null
    }
    
    try {
      setLoading(true)
      const res = await fetch(`/api/orders/${orderId}`)
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to fetch order')
      }
      
      return await res.json()
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch order')
      return null
    } finally {
      setLoading(false)
    }
  }, [session, router])
  
  // Get all orders for the current user
  const getAllOrders = useCallback(async () => {
    if (!session) {
      router.push('/login')
      return []
    }
    
    try {
      setLoading(true)
      const res = await fetch('/api/orders')
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to fetch orders')
      }
      
      return await res.json()
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      return []
    } finally {
      setLoading(false)
    }
  }, [session, router])
  
  const value = {
    loading,
    createOrder,
    getOrder,
    getAllOrders
  }
  
  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}
