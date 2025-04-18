const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Delete existing products
  await prisma.product.deleteMany();

  // Create sample products
  const products = [
    {
      name: 'Fresh Tomatoes',
      description: 'Ripe and juicy tomatoes, perfect for salads',
      price: 2.99,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
    },
    {
      name: 'Organic Potatoes',
      description: 'Farm-fresh organic potatoes',
      price: 3.49,
      stock: 150,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
    },
    {
      name: 'Green Apples',
      description: 'Crisp and sweet green apples',
      price: 4.99,
      stock: 80,
      image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2',
    },
    {
      name: 'Fresh Carrots',
      description: 'Locally grown organic carrots',
      price: 1.99,
      stock: 120,
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Sample products created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
