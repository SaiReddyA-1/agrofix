import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  if (!session) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  let email = '';
  try {
    [email] = Buffer.from(session, 'base64').toString().split(':');
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
  }
  const { password } = await req.json();
  if (!password) return NextResponse.json({ success: false, message: 'Password required' }, { status: 400 });
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { email }, data: { passwordHash } });
  return NextResponse.json({ success: true });
}
