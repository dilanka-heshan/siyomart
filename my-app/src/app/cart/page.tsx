'use client'

import { useEffect } from 'react'
import { useCart } from '@/app/providers/CartProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Loader } from '@/app/components/ui/Loader'
import { formatPrice } from '@/lib/utils'
import CartItemCard from './_components/CartItemCard'
import CartSummary from './_components/CartSummary'
import EmptyCart from './_components/EmptyCart'

export default function CartPage() {
  const { cart, loading, clearCart } = useCart()
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/cart')
    }
  }, [status, router])
  
  // Handle loading and authentication states
  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-8 flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 text-amber-600" />
      </div>
    )
  }
  
  if (status === 'unauthenticated') {
    return null // Will redirect in the useEffect
  }
  
  // Handle empty cart
  if (!cart || cart.items.length === 0) {
    return <EmptyCart />
  }
  
  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Your Shopping Cart</h1>
        <Button 
          variant="ghost" 
          onClick={() => clearCart()}
          className="text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Clear Cart
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3 space-y-4">
          {cart.items.map((item) => (
            <CartItemCard key={item._id} item={item} />
          ))}
          
          <div className="mt-6">
            <Link 
              href="/shop" 
              className="flex items-center text-amber-600 hover:text-amber-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
