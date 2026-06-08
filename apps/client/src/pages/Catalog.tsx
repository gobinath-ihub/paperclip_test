import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { type Product, type Category } from '@fashionhub/shared';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './Catalog.css';

export const Catalog: React.FC<{ token: string | null }> = ({ token }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const currentCategory = queryParams.get('category');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch {
      console.error('Failed to fetch categories');
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let categoryId = '';
      if (currentCategory) {
        const cat = categories.find((c) => c.name.toLowerCase() === currentCategory.toLowerCase());
        if (cat) categoryId = cat.id.toString();
      }

      const response = await axios.get(
        `/api/products${categoryId ? `?categoryId=${categoryId}` : ''}`
      );
      setProducts(response.data);
    } catch {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [currentCategory, categories]);

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };
    loadCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts();
    };
    loadProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (productId: number) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        '/api/cart',
        { productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCartCount();
      alert('Product added to cart!');
    } catch {
      console.error('Failed to add to cart');
    }
  };

  return (
    <div className="container section fade-in">
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <h3>Categories</h3>
          <ul>
            <li className={!currentCategory ? 'active' : ''}>
              <button onClick={() => navigate('/catalog')}>All Products</button>
            </li>
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={
                  currentCategory?.toLowerCase() === cat.name.toLowerCase() ? 'active' : ''
                }
              >
                <button onClick={() => navigate(`/catalog?category=${cat.name.toLowerCase()}`)}>
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="catalog-main">
          <header className="catalog-header">
            <h2>{currentCategory ? currentCategory : 'All Products'}</h2>
            <p>{products.length} products found</p>
          </header>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={(id) => navigate(`/product/${id}`)}
                />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="no-products">
              <p>No products found in this category.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
