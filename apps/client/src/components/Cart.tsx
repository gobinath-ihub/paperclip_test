import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { type Cart as CartType, type CartItem as CartItemType } from '@fashionhub/shared';
import './Cart.css';

interface CartProps {
  token: string;
}

export const Cart: React.FC<CartProps> = ({ token }) => {
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useCart();

  const fetchCart = React.useCallback(async () => {
    try {
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
    };
    loadCart();
  }, [fetchCart]);

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await axios.post(
        '/api/cart',
        { productId, quantity, set: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
      fetchCartCount();
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      await axios.delete(`/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
      fetchCartCount();
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  if (loading) return <div className="container section">Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container section empty-cart">
        <ShoppingBag size={64} color="#ccc" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link to="/catalog" className="btn btn-accent">
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (acc: number, item: CartItemType) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="container section fade-in">
      <h1 className="section-title">Your Shopping Bag</h1>
      <div className="cart-grid">
        <div className="cart-items-list">
          {cart.items.map((item: CartItemType) => (
            <div key={item.id} className="cart-item-row">
              <img src={item.product?.image} alt={item.product?.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.product?.name}</h3>
                <p className="item-price">${item.product?.price.toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="cart-item-total">
                <p>${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                <button className="remove-btn" onClick={() => removeItem(item.productId)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="summary-row total">
            <span>Estimated Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn btn-accent checkout-btn">
            Proceed to Checkout
          </Link>
          <p className="secure-checkout">🔒 Secure Checkout</p>
        </div>
      </div>
    </div>
  );
};
