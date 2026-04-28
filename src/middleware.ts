import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  // Allow all traffic for Guest Mode
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/meeting/:path*', '/login', '/signup', '/register'],
};

