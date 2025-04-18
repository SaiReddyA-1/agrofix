import { NextRequest, NextResponse } from 'next/server';

// Hardcoded admin credentials
const ADMIN_EMAIL = 'meghnakorimi@gmail.com';
const ADMIN_PASSWORD = 'Meghana@123';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // In real app, set a secure cookie or JWT, here just return success
    return NextResponse.json({ success: true, role: 'admin' });
  }
  // Always return consistent error format
  return NextResponse.json({ success: false, message: 'Invalid admin credentials' }, { status: 401 });
}
