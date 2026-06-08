import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { type Product } from '@fashionhub/shared';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
  onViewDetails: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  return (
    <div className="product-card fade-in">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-actions">
          <button
            className="action-btn"
            onClick={() => onAddToCart(product.id)}
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
          <button
            className="action-btn"
            onClick={() => onViewDetails(product.id)}
            title="View Details"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>
      <div className="product-info">
        <p className="product-category">{product.category?.name}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};
