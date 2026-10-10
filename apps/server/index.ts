import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './src/routes/auth.js';
import cartRoutes from './src/routes/cart.js';
import adminRoutes from './src/routes/admin.js';
import externalRoutes from './src/routes/external.js';
import prisma from './src/db.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/v1/external', externalRoutes);

app.get('/', (req, res) => {
  res.send('FashionHub API is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Products endpoint
app.get('/api/products', async (req, res) => {
  const { categoryId, search } = req.query;
  try {
    console.log('Fetching products...');
    const products = await prisma.product.findMany({
      where: {
        AND: [
          categoryId ? { categoryId: Number(categoryId) } : {},
          search
            ? {
                OR: [
                  { name: { contains: String(search) } },
                  { description: { contains: String(search) } },
                ],
              }
            : {},
        ],
      },
      include: { category: true },
    });
    res.json(products);
  } catch {
    console.error('Error fetching products');
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
