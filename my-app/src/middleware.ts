import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if the path requires authentication
  const isProtectedPath = path.startsWith('/dashboard') || 
                          path.startsWith('/profile') || 
                          path.startsWith('/admin') || 
                          path.startsWith('/operator') ||
                          path.startsWith('/orders') ||
                          path.startsWith('/wishlist')

  // If it's not a protected path, allow access
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // For protected paths, verify authentication
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })

  // If user is authenticated, allow access
  if (token) {
    // For role-specific paths, check roles
    if ((path.startsWith('/admin') && token.role !== 'admin') || 
        (path.startsWith('/operator') && token.role !== 'operator')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Redirect to login if user is not authenticated
  return NextResponse.redirect(new URL('/login', request.url))
}

// Configure paths that require authentication
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/operator/:path*',
    '/orders/:path*',
    '/wishlist/:path*'
  ]
}
