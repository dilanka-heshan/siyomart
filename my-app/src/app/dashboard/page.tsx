'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingCart, Settings, Users, CreditCard, BarChart2 } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Loader } from '@/app/components/ui/Loader'  // Import the Loader component
import { formatPrice } from '@/lib/utils'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)  // Local loading state
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [orderStats, setOrderStats] = useState({ 
    total: 0, 
    pending: 0, 
    processing: 0, 
    delivered: 0 
  })
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])
  
  // Fetch recent orders and stats directly instead of using the context
  useEffect(() => {
    const fetchOrders = async () => {
      if (status === 'authenticated') {
        try {
          setLoading(true)
          // Fetch orders directly from API instead of using context
          const res = await fetch('/api/orders')
          
          if (!res.ok) {
            throw new Error('Failed to fetch orders')
          }
          
          const orders = await res.json()
          
          // Take the 5 most recent orders
          setRecentOrders(orders.slice(0, 5))
          
          // Calculate order stats
          setOrderStats({
            total: orders.length,
            pending: orders.filter((o: any) => o.status === 'Pending').length,
            processing: orders.filter((o: any) => o.status === 'Processing').length,
            delivered: orders.filter((o: any) => o.status === 'Delivered').length
          })
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    
    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status])
  
  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 text-amber-600" />
      </div>
    )
  }
  
  if (status === 'unauthenticated') {
    return null
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Dashboard quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
              <p className="text-2xl font-bold">{orderStats.total || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Pending Orders</h2>
              <p className="text-2xl font-bold">{orderStats.pending || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Processing</h2>
              <p className="text-2xl font-bold">{orderStats.processing || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Delivered</h2>
              <p className="text-2xl font-bold">{orderStats.delivered || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/orders" className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium text-gray-800">View Orders</h2>
              <p className="text-sm text-gray-500 mt-1">Manage and track your orders</p>
            </div>
            <Package className="h-8 w-8 text-amber-600" />
          </div>
        </Link>
        
        <Link href="/checkout" className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium text-gray-800">Checkout</h2>
              <p className="text-sm text-gray-500 mt-1">Complete your purchase</p>
            </div>
            <CreditCard className="h-8 w-8 text-amber-600" />
          </div>
        </Link>
        
        {session?.user.role === 'admin' && (
          <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium text-gray-800">Admin Orders</h2>
                <p className="text-sm text-gray-500 mt-1">Manage all customer orders</p>
              </div>
              <Users className="h-8 w-8 text-amber-600" />
            </div>
          </Link>
        )}
      </div>
      
      {/* Recent orders */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-medium mb-4">Recent Orders</h2>
        
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-6">You haven't placed any orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/order-confirmation/${order._id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-4 text-center"></div>
          <Link href="/orders">
            <Button variant="outline">View All Orders</Button>
          </Link>
        </div>
      </div>
  )
}
