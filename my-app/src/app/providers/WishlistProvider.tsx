'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface WishlistItem {
  _id: string
  name: string
  images: string[]
  price: number
  stock: number
  slug?: string
  category?: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  isLoading: boolean
  isInWishlist: (productId: string) => boolean
  addToWishlist: (productId: string) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<boolean>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  
  // Fetch wishlist when session changes
  useEffect(() => {
    async function fetchWishlist() {
      if (status === 'authenticated') {
        try {
          setIsLoading(true)
          const response = await fetch('/api/wishlist')
          
          if (response.ok) {
            const data = await response.json()
            setWishlistItems(data.products || [])
          } else {
            console.error('Failed to fetch wishlist')
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error)
        } finally {
          setIsLoading(false)
        }
      } else if (status === 'unauthenticated') {
        // Clear wishlist when not logged in
        setWishlistItems([])
        setIsLoading(false)
      }
    }
    
    fetchWishlist()
  }, [status])
  
  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item._id === productId)
  }
  
  // Add to wishlist
  const addToWishlist = async (productId: string): Promise<boolean> => {
    if (!session) return false
    
    try {
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      
      if (response.ok) {
        // Refetch the wishlist to get updated data
        const wishlistResponse = await fetch('/api/wishlist')
        if (wishlistResponse.ok) {
          const data = await wishlistResponse.json()
          setWishlistItems(data.products || [])
        }
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      return false
    }
  }
  
  // Remove from wishlist
  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!session) return false
    
    try {
      const response = await fetch(`/api/wishlist/remove/${productId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Update local state without refetching
        setWishlistItems(prev => prev.filter(item => item._id !== productId))
        return true
      }
      return false
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      return false
    }
  }
  
  const value = {
    wishlistItems,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist
  }
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
