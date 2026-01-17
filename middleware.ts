import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow public access to validation-key.txt and health check
  const pathname = request.nextUrl.pathname;
  
  if (pathname === '/validation-key.txt' || pathname === '/api/health' || pathname === '/api/validation-key') {
    // Create response with headers that bypass Vercel protection
    const response = NextResponse.next();
    
    // Add headers to indicate this is a public endpoint
    response.headers.set('X-Robots-Tag', 'noindex');
    response.headers.set('Cache-Control', 'public, max-age=3600');
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/validation-key.txt', '/api/health', '/api/validation-key'],
};
