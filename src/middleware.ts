import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenEdge } from '@/lib/auth-edge'

export function middleware(request: NextRequest) {
  // Protect seller API routes
  if (request.nextUrl.pathname.startsWith('/api/seller')) {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const seller = verifyTokenEdge(token)
    
    if (!seller) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Add seller info to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-seller-id', seller.id)
    requestHeaders.set('x-seller-email', seller.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/seller/:path*',
} 