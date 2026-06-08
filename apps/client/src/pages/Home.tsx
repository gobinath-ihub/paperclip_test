import React from 'react';
import { Hero } from '../components/Home/Hero';
import { CategoryGrid } from '../components/Home/CategoryGrid';

export const Home: React.FC = () => {
  return (
    <main className="home-page">
      <Hero />
      <CategoryGrid />
      
      <section className="section featured-products">
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Check out our latest collection of premium apparel and accessories.
          </p>
          {/* We'll add featured products here later */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn btn-outline">View All Products</button>
          </div>
        </div>
      </section>

      <section className="section promo-banner" style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', color: 'var(--accent-color)' }}>Summer Sale</h2>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Up to 50% Off on Selected Items</p>
          <button className="btn btn-accent">Shop Sale</button>
        </div>
      </section>
    </main>
  );
};
