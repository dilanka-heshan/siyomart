'use client'

import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/providers/CartProvider'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function CartIcon() {
  const { cart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [itemCount, setItemCount] = useState(0)

  // Update item count whenever the cart changes
  useEffect(() => {
    if (cart) {
      console.log('Cart updated in CartIcon:', cart) // Debug log
      setItemCount(cart.itemCount || 0) // Ensure itemCount is always a number
    }
  }, [cart])

  const handleClick = () => {
    if (session) {
      router.push('/cart')
    } else {
      console.log('User not logged in, showing login prompt') // Debug log
    }
  }

  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-gray-700 hover:text-amber-600"
      aria-label="Cart"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs text-white">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      {itemCount === 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-xs text-white">
          0
        </span>
      )}
    </button>
  )
}
