import { useState } from 'react'
import toast from 'react-hot-toast'

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  subTotal: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ReceiverDetails {
  name: string;
  phone: string;
  email: string;
}

interface OrderSummary {
  subtotal: number;
  shipping_charges: number;
  coupon_discount: number;
  final_total: number;
}

interface OrderData {
  products: OrderItem[];
  shipping_address: ShippingAddress;
  receiver_details: ReceiverDetails;
  shipping_method: string;
  shipping_charges: number;
  paymentMethod: string;
  applied_coupon?: {
    code: string;
    discount: number;
    discountType: string;
  } | null;
  customer_message?: string;
  order_summary: OrderSummary;
}

interface PaymentData {
  orderId: string;
  amount: number;
  paymentMethod: string;
  billingAddress: ShippingAddress;
}

export function useOrders() {
  const [loading, setLoading] = useState(false)

  
  // Create a new order
  const createOrder = async (orderData: OrderData): Promise<string | null> => {
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
  }
  
  // Process payment for an order
  const processPayment = async (paymentData: PaymentData) => {
    try {
      setLoading(true)
      
      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to process payment')
      }
      
      const data = await res.json()
      return data
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  // Get a specific order by ID
  const getOrder = async (orderId: string) => {
    try {
      setLoading(true)
      
      const res = await fetch(`/api/orders/${orderId}`)
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to fetch order')
      }
      
      const data = await res.json()
      return data
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch order')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  // Get all orders for current user
  const getOrders = async () => {
    try {
      setLoading(true)
      
      const res = await fetch('/api/orders')
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to fetch orders')
      }
      
      const data = await res.json()
      return data
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch orders')
      return []
    } finally {
      setLoading(false)
    }
  }
  
  return {
    loading,
    createOrder,
    processPayment,
    getOrder,
    getOrders
  }
}
