import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

interface CheckoutProps {
  token: string;
}

export const Checkout: React.FC<CheckoutProps> = ({ token }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/cart/checkout', { address: `${address}, ${city}, ${zip}` }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCartCount();
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || 'Checkout failed');
    }
  };

  if (success) {
    return (
      <div className="container section success-checkout fade-in">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with FashionHub. Your order is being processed.</p>
        <p>Redirecting you to the home page...</p>
      </div>
    );
  }

  return (
    <div className="container section fade-in">
      <h1 className="section-title">Checkout</h1>
      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Shipping Information</h3>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="123 Fashion St"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="New York"
              />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
                placeholder="10001"
              />
            </div>
          </div>

          <h3>Payment Method</h3>
          <p className="payment-note">Credit Card (Demo Mode)</p>
          <div className="form-group">
            <label>Card Number</label>
            <input type="text" placeholder="XXXX XXXX XXXX XXXX" disabled defaultValue="4242 4242 4242 4242" />
          </div>

          <button type="submit" className="btn btn-accent checkout-submit">Place Order</button>
        </form>
      </div>
    </div>
  );
};
