import { prisma } from './lib/prisma';

import { ProductCard } from './components/products/product-card';

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  });
  // Convert Decimal price to number
  return products.map(p => ({
    ...p,
    price: Number(p.price),
  }));
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-gradient-to-br from-green-50 to-white min-h-screen pb-12">
      <section className="py-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-4">Fresh from Farm to You</h1>
        <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">Order the freshest vegetables and fruits in bulk, delivered straight from local farms. Quality you can trust, prices you&apos;ll love.</p>
      </section>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, price: Number(product.price) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
