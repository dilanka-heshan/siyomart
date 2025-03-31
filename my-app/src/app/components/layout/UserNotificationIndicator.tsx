'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell } from 'lucide-react'

export default function UserNotificationIndicator() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  
  useEffect(() => {
    if (status === 'authenticated') {
      checkUnreadResponses()
    }
  }, [status, pathname]) // Also check when pathname changes to update the count after viewing
  
  const checkUnreadResponses = async () => {
    try {
      const response = await fetch('/api/contact/user/unread')
      
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      }
    } catch (error) {
      console.error('Failed to fetch unread responses', error)
    }
  }
  
  if (status !== 'authenticated') {
    return null
  }
  
  return (
    <Link href="/inquiries" className="relative p-2" title="My Support Inquiries">
      <Bell className="h-5 w-5 text-gray-700" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
