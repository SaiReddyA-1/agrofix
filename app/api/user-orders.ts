import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }
  let email = '';
  try {
    [email] = Buffer.from(session, 'base64').toString().split(':');
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
  }
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }
  // Find orders for this user (by buyerContact == email)
  const orders = await prisma.order.findMany({
    where: { buyerContact: user.email },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
  // Convert Decimal fields to numbers for frontend compatibility
  const plainOrders = orders.map(order => ({
    ...order,
    totalAmount: order.totalAmount ? Number(order.totalAmount) : 0,
    items: order.items.map(item => ({
      ...item,
      price: item.price ? Number(item.price) : 0,
    }))
  }));
  return NextResponse.json(plainOrders);
}
