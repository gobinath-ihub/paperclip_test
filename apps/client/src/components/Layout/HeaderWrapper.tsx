import React from 'react';
import { Header } from './Header';
import { useCart } from '../../context/CartContext';

interface HeaderWrapperProps {
  token: string | null;
  user: { email: string; role?: string } | null;
  onLogout: () => void;
}

export const HeaderWrapper: React.FC<HeaderWrapperProps> = ({ token, user, onLogout }) => {
  const { cartCount } = useCart();
  return <Header token={token} user={user} onLogout={onLogout} cartCount={cartCount} />;
};
