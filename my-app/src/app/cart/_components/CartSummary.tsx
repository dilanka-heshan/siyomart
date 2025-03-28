'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/Button'
import { Loader } from '@/app/components/ui/Loader'
import { formatPrice } from '@/lib/utils'

interface CartSummaryProps {
  cart: {
    cartTotal: number
    itemCount: number
  }
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()
  
  // Calculate shipping, tax and total
  const shipping = 350; // Fixed shipping fee
  const taxRate = 0.08; // 8% tax rate
  const taxAmount = cart.cartTotal * taxRate;
  const orderTotal = cart.cartTotal + shipping + taxAmount;
  
  const handleCheckout = async () => {
    setIsCheckingOut(true)
    
    try {
      // In a real app, this would initialize the checkout process
      // For now, just redirect to a checkout page
      router.push('/checkout');
    } catch (error) {
      console.error('Error starting checkout:', error)
    } finally {
      setIsCheckingOut(false)
    }
  }
  
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
          <span>{formatPrice(cart.cartTotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>
        
        <div className="border-t border-gray-300 pt-3 mt-3">
          <div className="flex justify-between font-bold">
            <span>Order Total</span>
            <span>{formatPrice(orderTotal)}</span>
          </div>
        </div>
      </div>
      
      <Button
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className="w-full mt-6"
      >
        {isCheckingOut ? <Loader className="h-5 w-5" /> : 'Proceed to Checkout'}
      </Button>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>* Shipping costs calculated for delivery within Sri Lanka.</p>
        <p>* Tax rate of 8% applied to subtotal.</p>
        <p>* Delivery times: 3-5 days (Colombo), 5-7 days (other areas).</p>
      </div>
    </div>
  )
}
