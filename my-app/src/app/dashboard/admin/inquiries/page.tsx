'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Mail, Phone, Calendar, RefreshCw, Search,
   AlertTriangle, Inbox, Send,
  Filter, ArrowLeft, MessageSquare
} from 'lucide-react'

interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
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
}

export default function ContactInquiriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [responseText, setResponseText] = useState<string>('')
  const [respondingInProgress, setRespondingInProgress] = useState(false)

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session && session.user && session.user.role !== 'admin') {
      router.push('/dashboard')
    } else if (status === 'authenticated') {
      fetchInquiries()
    }
  }, [status, session, router])

  const fetchInquiries = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/contact')
      
      if (!response.ok) {
        throw new Error('Failed to fetch inquiries')
      }
      
      const data = await response.json()
      setInquiries(data)
    } catch (error: any) {
      setError(error.message || 'Something went wrong')
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async (id: string, status: 'pending' | 'in-progress' | 'resolved') => {
    try {
      const response = await fetch(`/api/contact/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update status')
      }
      
      // Update local state
      setInquiries(inquiries.map(inquiry => 
        inquiry._id === id ? { ...inquiry, status } : inquiry
      ))
      
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status })
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update status')
      console.error('Error updating status:', error)
    }
  }

  const sendResponse = async () => {
    if (!selectedInquiry || !responseText.trim()) return
    
    setRespondingInProgress(true)
    
    try {
      const response = await fetch(`/api/contact/${selectedInquiry._id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: responseText,
          respondedBy: session?.user?.name || 'Admin'
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send response')
      }
      
      const updatedInquiry = await response.json()
      
      // Update local state
      setInquiries(inquiries.map(inquiry => 
        inquiry._id === selectedInquiry._id ? updatedInquiry : inquiry
      ))
      
      setSelectedInquiry(updatedInquiry)
      setResponseText('')
      
    } catch (error: any) {
      setError(error.message || 'Failed to send response')
      console.error('Error sending response:', error)
    } finally {
      setRespondingInProgress(false)
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

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 text-amber-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Inquiries</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-md mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filters and search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">Total:</span>
            <span className="font-semibold">{inquiries.length}</span>
          </div>
          
          <button 
            onClick={fetchInquiries}
            className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search inquiries..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile view - toggle between list and detail */}
      <div className="md:hidden mb-4">
        {selectedInquiry && (
          <button 
            onClick={() => setSelectedInquiry(null)}
            className="flex items-center text-amber-600 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to list
          </button>
        )}
      </div>

      {/* Inquiries list and detail view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiry List - hide on mobile when an inquiry is selected */}
        <div className={`col-span-1 ${selectedInquiry ? 'hidden md:block' : ''}`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Inbox className="h-5 w-5 mr-2 text-amber-600" />
            Inquiries ({filteredInquiries.length})
          </h2>
          
          {filteredInquiries.length === 0 ? (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
              <p className="text-gray-600">No inquiries found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
              {filteredInquiries.map(inquiry => (
                <div 
                  key={inquiry._id}
                  className={`p-4 rounded-lg border ${selectedInquiry?._id === inquiry._id ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'} 
                  hover:border-amber-300 transition cursor-pointer shadow-sm`}
                  onClick={() => setSelectedInquiry(inquiry)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 truncate max-w-[180px]">{inquiry.subject}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 truncate">{inquiry.name}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> 
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Inquiry Detail */}
        <div className={`col-span-1 lg:col-span-2 ${!selectedInquiry && 'hidden md:block'}`}>
          {selectedInquiry ? (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">{selectedInquiry.subject}</h2>
                <span className={`text-xs px-2.5 py-1.5 rounded-full ${getStatusBadgeClass(selectedInquiry.status)}`}>
                  {selectedInquiry.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Type</p>
                  <p className="font-medium">{getInquiryTypeLabel(selectedInquiry.inquiryType)}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Date</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {formatDate(selectedInquiry.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Name</p>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Email</p>
                  <p className="font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-gray-400" />
                    <a href={`mailto:${selectedInquiry.email}`} className="text-amber-600 hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <p className="text-gray-500 mb-1">Phone</p>
                    <p className="font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-400" />
                      <a href={`tel:${selectedInquiry.phone}`} className="text-amber-600 hover:underline">
                        {selectedInquiry.phone}
                      </a>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-gray-500 mb-2">Message</p>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <p className="whitespace-pre-wrap text-gray-700">{selectedInquiry.message}</p>
                </div>
              </div>

              {selectedInquiry.response && (
                <div className="mb-6">
                  <h3 className="text-gray-700 font-medium mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Response
                  </h3>
                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <p className="whitespace-pre-wrap text-gray-700 mb-3">{selectedInquiry.response.text}</p>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>By: {selectedInquiry.response.respondedBy}</span>
                      <span>{formatDate(selectedInquiry.response.date)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="font-semibold mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    className={`px-4 py-2 rounded-md ${
                      selectedInquiry.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                    }`}
                    onClick={() => updateInquiryStatus(selectedInquiry._id, 'pending')}
                  >
                    Pending
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      selectedInquiry.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                    }`}
                    onClick={() => updateInquiryStatus(selectedInquiry._id, 'in-progress')}
                  >
                    In Progress
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      selectedInquiry.status === 'resolved'
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800'
                    }`}
                    onClick={() => updateInquiryStatus(selectedInquiry._id, 'resolved')}
                  >
                    Resolved
                  </button>
                </div>
              </div>
              
              {!selectedInquiry.response && (
                <div>
                  <h3 className="font-semibold mb-3">Add Response</h3>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
                    rows={5}
                    placeholder="Type your response here..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={sendResponse}
                      disabled={respondingInProgress || !responseText.trim()}
                    >
                      {respondingInProgress ? (
                        <>
                          <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Response
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-full flex flex-col justify-center items-center text-center">
              <Mail className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Select an inquiry</h3>
              <p className="text-gray-500">
                Click on an inquiry from the list to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
