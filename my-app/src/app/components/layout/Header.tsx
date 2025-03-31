'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Search, User, LogOut, ShoppingBag, Heart } from 'lucide-react'
import CartIcon from './CartIcon'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  // Check scroll position for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      // Navigate to shop page with search params
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('') // Clear the search input after submission
      setIsMenuOpen(false) // Close mobile menu if open
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'
    } transition-all duration-200`}>
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-amber-600">SiyoMart</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-amber-600">Home</Link>
          <Link href="/shop" className="text-gray-700 hover:text-amber-600">Shop</Link>
          <Link href="/about" className="text-gray-700 hover:text-amber-600">About</Link>
          <Link href="/contact" className="text-gray-700 hover:text-amber-600">Contact</Link>
        </nav>

        {/* Search, Cart, User Icons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="py-1 pl-8 pr-2 w-40 lg:w-60 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>

          {/* Cart Icon */}
          <CartIcon />

          {/* User Menu */}
          {session ? (
            <div className="relative group">
              <button className="p-2 text-gray-700 hover:text-amber-600">
                <User className="h-6 w-6" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 text-sm border-b border-gray-200">
                  <p className="font-medium">{session.user?.name}</p>
                  <p className="text-gray-500 text-xs">{session.user?.email}</p>
                </div>
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50">Dashboard</Link>
                <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50">Orders</Link>
                <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50">Wishlist</Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login" className="px-3 py-1 rounded-md text-sm font-medium text-amber-600 hover:bg-amber-50">
                Log in
              </Link>
              <Link href="/register" className="px-3 py-1 rounded-md text-sm font-medium bg-amber-600 text-white hover:bg-amber-700">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <CartIcon />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 hover:text-amber-600"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-amber-500 text-white px-3 py-1 rounded text-sm"
              >
                Search
              </button>
            </form>

            <nav className="space-y-3">
              <Link
                href="/"
                className="block py-2 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="block py-2 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
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
            </nav>

            {session ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-2">
                    {session.user?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium">{session.user?.name}</p>
                    <p className="text-gray-500 text-xs">{session.user?.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="block py-2 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/orders"
                  className="block py-2 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="block py-2 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left py-2 text-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col space-y-2">
                <Link
                  href="/login"
                  className="py-2 rounded-md text-center font-medium text-amber-600 border border-amber-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="py-2 rounded-md text-center font-medium bg-amber-600 text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}