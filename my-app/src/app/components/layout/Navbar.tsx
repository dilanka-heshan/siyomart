'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, Menu, X, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import UserMenu from './UserMenu'
import UserNotificationIndicator from './UserNotificationIndicator'
import CategoryMenu from './CategoryMenu'
import { useWishlist } from '@/app/providers/WishlistProvider'
import { useCart } from '@/app/providers/CartProvider'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { wishlistItems } = useWishlist()
  const { cart } = useCart()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-20">
            <div className="relative group">
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-amber-600">Siyo</span>
                <div className="relative">
                  <span className="text-2xl font-black text-orange-500">Mart</span>
                  <span className="absolute -top-1.5 -right-3 text-amber-500 text-xs">®</span>
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
              <div className="flex items-center mt-0.5">
                <span className="h-px w-3 bg-gray-400"></span>
                <span className="text-[10px] font-semibold text-gray-600 mx-1 tracking-[0.3em]">MARKETPLACE</span>
                <span className="h-px w-3 bg-gray-400"></span>
              </div>
              <div className="absolute -top-1 -left-3 text-yellow-400 text-lg opacity-70">✦</div>
              <div className="absolute -bottom-1 -right-3 text-orange-400 text-lg opacity-70">✦</div>
            </div>
          </Link>
          
          {/* Search */}
          <div className="hidden md:flex flex-1 mx-40">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg group">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..." 
                className="w-full pl-12 pr-12 py-2.5 border border-gray-200 rounded-full shadow-sm focus:shadow-md transition-shadow duration-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-gray-50"
              />
              <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-full text-white group-hover:rotate-12 transition-transform duration-200">
                <Search className="h-3.5 w-3.5" />
              </div>
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors duration-200">
                <span className="text-xs font-medium mr-1 hidden group-hover:inline">Search</span>
                <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
              <div className="absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 transform -translate-x-1/2 group-hover:w-1/2 transition-all duration-300"></div>
            </form>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link href="/shop" className="text-gray-700 hover:text-amber-600 hidden md:block">
              Shop
            </Link>
            <div className="hidden md:block">
              <CategoryMenu />
            </div>
            <Link href="/about" className="text-gray-700 hover:text-amber-600 hidden md:block">
              About
            </Link>
            {/* <Link href="/contact" className="text-gray-700 hover:text-amber-600 hidden md:block">
              Contact
            </Link> */}
            
            {/* User notifications */}
            <UserNotificationIndicator />

            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart className="h-6 w-6 text-gray-600" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {(cart?.itemCount ?? 0) > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center bg-amber-600 text-white rounded-full text-xs">
                  {cart?.itemCount ?? 0}
                </span>
              )}
            </Link>
            
            {/* User menu */}
            <UserMenu />

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2.5 pl-12 pr-10 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-full text-white">
                  <Search className="h-3.5 w-3.5" />
                </div>
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600">
                  <span className="inline-block">→</span>
                </button>
              </div>
            </form>
            <div className="space-y-3">
              <Link 
                href="/shop" 
                className="block py-2 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <div className="py-2">
                <CategoryMenu isMobile={true} />
              </div>
              <Link 
                href="/about" 
                className="block py-2 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block py-2 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/inquiries" 
                className="block py-2 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Support Inquiries
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
