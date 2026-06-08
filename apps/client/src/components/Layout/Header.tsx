import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, LogOut } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  token: string | null;
  onLogout: () => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ token, onLogout, cartCount }) => {
  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo">FashionHub</Link>
        
        <nav className="desktop-nav">
          <ul>
            <li><Link to="/catalog">Shop</Link></li>
            <li><Link to="/catalog?category=men">Men</Link></li>
            <li><Link to="/catalog?category=women">Women</Link></li>
            <li><Link to="/catalog?category=accessories">Accessories</Link></li>
          </ul>
        </nav>

        <div className="header-icons">
          <button className="icon-btn"><Search size={20} /></button>
          <div className="user-menu">
            {token ? (
              <button className="icon-btn" onClick={onLogout} title="Logout">
                <LogOut size={20} />
              </button>
            ) : (
              <Link to="/login" className="icon-btn"><User size={20} /></Link>
            )}
          </div>
          <button className="icon-btn"><Heart size={20} /></button>
          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};
