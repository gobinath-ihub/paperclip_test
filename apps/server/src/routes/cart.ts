import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import prisma from '../db.js';

const router = Router();

// GET /api/cart
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: { items: { include: { product: true } } },
    });
    res.json(cart || { items: [] });
  } catch {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart (add item or set quantity)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { productId, quantity, set } = req.body;
  try {
    let cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.userId! } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: set ? quantity : existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    res.status(201).json({ message: 'Cart updated' });
  } catch {
    res.status(400).json({ error: 'Failed to update cart' });
  }
});

// DELETE /api/cart/:productId
router.delete('/:productId', authenticate, async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  if (!productId) return res.status(400).json({ error: 'Product ID required' });
  const pId = parseInt(productId as string);
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId: pId },
    });

    res.json({ message: 'Item removed from cart' });
  } catch {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// POST /api/cart/checkout
router.post('/checkout', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (user.country) {
      const vatRate = await prisma.vatRate.findUnique({
        where: { country: user.country },
      });
      if (vatRate) {
        total += total * vatRate.rate;
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        items: JSON.stringify(cart.items),
        total,
        status: 'COMPLETED',
      },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.json({ orderId: order.id });
  } catch {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

export default router;
