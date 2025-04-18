'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { CreateProductInput } from '@/app/lib/types';

interface ProductFormProps {
  onSubmit: (data: CreateProductInput) => Promise<void>;
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProductInput>();

  const handleFormSubmit = async (data: CreateProductInput) => {
    try {
      setLoading(true);
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Failed to submit product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          step="0.01"
          {...register('price', {
            required: 'Price is required',
            min: { value: 0.01, message: 'Price must be greater than 0' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          {...register('stock', {
            required: 'Stock is required',
            min: { value: 0, message: 'Stock cannot be negative' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.stock && (
          <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          {...register('image')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding...' : 'Add Product'}
      </Button>
    </form>
  );
}
