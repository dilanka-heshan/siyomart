'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, ShoppingCart, Heart, User, Search, ChevronDown } from 'lucide-react'

const Header = () => {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const isLoading = status === 'loading'

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-amber-600">SiyoMart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-amber-600 transition-colors">
                Shop <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                <Link href="/category/handmade-art-craft" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                  Handmade Art & Craft
                </Link>
                <Link href="/category/groceries" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                  Groceries
                </Link>
                <Link href="/category/buddhist-items" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                  Buddhist Items
                </Link>
                <Link href="/category/herbal-medicine" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                  Herbal Medicine
                </Link>
                <Link href="/category/utensils" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                  Utensils
                </Link>
              </div>
            </div>
            <Link href="/about" className="text-gray-700 hover:text-amber-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-amber-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/wishlist" className="text-gray-700 hover:text-amber-600 transition-colors">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-amber-600 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            
            {isLoading ? (
              <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-amber-600"
                >
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      width={32} 
                      height={32} 
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-amber-200 rounded-full flex items-center justify-center text-amber-800">
                      {session.user?.name?.charAt(0) || <User className="h-5 w-5" />}
                    </div>
                  )}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="text-sm text-gray-500">{session.user?.email}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                      My Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                      My Orders
                    </Link>
                    {session.user?.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                        Admin Dashboard
                      </Link>
                    )}
                    {session.user?.role === 'operator' && (
                      <Link href="/operator" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                        Operator Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-amber-600 transition-colors flex items-center">
                <User className="h-5 w-5 mr-1" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="text-gray-700 hover:text-amber-600 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg p-4">
          <nav className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-amber-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="text-gray-700 hover:text-amber-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-amber-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-amber-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="border-t border-gray-200 pt-3 mt-3">
              {isLoading ? (
                <div className="h-5 w-full bg-gray-200 animate-pulse"></div>
              ) : session ? (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    {session.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        width={32} 
                        height={32} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-amber-200 rounded-full flex items-center justify-center text-amber-800">
                        {session.user?.name?.charAt(0) || <User className="h-5 w-5" />}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="text-sm text-gray-500">{session.user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link 
                      href="/profile" 
                      className="block text-gray-700 hover:text-amber-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block text-gray-700 hover:text-amber-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    {session.user?.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="block text-gray-700 hover:text-amber-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {session.user?.role === 'operator' && (
                      <Link 
                        href="/operator" 
                        className="block text-gray-700 hover:text-amber-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Operator Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => signOut()}
                      className="block w-full text-left text-gray-700 hover:text-amber-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/login" 
                    className="bg-amber-600 text-white py-2 px-4 rounded-md text-center hover:bg-amber-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="border border-amber-600 text-amber-600 py-2 px-4 rounded-md text-center hover:bg-amber-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header