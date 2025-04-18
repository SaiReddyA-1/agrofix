'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      router.push(`/orders/${orderId}`);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" className="w-full">
            Track Order
          </Button>
        </form>
      </div>
    </div>
  );
}
