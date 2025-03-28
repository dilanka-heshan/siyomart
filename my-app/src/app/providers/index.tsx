'use client'

import { ReactNode } from 'react'
import AuthProvider from './AuthProvider'
import { CartProvider } from './CartProvider'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-center" />
      </CartProvider>
    </AuthProvider>
  )
}
