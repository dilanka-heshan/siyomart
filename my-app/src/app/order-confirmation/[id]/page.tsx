'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, ArrowLeft, Truck, Package, Info, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Loader } from '@/app/components/ui/Loader'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface OrderDetails {
  _id: string;
  products: {
    _id: string;
    productId: {
      _id: string;
      name: string;
      images: string[];
      price: number;
    };
    quantity: number;
    price: number;
    subTotal: number;
  }[];
  status: string;
  totalPrice: number;
  paymentMethod: string;
  shipping_method: string;
  shipping_charges: number;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  receiver_details: {
    name: string;
    phone: string;
    email: string;
  };
  order_summary: {
    subtotal: number;
    shipping_charges: number;
    coupon_discount: number;
    final_total: number;
  };
  transactionId?: string;
  createdAt: string;
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (status === 'unauthenticated') {
        router.push('/login')
        return
      }
      
      if (status !== 'authenticated') return
      
      try {
        setLoading(true)
        const res = await fetch(`/api/orders/${params.id}`)
        
        if (!res.ok) {
          throw new Error('Failed to fetch order')
        }
        
        const data = await res.json()
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order:', error)
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
  }, [params.id, router, status])
  
  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 text-amber-600" />
      </div>
    )
  }
  
  // Show error if order not found
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Info className="h-16 w-16 text-amber-600 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }
  
  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      {/* Success message */}
      <div className="bg-green-50 p-6 rounded-lg mb-8 flex items-center">
        <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-700">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>
      </div>
      
      {/* Order information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order details and products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order summary box */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {order.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{order._id.substring(order._id.length - 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="font-medium">{order.shipping_method}</p>
              </div>
            </div>
            
            {order.transactionId && (
              <div className="bg-gray-50 p-3 rounded text-sm mb-6">
                <span className="font-medium">Transaction ID:</span> {order.transactionId}
              </div>
            )}
          </div>
          
          {/* Order items */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            
            <div className="divide-y divide-gray-200">
              {order.products.map((item) => (
                <div key={item._id} className="py-4 flex items-center">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                    {item.productId.images && item.productId.images.length > 0 ? (
                      <Image
                        src={item.productId.images[0]}
                        alt={item.productId.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-base font-medium text-gray-900">
                          <Link href={`/products/${item.productId._id}`} className="hover:text-amber-600">
                            {item.productId.name}
                          </Link>
                        </h3>
                        <p className="ml-4 text-base font-medium text-gray-900">
                          {formatPrice(item.subTotal)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Delivery information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-amber-600" />
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-600">
                  {order.shipping_address.street}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}<br />
                  {order.shipping_address.country}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-amber-600" />
                  Contact Information
                </h3>
                <p className="text-sm text-gray-600">
                  {order.receiver_details.name}<br />
                  {order.receiver_details.phone}<br />
                  {order.receiver_details.email}
                </p>
              </div>
            </div>
          </div>
          
          {/* Expected delivery */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-amber-600" />
              Delivery Status
            </h2>
            
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-amber-200"></div>
              
              <div className="relative pl-10 pb-8">
                <div className="absolute left-2.5 -top-1 h-6 w-6 rounded-full border-2 border-amber-600 bg-white flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-600"></div>
                </div>
                <div>
                  <h3 className="font-medium">Order Placed</h3>
                  <p className="text-sm text-gray-500">{orderDate}</p>
                </div>
              </div>
              
              <div className="relative pl-10 pb-8">
                <div className="absolute left-2.5 -top-1 h-6 w-6 rounded-full border-2 border-gray-300 bg-white"></div>
                <div>
                  <h3 className="font-medium text-gray-500">Processing</h3>
                  <p className="text-sm text-gray-500">Your order is being prepared</p>
                </div>
              </div>
              
              <div className="relative pl-10">
                <div className="absolute left-2.5 -top-1 h-6 w-6 rounded-full border-2 border-gray-300 bg-white"></div>
                <div>
                  <h3 className="font-medium text-gray-500">Delivery</h3>
                  <p className="text-sm text-gray-500">Expected in 3-5 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(order.order_summary.subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{formatPrice(order.order_summary.shipping_charges)}</span>
              </div>
              
              {order.order_summary.coupon_discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.order_summary.coupon_discount)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Order Total</span>
                  <span>{formatPrice(order.order_summary.final_total)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <Link href="/orders">
                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </Link>
              
              <Link href="/shop">
                <Button className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
