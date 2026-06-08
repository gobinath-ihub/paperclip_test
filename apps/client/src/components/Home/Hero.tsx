import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-content fade-in">
        <h1>Define Your Style</h1>
        <p>
          Discover the latest trends in high-end fashion and elevate your wardrobe with our curated
          collections.
        </p>
        <Link to="/catalog" className="btn btn-accent">
          Shop Collection
        </Link>
      </div>
    </section>
  );
};
