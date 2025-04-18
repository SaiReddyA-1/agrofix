import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  if (!email || !otp) {
    return NextResponse.json({ success: false, message: 'Email and OTP required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.isVerified) {
    return NextResponse.json({ success: false, message: 'Invalid user or already verified' }, { status: 400 });
  }
  if (user.otp !== otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
    return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 400 });
  }
  await prisma.user.update({
    where: { email },
    data: { isVerified: true, otp: null, otpExpiresAt: null },
  });
  return NextResponse.json({ success: true });
}
