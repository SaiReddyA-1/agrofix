import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { CreateOrderInput } from '@/app/lib/types';
import { calculateOrderTotal } from '@/app/lib/utils';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderInput = await request.json();

    // Fetch products to get their prices
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: body.items.map((item) => item.productId),
        },
      },
    });

    // Create order items with prices
    const orderItems = body.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const totalAmount = calculateOrderTotal(orderItems);

    const order = await prisma.order.create({
      data: {
        buyerName: body.buyerName,
        buyerContact: body.buyerContact,
        deliveryAddress: body.deliveryAddress,
        totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
