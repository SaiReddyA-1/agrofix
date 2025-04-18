"use client";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  items: { product: { name: string }; quantity: number; price: number }[];
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/user-orders");
        if (!res.ok) throw new Error("Failed to fetch order history");
        const data = await res.json();
        setOrders(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch order history");
        } else {
          setError("Failed to fetch order history");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-extrabold text-green-700 mb-10 text-center tracking-tight drop-shadow">Order History</h1>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-600">{error as string}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="text-gray-500">No orders found.</div>
      )}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusColors: Record<string, string> = {
              PENDING: 'bg-yellow-100 text-yellow-800',
              IN_PROGRESS: 'bg-blue-100 text-blue-800',
              DELIVERED: 'bg-green-100 text-green-800',
              CANCELLED: 'bg-red-100 text-red-800',
            };
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-10 transition-transform hover:scale-[1.01] hover:shadow-2xl duration-200"
                style={{ boxShadow: '0 4px 24px 0 rgba(16, 185, 129, 0.08)' }}
              >
                <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-green-50/80 to-white">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-6 items-center mb-2">
                      <div>
                        <div className="text-xs text-gray-400">Order ID</div>
                        <a
                          href={`/orders/${order.id}`}
                          className="font-mono text-base text-green-700 hover:underline break-all"
                          title="View order details"
                        >
                          {order.id}
                        </a>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Status</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusColors[order.status]}`}>{order.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-10 text-sm text-gray-700">
                      <div>
                        <span className="font-semibold">Customer:</span> {order.buyerName}
                      </div>
                      <div>
                        <span className="font-semibold">Contact:</span> {order.buyerContact}
                      </div>
                      <div>
                        <span className="font-semibold">Address:</span> {order.deliveryAddress}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Placed on {new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-end min-w-[120px] mt-2 md:mt-0">
                    <span className="text-lg font-bold text-green-700">₹{order.totalAmount}</span>
                    <span className="text-xs text-gray-400">Total</span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50/60">
                  <h3 className="font-semibold mb-2 text-gray-700 text-base">Order Items</h3>
                  <div className="divide-y divide-gray-200">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2">
                        <div>
                          <span className="font-medium text-gray-800">{item.product.name}</span>
                          <span className="ml-2 text-xs text-gray-500">x {item.quantity}</span>
                        </div>
                        <div className="text-sm text-gray-700">₹{(item.quantity * item.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
