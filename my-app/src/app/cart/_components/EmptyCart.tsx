'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'

export default function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-amber-50 p-6 rounded-full mb-6">
        <ShoppingCart className="h-16 w-16 text-amber-600" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Looks like you haven't added any items to your cart yet. 
        Explore our products and find something you'll love!
      </p>
      <Link href="/shop">
        <Button>
          Browse Products
        </Button>
      </Link>
    </div>
  )
}
