import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';

const categories = [
  {
    id: 'men',
    name: 'Men',
    image:
      'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    link: '/catalog?category=men',
  },
  {
    id: 'women',
    name: 'Women',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    link: '/catalog?category=women',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    link: '/catalog?category=accessories',
  },
];

export const CategoryGrid: React.FC = () => {
  return (
    <section className="section categories-section">
      <div className="container">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link to={cat.link} key={cat.id} className="category-card">
              <img src={cat.image} alt={cat.name} />
              <div className="category-overlay">
                <span>{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
