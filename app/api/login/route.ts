import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isVerified) {
    return NextResponse.json({ success: false, message: 'Invalid credentials or not verified' }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }
  // For demo: set a session cookie (in production, use JWT or secure session)
  const response = NextResponse.json({ success: true, user: { email: user.email, role: user.role } });
  response.cookies.set('session', Buffer.from(`${user.email}:${user.role}`).toString('base64'), { httpOnly: true, path: '/' });
  return response;
}
