'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import UserMenu from './UserMenu'
import UserNotificationIndicator from './UserNotificationIndicator'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

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
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="SiyoMart Logo" 
              width={120} 
              height={40} 
              className="h-8 w-auto"
            />
          </Link>
          
          {/* Search */}
          <div className="hidden md:flex flex-1 mx-8">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-amber-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link href="/shop" className="text-gray-700 hover:text-amber-600 hidden md:block">
              Shop
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-amber-600 hidden md:block">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-amber-600 hidden md:block">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-amber-600 hidden md:block">
              Contact
            </Link>
            
            {/* User notifications */}
            <UserNotificationIndicator />

            {/* Cart */}
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center bg-amber-600 text-white rounded-full text-xs">0</span>
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
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
              <Link 
                href="/categories" 
                className="block py-2 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
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
