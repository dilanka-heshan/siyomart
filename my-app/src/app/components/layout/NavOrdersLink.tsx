'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { PackageIcon } from 'lucide-react'

interface NavOrdersLinkProps {
  mobile?: boolean;
}

export default function NavOrdersLink({ mobile = false }: NavOrdersLinkProps) {
  const { data: session } = useSession()

  if (!session) {
    return null
  }
  
  if (mobile) {
    return (
      <Link href="/orders" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100">
        <PackageIcon className="h-5 w-5 mr-3" aria-hidden="true" />
        <span>Orders</span>
      </Link>
    )
  }
  
  return (
    <Link href="/orders" className="text-gray-700 hover:text-amber-600 flex items-center">
      <PackageIcon className="h-5 w-5 mr-1" aria-hidden="true" />
      <span>Orders</span>
    </Link>
  )
}
