'use client';
import Image from 'next/image';
import type { Product } from '.prisma/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { formatPrice } from '@/app/lib/utils';

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-green-200 transition-shadow border border-green-100">
      <div className="relative h-48 w-full">
        <Image
          src={product.image || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover rounded-t-2xl"
        />
      </div>
      <CardHeader className="pb-0">
        <CardTitle className="text-green-700 text-lg font-bold mb-1">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-0">
        <p className="text-sm text-gray-600 mb-2 min-h-[40px]">{product.description}</p>
        <p className="text-xl font-extrabold text-green-700 mt-2 mb-1">{formatPrice(product.price)}</p>
        <p className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.stock} in stock</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={() => onAddToCart?.(product)}
          disabled={product.stock === 0}
          className={`w-full rounded-full font-semibold ${product.stock === 0 ? 'bg-gray-300 text-gray-500' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
