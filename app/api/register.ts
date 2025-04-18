import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

// Helper to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
    }
    if (email === 'meghnakorimi@gmail.com') {
      return NextResponse.json({ success: false, message: 'This email is reserved for admin and cannot be registered as a user.' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        otp,
        otpExpiresAt,
        isVerified: false,
        role: 'user',
      },
    });
    // In production, send OTP via email. For demo, return in response.
    return NextResponse.json({ success: true, otp });
  } catch (err: unknown) {
    console.error('Registration error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
