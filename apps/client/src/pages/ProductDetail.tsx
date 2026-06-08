import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { type Product } from '@fashionhub/shared';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export const ProductDetail: React.FC<{ token: string | null }> = ({ token }) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products`);
        const found = response.data.find((p: Product) => p.id === Number(id));
        setProduct(found);
      } catch {
        console.error('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        '/api/cart',
        { productId: product?.id, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCartCount();
      alert('Added to cart!');
    } catch {
      console.error('Failed to add to cart');
    }
  };

  if (loading) return <div className="container section">Loading product...</div>;
  if (!product) return <div className="container section">Product not found.</div>;

  return (
    <div className="container section fade-in">
      <button onClick={() => navigate(-1)} className="back-link">
        <ArrowLeft size={16} /> Back to Shop
      </button>

      <div className="product-detail-grid">
        <div className="product-gallery">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info-column">
          <p className="detail-category">{product.category?.name}</p>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>

          <div className="detail-description">
            <p>{product.description}</p>
          </div>

          <div className="size-selector">
            <p className="selector-label">Select Size</p>
            <div className="size-options">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn btn-accent add-cart-large" onClick={handleAddToCart}>
              <ShoppingCart size={20} style={{ marginRight: '10px' }} />
              Add to Bag
            </button>
            <button className="wishlist-btn">
              <Heart size={24} />
            </button>
          </div>

          <div className="product-perks">
            <div className="perk">
              <Truck size={20} />
              <span>Free Worldwide Shipping</span>
            </div>
            <div className="perk">
              <RefreshCw size={20} />
              <span>30-Day Easy Returns</span>
            </div>
            <div className="perk">
              <ShieldCheck size={20} />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
