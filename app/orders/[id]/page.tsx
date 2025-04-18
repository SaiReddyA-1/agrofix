import { prisma } from '@/app/lib/prisma';
import type { OrderItem, OrderStatus } from '.prisma/client';
import { formatPrice } from '@/app/lib/utils';
import { notFound } from 'next/navigation';

interface OrderPageProps {
  params: {
    id: string;
  };
}

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return order;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const order = await getOrder(params.id);

  const statusColors: Record<OrderStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Order ID</h2>
              <p className="mt-1 font-mono">{order.id}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Status</h2>
              <p className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status as OrderStatus]}`}>
                {order.status}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Customer</h2>
              <p className="mt-1">{order.buyerName}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Contact</h2>
              <p className="mt-1">{order.buyerContact}</p>
            </div>
            <div className="col-span-2">
              <h2 className="text-sm font-medium text-gray-500">Delivery Address</h2>
              <p className="mt-1">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: OrderItem & { product: { name: string } }) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {formatPrice(item.price)}
                  </p>
                </div>
                <p className="font-medium">
                  {formatPrice(item.quantity * item.price)}
                </p>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <p className="font-medium">Total</p>
                <p className="font-bold">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
