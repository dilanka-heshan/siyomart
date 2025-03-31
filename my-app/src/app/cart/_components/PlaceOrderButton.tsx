'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/app/components/ui/Button'
import { Loader } from '@/app/components/ui/Loader'

interface PlaceOrderButtonProps {
  className?: string
}

export default function PlaceOrderButton({ className = '' }: PlaceOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  
  const handleCheckout = () => {
    if (!session) {
      router.push('/login?callbackUrl=/checkout')
      return
    }
    
    setIsLoading(true)
    router.push('/checkout')
  }
  
  return (
    <Button 
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? <Loader className="h-5 w-5" /> : 'Proceed to Checkout'}
    </Button>
  )
}
