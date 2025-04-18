"use client";
import { useState, useEffect, useCallback } from "react";
import { formatPrice } from '@/app/lib/utils';

const ORDER_STATUSES = ["PENDING", "IN_PROGRESS", "DELIVERED", "CANCELLED"];

export default function AdminOrders() {
  interface OrderItem {
    id: string;
    product: { name: string };
    quantity: number;
    price: number;
  }
  interface Order {
    id: string;
    buyerName: string;
    buyerContact: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
  }
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data as Order[]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch orders");
      } else {
        setError("Failed to fetch orders");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchOrders();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update status");
      } else {
        setError("Failed to update status");
      }
    } finally {
      setUpdating(null);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); 

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pb-12">
      <h1 className="text-4xl font-extrabold text-green-700 mb-10 text-center">Orders</h1>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4">
        <table className="min-w-full rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-6 py-3 text-left text-sm font-bold">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Items</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Total</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Status</th>
              <th className="px-6 py-3 text-right text-sm font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-none hover:bg-green-50 transition">
                <td className="px-6 py-4 font-mono text-xs text-gray-700 max-w-[120px] truncate">{order.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-green-700">{order.buyerName}</div>
                    <div className="text-xs text-gray-500">{order.buyerContact}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-600">
                    {order.items.map((item: OrderItem) => (
                      <div key={item.id}>
                        {item.quantity}x {item.product.name}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-green-700">{formatPrice(order.totalAmount)}</td>
                <td className="px-6 py-4">
                  <select
                    className="border border-green-300 rounded px-2 py-1 bg-green-50 focus:ring-2 focus:ring-green-300 text-green-700 font-semibold"
                    value={order.status}
                    disabled={updating === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>{status.replace('_', ' ')}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  {updating === order.id && <span className="text-xs text-blue-600">Updating...</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
