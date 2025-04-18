"use client";
import * as React from 'react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { CheckCircleIcon, XCircleIcon, ClockIcon, TruckIcon } from '@heroicons/react/24/solid';

interface OrderItem {
  id: string;
  product: { name: string };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: keyof typeof statusMap;
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
  totalAmount: number;
  items: OrderItem[];
}

const statusMap: Record<string, { color: string; label: string; icon: JSX.Element }> = {
  PENDING: {
    color: 'text-yellow-600',
    label: 'Pending',
    icon: <ClockIcon className="h-6 w-6 text-yellow-400" />,
  },
  IN_PROGRESS: {
    color: 'text-blue-600',
    label: 'In Progress',
    icon: <TruckIcon className="h-6 w-6 text-blue-400" />,
  },
  DELIVERED: {
    color: 'text-green-600',
    label: 'Delivered',
    icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  },
  CANCELLED: {
    color: 'text-red-600',
    label: 'Cancelled',
    icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
  },
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data as Order);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Order not found');
      } else {
        setError('Order not found');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-extrabold text-green-700 mb-6 flex items-center gap-2">
          <TruckIcon className="h-8 w-8 text-green-500" /> Track Your Order
        </h1>
        <form onSubmit={handleTrack} className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderId(e.target.value)}
            className="flex-1 border border-green-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
            required
          />
          <Button type="submit" disabled={loading || !orderId} className="bg-green-600 hover:bg-green-700">
            Track
          </Button>
        </form>
        {error && <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2"><XCircleIcon className="h-5 w-5" /> {error}</div>}
        {!loading && !error && !order && <div className="mb-4 text-gray-500 text-center">Enter your order ID to track your order.</div>}
        {loading && <div className="mb-4 text-gray-500 text-center">Loading...</div>}
        {order && (
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <div className="flex items-center gap-3 mb-4">
              {statusMap[order.status]?.icon}
              <span className={`font-bold text-lg ${statusMap[order.status]?.color}`}>{statusMap[order.status]?.label}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500">Name</div>
                <div className="font-medium">{order.buyerName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Contact</div>
                <div>{order.buyerContact}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-gray-500">Delivery Address</div>
                <div>{order.deliveryAddress}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-gray-500">Total Amount</div>
                <div className="font-bold text-green-700">₹{order.totalAmount}</div>
              </div>
            </div>
            <h3 className="font-semibold mt-4 mb-2">Items</h3>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item: OrderItem) => (
                <li key={item.id} className="py-2 flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span className="text-gray-500">₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
