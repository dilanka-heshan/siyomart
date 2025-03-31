'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ShoppingBag, ArrowRight, Truck, AlertCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Loader } from '@/app/components/ui/Loader'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Order {
  _id: string;
  status: string;
  totalPrice: number;
  products: {
    _id: string;
    productId: {
      _id: string;
      name: string;
      images: string[];
    };
    quantity: number;
  }[];
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (status === 'unauthenticated') {
        router.push('/login?callbackUrl=/orders')
        return
      }
      
      if (status !== 'authenticated') return
      
      try {
        setLoading(true)
        const res = await fetch('/api/orders')
        
        if (!res.ok) {
          throw new Error('Failed to fetch orders')
        }
        
        const data = await res.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load your orders')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [router, status])
  
  // Function to get status badge style
  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 text-amber-600" />
      </div>
    )
  }
  
  // Empty state
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <ShoppingBag className="h-16 w-16 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">No Orders Yet</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          You haven't placed any orders yet. Start shopping to find products you'll love!
        </p>
        <Link href="/shop">
          <Button>
            Browse Products
          </Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => {
          // Format date
          const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          return (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="mb-2 md:mb-0">
                  <span className="text-sm text-gray-500">Order placed</span>
                  <p className="font-medium">{orderDate}</p>
                </div>
                
                <div className="mb-2 md:mb-0">
                  <span className="text-sm text-gray-500">Order number</span>
                  <p className="font-medium">{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                </div>
                
                <div className="mb-2 md:mb-0">
                  <span className="text-sm text-gray-500">Total</span>
                  <p className="font-medium">{formatPrice(order.totalPrice)}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-5">
                  {/* Order items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.products.slice(0, 2).map((item) => (
                      <div key={item._id} className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                          {item.productId.images && item.productId.images.length > 0 ? (
                            <Image
                              src={item.productId.images[0]}
                              alt={item.productId.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.productId.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    
                    {order.products.length > 2 && (
                      <div className="flex items-center text-sm text-amber-600">
                        <span>+{order.products.length - 2} more items</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-1 flex items-center justify-end">
                  <Link 
                    href={`/order-confirmation/${order._id}`}
                    className="inline-flex items-center justify-center text-sm text-amber-600 hover:text-amber-800"
                  >
                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
