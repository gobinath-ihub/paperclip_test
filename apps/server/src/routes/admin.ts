import { Router, Response } from 'express';
import { authenticate, authorizeAdmin, AuthRequest } from '../middleware/auth.js';
import prisma from '../db.js';

const router = Router();

// Middleware to ensure all admin routes are authenticated and authorized
router.use(authenticate, authorizeAdmin);

// --- Product Management ---

// GET /api/admin/products
router.get('/products', async (req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/admin/products
router.post('/products', async (req: AuthRequest, res: Response) => {
  const { name, description, price, image, categoryId } = req.body;
  try {
    const product = await prisma.product.create({
      data: { name, description, price, image, categoryId },
    });
    res.status(201).json(product);
  } catch {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, price, image, categoryId } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, description, price, image, categoryId },
    });
    res.json(product);
  } catch {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch {
    res.status(400).json({ error: 'Failed to delete product' });
  }
});

// --- Order Management ---

// GET /api/admin/orders
router.get('/orders', async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } } },
    });
    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/admin/orders/:id
router.patch('/orders/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(order);
  } catch {
    res.status(400).json({ error: 'Failed to update order status' });
  }
});

export default router;
