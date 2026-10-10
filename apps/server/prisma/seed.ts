import prisma from '../src/db.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@fashionhub.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      country: 'USA',
    },
  });

  await prisma.vatRate.createMany({
    data: [
      { country: 'FRA', rate: 0.20 },
      { country: 'DEU', rate: 0.19 },
    ],
  });

  const men = await prisma.category.create({
    data: { name: 'Men' },
  });

  const women = await prisma.category.create({
    data: { name: 'Women' },
  });

  const accessories = await prisma.category.create({
    data: { name: 'Accessories' },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Classic White Tee',
        description:
          'A timeless classic for every wardrobe. Made from 100% premium cotton for maximum comfort.',
        price: 25.0,
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoryId: men.id,
      },
      {
        name: 'Denim Jacket',
        description:
          'Rugged yet stylish denim jacket, perfect for layering during transitional seasons.',
        price: 85.0,
        image:
          'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoryId: men.id,
      },
      {
        name: 'Slim Fit Chinos',
        description: 'Versatile chinos that transition perfectly from office to evening outings.',
        price: 55.0,
        image:
          'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoryId: men.id,
      },
      {
        name: 'Floral Summer Dress',
        description:
          'Light and airy dress for sunny days. Features a beautiful floral pattern and flattering silhouette.',
        price: 45.0,
        image:
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoryId: women.id,
      },
      {
        name: 'Silk Blouse',
        description:
          'Elegant silk blouse with a soft sheen. A sophisticated addition to any professional wardrobe.',
        price: 75.0,
        image:
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoryId: women.id,
      },
      {
        name: 'High-Waisted Jeans',
        description:
          'Classic high-waisted jeans with a modern fit. Durable denim that stays comfortable all day.',
        price: 65.0,
        image:
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoryId: women.id,
      },
      {
        name: 'Leather Watch',
        description:
          'Elegant leather watch for any occasion. Features a minimal dial and genuine leather strap.',
        price: 120.0,
        image:
          'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoryId: accessories.id,
      },
      {
        name: 'Sunglasses',
        description:
          'Classic aviator-style sunglasses with polarized lenses for superior eye protection.',
        price: 35.0,
        image:
          'https://images.unsplash.com/photo-1511499767350-a1590fdb2e47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoryId: accessories.id,
      },
      {
        name: 'Leather Tote Bag',
        description: 'Spacious leather tote bag. Ideal for carrying daily essentials with style.',
        price: 150.0,
        image:
          'https://images.unsplash.com/photo-1544816153-12ad58913969?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoryId: accessories.id,
      },
    ],
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
