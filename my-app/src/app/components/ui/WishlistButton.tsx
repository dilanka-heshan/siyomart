'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useWishlist } from '@/app/providers/WishlistProvider'
import toast from 'react-hot-toast'

interface WishlistButtonProps {
  productId: string
  className?: string
  size?: number
}

export function WishlistButton({ productId, className = '', size = 20 }: WishlistButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  
  const productInWishlist = isInWishlist(productId)
  
  const handleWishlistAction = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!session) {
      router.push('/login?callbackUrl=/wishlist')
      return
    }
    
    setIsProcessing(true)
    
    try {
      let success
      
      if (productInWishlist) {
        success = await removeFromWishlist(productId)
        if (success) toast.success('Removed from wishlist')
      } else {
        success = await addToWishlist(productId)
        if (success) toast.success('Added to wishlist')
      }
      
      if (!success) {
        toast.error('Failed to update wishlist')
      }
    } catch (error) {
      toast.error('Error updating wishlist')
    } finally {
      setIsProcessing(false)
    }
  }
  
  return (
    <button
      onClick={handleWishlistAction}
      disabled={isProcessing}
      className={`rounded-full p-2 bg-white shadow-md hover:bg-gray-100 transition-colors ${className} ${
        isProcessing ? 'opacity-50' : ''
      }`}
      aria-label={productInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={size}
        className={productInWishlist ? 'fill-amber-600 text-amber-600' : 'text-gray-600'}
      />
    </button>
  )
}
