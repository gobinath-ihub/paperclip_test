import React from 'react';
import { Header } from './Header';
import { useCart } from '../../context/CartContext';

interface HeaderWrapperProps {
  token: string | null;
  onLogout: () => void;
}

export const HeaderWrapper: React.FC<HeaderWrapperProps> = ({ token, onLogout }) => {
  const { cartCount } = useCart();
  return <Header token={token} onLogout={onLogout} cartCount={cartCount} />;
};
