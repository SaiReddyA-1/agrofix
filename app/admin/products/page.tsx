'use client';

import { useState, useEffect } from 'react';

import type { Product } from '.prisma/client';
import { formatPrice } from '@/app/lib/utils';
import { ProductForm } from '@/app/components/forms/product-form';
import type { CreateProductInput } from '@/app/lib/types';

export default function AdminProducts() {
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleAddProduct = async (data: CreateProductInput) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      await fetchProducts();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  // Fetch products on component mount
  useEffect(() => {
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
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchProducts()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-2">
      <div className="max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-green-800 tracking-tight">Admin Products</h1>
          <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold shadow-md">
            {showForm ? 'Cancel' : 'Add Product'}
          </Button>
        </div>

        {showForm && (
          <div className="mb-8 bg-green-50 p-6 rounded-xl shadow-inner border border-green-100">
            <h2 className="text-xl font-bold mb-4 text-green-800">Add New Product</h2>
            <ProductForm onSubmit={handleAddProduct} />
          </div>
        )}

        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
          <table className="min-w-full text-base">
            <thead>
              <tr className="bg-green-100 border-b">
                <th className="px-6 py-3 text-left font-bold text-green-900">Name</th>
                <th className="px-6 py-3 text-left font-bold text-green-900">Price</th>
                <th className="px-6 py-3 text-left font-bold text-green-900">Stock</th>
                <th className="px-6 py-3 text-right font-bold text-green-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-400 text-lg">
                    No products found. Add some products to get started!
                  </td>
                </tr>
              ) : (
                products.map((product: Product, i: number) => (
                  <tr
                    key={product.id}
                    className={
                      `border-b transition-all duration-150 ${i % 2 === 0 ? 'bg-white' : 'bg-green-50'} hover:bg-green-100/60`
                    }
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-lg">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-gray-500">{product.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-green-700">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{product.stock}</td>
                    <td className="px-6 py-4 text-right flex gap-2 justify-end">
                      <Button variant="secondary" size="sm" className="bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200">Edit</Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-700 px-4"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
