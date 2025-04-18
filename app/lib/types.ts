import type { Product, Order, OrderStatus } from '.prisma/client';

export type ProductWithoutDates = Omit<Product, 'createdAt' | 'updatedAt'>;
export type OrderWithoutDates = Omit<Order, 'createdAt' | 'updatedAt'>;

export interface CreateOrderInput {
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;
