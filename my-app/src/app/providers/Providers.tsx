'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './CartProvider'
import { OrderProvider } from './OrderProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CartProvider>
        <OrderProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                border: '1px solid #F59E0B',
                padding: '16px',
                color: '#1F2937',
              },
            }}
          />
          {children}
        </OrderProvider>
      </CartProvider>
    </SessionProvider>
  )
}
