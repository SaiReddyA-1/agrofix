import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  let email = '', role = '';
  if (session) {
    try {
      [email, role] = Buffer.from(session, 'base64').toString().split(':');
    } catch {}
  }

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
  // Protect user-only pages (example: order placement)
  if (req.nextUrl.pathname.startsWith('/order') || req.nextUrl.pathname.startsWith('/track')) {
    if (!email || role !== 'user') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/order', '/track'],
};
