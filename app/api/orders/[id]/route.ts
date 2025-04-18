import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { UpdateOrderStatusInput } from '@/app/lib/types';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: context.params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const body: UpdateOrderStatusInput = await request.json();

    const order = await prisma.order.update({
      where: { id: context.params.id },
      data: { status: body.status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
