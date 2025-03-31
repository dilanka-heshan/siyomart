'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Clock, FileText, TrendingUp, Users, Search } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input' // Fixed import
import { Loader } from '@/app/components/ui/Loader'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Order {
  _id: string;
  userId: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  shipping_method: string;
  createdAt: string;
  receiver_details: {
    name: string;
    email: string;
  };
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  
  // Check if user is an admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/orders')
      return
    }
    
    if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/')
        toast.error('You do not have access to this page')
      }
    }
  }, [status, session, router])
  
  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (status !== 'authenticated' || session?.user.role !== 'admin') return
      
      try {
        setLoading(true)
        const res = await fetch('/api/admin/orders')
        
        if (!res.ok) {
          throw new Error('Failed to fetch orders')
        }
        
        const data = await res.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [status, session])
  
  // Handle order status update
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      })
      
      if (!res.ok) {
        throw new Error('Failed to update order status')
      }
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ))
      
      toast.success('Order status updated successfully')
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }
  
  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => {
    const searchMatch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.receiver_details.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.receiver_details.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const statusMatch = filterStatus === 'All' || order.status === filterStatus
    
    return searchMatch && statusMatch
  })
  
  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 text-amber-600" />
      </div>
    )
  }
  
  // Access denied
  if (status === 'authenticated' && session.user.role !== 'admin') {
    return null // Will redirect in useEffect
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Order Management</h1>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Total Orders</h2>
            <FileText className="h-6 w-6 text-amber-600" />
          </div>
          <p className="text-2xl font-bold mt-2">{orders.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Pending</h2>
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {orders.filter(o => o.status === 'Pending').length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Revenue</h2>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {formatPrice(orders.reduce((sum, order) => sum + order.totalPrice, 0))}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Customers</h2>
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {new Set(orders.map(o => o.userId)).size}
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search orders by ID, customer name or email"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const orderDate = new Date(order.createdAt).toLocaleDateString();
                  
                  return (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{order.receiver_details.name}</div>
                        <div className="text-xs">{order.receiver_details.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {orderDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 py-1 px-2"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href={`/order-confirmation/${order._id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
