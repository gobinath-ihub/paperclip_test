import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">FashionHub</h3>
          <p>
            Your destination for premium fashion and lifestyle. We define modern elegance through
            curated collections and timeless style.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/catalog">Shop All</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/shipping">Shipping Policy</Link>
            </li>
            <li>
              <Link to="/returns">Returns</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li>Email: hello@fashionhub.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Fashion Ave, NY</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to get special offers and updates.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button className="btn btn-accent">Join</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FashionHub. All rights reserved.</p>
      </div>
    </footer>
  );
};
