import Link from 'next/link';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { 
  User, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  Settings, 
  MessageSquare 
} from 'lucide-react';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-2 focus:outline-none" 
        onClick={toggleMenu}
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-600" />
        </div>
        <span className="hidden md:block font-medium">
          {session?.user?.name || 'Account'}
        </span>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop for clicking outside to close */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={closeMenu}
          ></div>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            {session ? (
              <>
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                </div>
                
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                
                <Link 
                  href="/orders" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Orders
                </Link>
                
                <Link 
                  href="/wishlist" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Link>
                
                <Link 
                  href="/inquiries" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Support Inquiries
                </Link>
                
                <button 
                  onClick={() => {
                    closeMenu();
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Sign in
                </Link>
                <Link 
                  href="/register" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
