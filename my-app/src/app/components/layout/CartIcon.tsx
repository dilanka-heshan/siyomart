'use client'

import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/providers/CartProvider'
import { useSession } from 'next-auth/react'

export default function CartIcon() {
  const { cart, showLoginPrompt } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  
  const handleClick = () => {
    if (session) {
      router.push('/cart')
    } else {
      showLoginPrompt()
    }
  }
  
  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-gray-700 hover:text-amber-600"
      aria-label="Cart"
    >
      <ShoppingCart className="h-6 w-6" />
      {session && cart && cart.itemCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs text-white">
          {cart.itemCount > 99 ? '99+' : cart.itemCount}
        </span>
      )}
    </button>
  )
}
