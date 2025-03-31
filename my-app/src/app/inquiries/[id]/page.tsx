'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { RefreshCw, MessageSquare, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'

interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  inquiryType: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  response?: {
    text: string;
    date: string;
    respondedBy: string;
  };
  responseViewed: boolean;
}

export default function InquiryDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const { id } = params
  
  const [inquiry, setInquiry] = useState<ContactInquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/inquiries/${id}`)
    }
    
    if (status === 'authenticated') {
      fetchInquiry()
    }
  }, [id, status, router])
  
  const fetchInquiry = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/contact/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch inquiry')
      }
      
      const data = await response.json()
      
      // Check if user has permission to view this inquiry
      if (session?.user?.email !== data.email && session?.user?.role !== 'admin') {
        throw new Error('You do not have permission to view this inquiry')
      }
      
      setInquiry(data)
      
      // If there's a response, mark it as viewed
      if (data.response && !data.responseViewed) {
        markAsViewed(id as string)
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  const markAsViewed = async (inquiryId: string) => {
    try {
      await fetch(`/api/contact/${inquiryId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    } catch (error) {
      console.error('Failed to mark inquiry as viewed:', error)
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getInquiryTypeLabel = (type: string) => {
    switch (type) {
      case 'general': return 'General Inquiry'
      case 'product': return 'Product Question'
      case 'seller': return 'Become a Seller'
      case 'order': return 'Order Support'
      case 'shipping': return 'Shipping Information'
      case 'other': return 'Other'
      default: return type
    }
  }
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 text-amber-600 animate-spin mr-3" />
        <span>Loading...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <Link href="/" className="text-amber-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }
  
  if (!inquiry) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Inquiry Not Found</h2>
          <p className="mb-4">The inquiry you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="text-amber-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/inquiries" className="text-amber-600 hover:underline">
            &larr; Back to All Inquiries
          </Link>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">{inquiry.subject}</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(inquiry.status)}`}>
              {inquiry.status === 'pending' ? 'Awaiting Response' : 
                inquiry.status === 'in-progress' ? 'In Progress' : 'Resolved'}
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-500">Inquiry Type</p>
              <p className="font-medium">{getInquiryTypeLabel(inquiry.inquiryType)}</p>
            </div>
            <div>
              <p className="text-gray-500">Date Submitted</p>
              <p className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                {formatDate(inquiry.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="mb-8 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold mb-4">Your Message</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>
          
          {inquiry.response ? (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-amber-600" />
                Response from SiyoMart Support
              </h2>
              <div className="bg-amber-50 p-5 rounded-md border-l-4 border-amber-400">
                <p className="whitespace-pre-wrap mb-4">{inquiry.response.text}</p>
                <div className="text-sm text-gray-500 flex justify-between items-center pt-3 border-t border-amber-200">
                  <span>From: {inquiry.response.respondedBy}</span>
                  <span>{formatDate(inquiry.response.date)}</span>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="mb-4">Do you have more questions?</p>
                <Link 
                  href="/contact" 
                  className="px-6 py-2 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition inline-flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us Again
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-5 rounded-md text-center">
              <p className="text-blue-800 mb-3">
                Thank you for your inquiry. Our team is reviewing your message and will respond soon.
              </p>
              <p className="text-sm text-blue-700">
                Current status: <span className="font-medium">{inquiry.status === 'pending' ? 'Awaiting Response' : 'In Progress'}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
