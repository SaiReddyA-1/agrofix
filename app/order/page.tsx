'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OrderForm } from '../components/forms/order-form';
import type { Product } from '.prisma/client';
import { CreateOrderInput } from '../lib/types';

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: CreateOrderInput) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const order = await response.json();
      alert('Order placed successfully!');
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Try Again</button>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Place an Order</h1>
      <OrderForm products={products} onSubmit={handleSubmit} />
    </div>
  );
}
