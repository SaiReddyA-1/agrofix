import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Decimal } from '@prisma/client/runtime/library';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number | string | Decimal) => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericPrice);
};

export const calculateOrderTotal = (items: { price: number | string | Decimal; quantity: number }[]) => {
  return items.reduce((total, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price);
    return total + price * item.quantity;
  }, 0);
};

export const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};
