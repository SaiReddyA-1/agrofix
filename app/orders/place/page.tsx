"use client";

import { useState, useEffect } from "react";
import { OrderForm } from "@/app/components/forms/order-form";
import type { Product } from ".prisma/client";

export default function PlaceOrderPage() {
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchProducts(): Promise<void> {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch products");
        } else {
          setError("Failed to fetch products");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-10 px-2">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Place Bulk Order</h1>
        {loading ? (
          <div className="text-center text-gray-600">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : success ? (
          <div className="text-center text-green-700">
            <div className="text-2xl mb-4 font-bold">Order Placed!</div>
            <div>Your order ID is <span className="font-mono text-green-900">{orderId}</span></div>
            <div className="mt-4">Thank you for your order. We will contact you soon.</div>
          </div>
        ) : (
          <OrderForm
            products={products}
            onSuccess={(id: string) => {
              setSuccess(true);
              setOrderId(id);
            }}
          />
        )}
      </div>
    </div>
  );
}
