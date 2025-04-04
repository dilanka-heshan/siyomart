'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/app/providers/CartProvider'
import { Button } from '@/app/components/ui/Button'
import { Loader } from '@/app/components/ui/Loader'
import { Input } from '@/app/components/ui/Input'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, loading: cartLoading, fetchCart, clearCart } = useCart()
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Force fetch cart data when page loads
  useEffect(() => {
    if (session && fetchCart && !cart) {
      console.log('Fetching cart data on page load'); // Debug log
      fetchCart();
    }
  }, [session, fetchCart, cart]);
  
  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      if (session && fetchCart) {
        console.log('Cart updated event received, fetching cart'); // Debug log
        fetchCart();
      }
    }
    
    window.addEventListener('cart-updated', handleCartUpdate)
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate)
    }
  }, [session, fetchCart])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shippingMethod, setShippingMethod] = useState('Standard')
  const [paymentMethod, setPaymentMethod] = useState('Stripe')
  const [customerMessage, setCustomerMessage] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka'
  })
  
  // Calculate order summary
  const shippingRates = {
    Standard: 350,
    Express: 550,
    Priority: 850
  }
  
  const shipping_charges = shippingRates[shippingMethod as keyof typeof shippingRates]
  const taxRate = 0.08
  const taxAmount = cart?.cartTotal ? cart.cartTotal * taxRate : 0
  const subtotal = cart?.cartTotal || 0
  const final_total = subtotal + shipping_charges + taxAmount - couponDiscount
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout')
    }
  }, [status, router])
  
  // Redirect to home if cart is empty
  useEffect(() => {
    if (cart && cart.items && cart.items.length === 0 && !cartLoading && status === 'authenticated') {
      toast.error('Your cart is empty');
      router.push('/shop');
    }
  }, [cart, cartLoading, status, router])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error('Please enter a coupon code')
      return
    }
    
    try {
      // In a real app, this would validate the coupon with the backend
      // For now, just simulate a successful coupon application
      toast.success('Coupon applied successfully!')
      setCouponApplied(true)
      setCouponDiscount(subtotal * 0.1) // 10% discount
    } catch (error) {
      toast.error('Failed to apply coupon')
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cart) {
      toast.error('Your cart is empty')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // 1. Create the order
      const orderData = {
        products: cart.items.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.price,
          subTotal: item.subtotal
        })),
        shipping_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        receiver_details: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        },
        shipping_method: shippingMethod,
        shipping_charges,
        paymentMethod,
        applied_coupon: couponApplied ? {
          code: couponCode,
          discount: couponDiscount,
          discountType: 'percentage'
        } : null,
        customer_message: customerMessage,
        order_summary: {
          subtotal,
          shipping_charges,
          coupon_discount: couponDiscount,
          final_total
        }
      }
      
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      if (!orderRes.ok) {
        const error = await orderRes.json()
        throw new Error(error.message || 'Failed to create order')
      }
      
      const orderResult = await orderRes.json()
      
      // 2. Process payment
      const paymentData = {
        orderId: orderResult.orderId,
        amount: final_total,
        paymentMethod,
        billingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        }
      }
      
      try {
        const paymentRes = await fetch('/api/payments/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData)
        })
        
        if (!paymentRes.ok) {
          // Try to parse error as JSON
          let errorMessage = 'Failed to process payment';
          try {
            const errorData = await paymentRes.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            // If we can't parse JSON, use status text
            errorMessage = `Payment error: ${paymentRes.statusText}`;
          }
          throw new Error(errorMessage);
        }
        
        const paymentResult = await paymentRes.json();
        
        // 3. Clear the cart and redirect to confirmation page
        await clearCart();
        
        router.push(`/order-confirmation/${orderResult.orderId}`);
        toast.success('Order placed successfully!');
      } catch (paymentError: any) {
        // Payment failed but order was created
        console.error("Payment processing error:", paymentError);
        toast.error(paymentError.message || 'Payment processing failed');
        
        // Still redirect to the order confirmation page since the order was created
        router.push(`/order-confirmation/${orderResult.orderId}`);
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Handle loading state - now checks for both session and cart loading
  if (status === 'loading' || cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 text-amber-600" />
      </div>
    )
  }
  
  // Verify we have cart data before rendering the checkout form
  if (!cart || !cart.items) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader className="h-8 w-8 text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }
  
  // Return main form
  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP / Postal Code
                  </label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    required
                  >
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Shipping Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="standard"
                    name="shippingMethod"
                    type="radio"
                    checked={shippingMethod === 'Standard'}
                    onChange={() => setShippingMethod('Standard')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="standard" className="ml-3 block text-sm font-medium text-gray-700">
                    Standard Shipping (3-5 business days) - {formatPrice(350)}
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="express"
                    name="shippingMethod"
                    type="radio"
                    checked={shippingMethod === 'Express'}
                    onChange={() => setShippingMethod('Express')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="express" className="ml-3 block text-sm font-medium text-gray-700">
                    Express Shipping (2-3 business days) - {formatPrice(550)}
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="priority"
                    name="shippingMethod"
                    type="radio"
                    checked={shippingMethod === 'Priority'}
                    onChange={() => setShippingMethod('Priority')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="priority" className="ml-3 block text-sm font-medium text-gray-700">
                    Priority Shipping (1-2 business days) - {formatPrice(850)}
                  </label>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="stripe"
                    name="paymentMethod"
                    type="radio"
                    checked={paymentMethod === 'Stripe'}
                    onChange={() => setPaymentMethod('Stripe')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700">
                    Credit Card (Stripe)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="cod"
                    name="paymentMethod"
                    type="radio"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              
              <label htmlFor="customerMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Order Notes (optional)
              </label>
              <textarea
                id="customerMessage"
                name="customerMessage"
                rows={3}
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                placeholder="Special instructions for delivery"
              />
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {/* Cart items */}
              <div className="border-b border-gray-200 pb-4">
                {cart?.items.map((item) => (
                  <div key={item._id} className="flex justify-between py-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.productId.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>
              
              {/* Coupon code */}
              {!couponApplied ? (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleApplyCoupon} variant="outline">
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                  <p className="text-sm text-green-700">
                    Coupon <span className="font-medium">{couponCode}</span> applied
                  </p>
                  <button
                    onClick={() => {
                      setCouponApplied(false);
                      setCouponDiscount(0);
                      setCouponCode('');
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
              
              {/* Price details */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium">{formatPrice(subtotal)}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium">{formatPrice(shipping_charges)}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Tax (8%)</p>
                  <p className="text-sm font-medium">{formatPrice(taxAmount)}</p>
                </div>
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <p className="text-sm">Discount</p>
                    <p className="text-sm font-medium">-{formatPrice(couponDiscount)}</p>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>{formatPrice(final_total)}</p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? <Loader className="h-5 w-5" /> : 'Place Order'}
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
