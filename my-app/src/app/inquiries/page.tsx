'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RefreshCw, MessageCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react'

interface ContactInquiry {
  _id: string;
  subject: string;
  inquiryType: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  response?: {
    date: string;
  };
}

export default function InquiriesPage() {
  const { status } = useSession()
  const router = useRouter()
  
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/inquiries')
    }
    
    if (status === 'authenticated') {
      fetchInquiries()
    }
  }, [status, router])
  
  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contact/user')
      
      if (!response.ok) {
        throw new Error('Failed to fetch inquiries')
      }
      
      const data = await response.json()
      setInquiries(data)
    } catch (error: any) {
      console.error('Error fetching inquiries:', error)
      setError(error.message || 'Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }
  
  const getStatusIcon = (status: string, hasResponse: boolean) => {
    if (hasResponse) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'in-progress':
        return <RefreshCw className="h-5 w-5 text-blue-500" />
      default:
        return <MessageCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusLabel = (status: string, hasResponse: boolean) => {
    if (hasResponse) {
      return "Responded"
    }
    
    switch (status) {
      case 'pending':
        return 'Awaiting Response'
      case 'in-progress':
        return 'In Progress'
      case 'resolved':
        return 'Resolved'
      default:
        return status
    }
  }
  
  const getStatusClass = (status: string, hasResponse: boolean) => {
    if (hasResponse) {
      return 'bg-green-100 text-green-800'
    }
    
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 text-amber-600 animate-spin mr-3" />
        <span>Loading your inquiries...</span>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Your Support Inquiries</h1>
        <p className="text-gray-600 mb-8">Track and manage your communications with SiyoMart support.</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {inquiries.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Inquiries Found</h2>
            <p className="text-gray-600 mb-6">You haven't submitted any inquiries yet.</p>
            <Link 
              href="/contact" 
              className="px-6 py-2 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition"
            >
              Contact Support
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {inquiry.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(inquiry.status, !!inquiry.response)}`}>
                          <span className="flex items-center">
                            {getStatusIcon(inquiry.status, !!inquiry.response)}
                            <span className="ml-1">{getStatusLabel(inquiry.status, !!inquiry.response)}</span>
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/inquiries/${inquiry._id}`}
                          className="text-amber-600 hover:text-amber-900 flex items-center justify-end"
                        >
                          View <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <Link 
            href="/contact" 
            className="px-6 py-2 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition"
          >
            Submit New Inquiry
          </Link>
        </div>
      </div>
    </div>
  )
}
