import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/seller')) {
    const sellerId = request.headers.get('x-seller-id');
    if (!sellerId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    // Allow request if x-seller-id is present
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/seller/:path*',
}; 