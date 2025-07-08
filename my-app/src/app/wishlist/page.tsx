'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useWishlist } from '@/app/providers/WishlistProvider'
import { useCart } from '@/app/providers/CartProvider'
import { Button } from '@/app/components/ui/Button'
import { Loader } from '@/app/components/ui/Loader'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { status } = useSession()
  const router = useRouter()
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/wishlist')
    }
  }, [status, router])
  
  // Handler to remove item from wishlist
  const handleRemoveFromWishlist = async (productId: string) => {
    const success = await removeFromWishlist(productId)
    if (success) {
      toast.success('Item removed from wishlist')
    } else {
      toast.error('Failed to remove item')
    }
  }
  
  // Handler to add item to cart
  const handleAddToCart = async (productId: string) => {
    try {
      const success = await addToCart(productId, 1)
      if (success) {
        toast.success('Added to cart')
        router.refresh() // Refresh to update cart count in navbar
      } else {
        toast.error('Failed to add to cart')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }
  
  // Show loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Loader className="h-8 w-8" />
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">
            Add items to your wishlist to keep track of products you're interested in.
          </p>
          <Link href="/shop">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div 
              key={product._id} 
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/products/${product.slug || product._id}`}>
                <div className="aspect-square relative">
                  <Image
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              </Link>
              
              <div className="p-4">
                <Link 
                  href={`/products/${product.slug || product._id}`}
                  className="block font-medium text-lg hover:text-amber-600 truncate"
                >
                  {product.name}
                </Link>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="font-semibold">
                    {formatPrice(product.price)}
                  </span>
                  <span className={product.stock > 0 ? "text-green-600 text-sm" : "text-red-600 text-sm"}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveFromWishlist(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
