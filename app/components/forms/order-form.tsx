import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Product } from '.prisma/client';
import { Button } from '../ui/button';
import Image from 'next/image';
import { formatPrice } from '@/app/lib/utils';
import { CreateOrderInput } from '@/app/lib/types';

interface OrderFormProps {
  products: Product[];
  onSubmit: (data: CreateOrderInput) => Promise<void>;
}

interface OrderItem {
  productId: string;
  quantity: number;
  product: Product;
}

export function OrderForm({ products, onSubmit }: OrderFormProps) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateOrderInput>();

  const addToCart = (product: Product) => {
    const existingItem = items.find(item => item.productId === product.id);
    if (existingItem) {
      setItems(items.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setItems([...items, { productId: product.id, quantity: 1, product }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems(items.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const onSubmitForm = async (formData: Omit<CreateOrderInput, 'items'>) => {
    if (items.length === 0) {
      alert('Please add items to your cart');
      return;
    }
    await onSubmit({
      ...formData,
      items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    });
    setItems([]);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-3xl shadow-2xl border border-green-100 transition-transform hover:-translate-y-1 hover:shadow-green-200 flex flex-col items-center relative group"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              {product.image ? (
                <Image src={product.image} alt={product.name} fill className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-300 text-4xl">🥕</span>
              )}
            </div>
            <h3 className="font-bold text-xl text-green-800 mb-1 text-center group-hover:text-green-900 transition">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-2 text-center min-h-[40px]">{product.description}</p>
            <p className="font-bold text-green-700 text-2xl mb-4">{formatPrice(product.price)}</p>
            <Button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold shadow-md transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-xl mt-10">
          <h2 className="text-2xl font-bold mb-6 text-green-700">🛒 Your Order</h2>
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {item.product.image ? (
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-gray-300 text-2xl">🥕</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-xs text-gray-500">{formatPrice(item.product.price)} each</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold bg-gray-50 hover:bg-green-100 transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold bg-gray-50 hover:bg-green-100 transition"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-2 px-3 py-1 rounded bg-red-100 text-red-600 font-medium hover:bg-red-200 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-6 border-t">
              <p className="text-xl font-bold text-right text-green-700">Total: {formatPrice(calculateTotal())}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  {...register('buyerName', { required: true })}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm"
                  placeholder="Your Name"
                />
                {errors.buyerName && (
                  <p className="mt-1 text-sm text-red-600">Name is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  {...register('buyerContact', { required: true })}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm"
                  placeholder="Phone Number"
                />
                {errors.buyerContact && (
                  <p className="mt-1 text-sm text-red-600">Contact number is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  {...register('deliveryAddress', { required: true })}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm"
                  placeholder="Full Delivery Address"
                />
                {errors.deliveryAddress && (
                  <p className="mt-1 text-sm text-red-600">Delivery address is required</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg py-3 text-lg transition">
                Place Order
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
