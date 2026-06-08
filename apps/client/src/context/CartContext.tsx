import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { type CartItem as CartItemType } from '@fashionhub/shared';

interface CartContextType {
  cartCount: number;
  fetchCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode; token: string | null }> = ({
  children,
  token,
}) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    if (!token) {
      setCartCount((prev) => (prev === 0 ? 0 : 0));
      return;
    }
    try {
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const count = response.data.items.reduce(
        (acc: number, item: CartItemType) => acc + item.quantity,
        0
      );
      setCartCount(count);
    } catch (error) {
      console.error('Failed to fetch cart count', error);
    }
  }, [token]);

  useEffect(() => {
    const load = async () => {
      await fetchCartCount();
    };
    load();
  }, [fetchCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
