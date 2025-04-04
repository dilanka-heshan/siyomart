'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useCart } from '@/app/providers/CartProvider'
import { formatPrice } from '@/lib/utils'
import { Loader } from '@/app/components/ui/Loader'
import { toast } from 'react-hot-toast'

interface CartItemProps {
  item: {
    _id: string
    productId: {
      _id: string
      name: string
      images: string[]
      stock: number
      price: number
    }
    quantity: number
    price: number
    subtotal: number
  }
}

export default function CartItemCard({ item }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { updateCartItem, removeCartItem } = useCart()
  
  const handleQuantityChange = async (quantity: number) => {
    if (quantity < 1 || quantity > item.productId.stock) {
      toast.error('Invalid quantity');
      return;
    }
    
    setIsUpdating(true)
    try {
      console.log('Updating quantity to:', quantity); // Debug log
      const success = await updateCartItem(item._id, quantity)
      if (!success) {
        toast.error('Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating cart:', error) // Debug log
      toast.error('Failed to update quantity')
    } finally {
      setIsUpdating(false)
    }
  }
  
  const handleRemove = async () => {
    console.log('Remove button clicked for item:', item._id); // Debug log
    setIsUpdating(true);
    try {
      const success = await removeCartItem(item._id);
      if (!success) {
        toast.error('Failed to remove item');
      } else {
        console.log('Item removed successfully, refreshing UI'); // Debug log
      }
    } catch (error) {
      console.error('Error removing item:', error); // Debug log
      toast.error('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  }
  
  return (
    <div className="flex flex-col sm:flex-row items-start border rounded-lg p-4 relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
          <Loader className="h-8 w-8 text-amber-600" />
        </div>
      )}
      
      {/* Product Image */}
      <div className="w-full sm:w-32 h-32 relative mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
        <Link href={`/products/${item.productId._id}`}>
          <Image
            src={item.productId.images[0] || '/images/placeholder.png'}
            alt={item.productId.name}
            fill
            className="object-cover rounded-md"
          />
        </Link>
      </div>
      
      {/* Product Info */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between w-full">
        <div className="mb-4 sm:mb-0">
          <Link href={`/products/${item.productId._id}`} className="text-lg font-medium hover:text-amber-600 line-clamp-2">
            {item.productId.name}
          </Link>
          <p className="text-sm text-gray-500 mb-2">Unit Price: {formatPrice(item.price)}</p>
          
          <div className="flex items-center mt-4">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 rounded-l-md"
            >
              -
            </button>
            <span className="px-4 py-1 border-t border-b border-gray-300 text-center min-w-[40px]">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.productId.stock || isUpdating}
              className="px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 rounded-r-md"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <p className="text-lg font-medium">
            {formatPrice(item.subtotal)}
          </p>
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="flex items-center text-sm text-red-600 mt-2 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
