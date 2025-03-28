'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader } from '@/app/components/ui/Loader'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    // Redirect based on user role
    if (status === 'authenticated') {
      switch (session.user.role) {
        case 'admin':
          router.push('/admin')
          break
        case 'operator':
          router.push('/operator')
          break
        default:
          // For regular users, stay on dashboard
          break
      }
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={32} />
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {session.user.name}</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
          <p className="text-gray-600">You don't have any orders yet.</p>
          <button className="mt-4 text-amber-600 hover:text-amber-700">Browse Products</button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Wishlist</h2>
          <p className="text-gray-600">Your wishlist is empty.</p>
          <button className="mt-4 text-amber-600 hover:text-amber-700">Discover Products</button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Profile</h2>
          <p className="text-gray-600">Update your personal information</p>
          <button className="mt-4 text-amber-600 hover:text-amber-700">Edit Profile</button>
        </div>
      </div>
    </div>
  )
}
