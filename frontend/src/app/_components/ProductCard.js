'use client';

import { useCart } from './CartProvider';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div style={{
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: '#000',
        }}>
          {product.name}
        </h3>
        <p style={{
          color: '#666',
          fontSize: '0.9rem',
          marginBottom: '1rem',
          minHeight: '40px',
        }}>
          {product.description || 'No description available'}
        </p>
        <p style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#2563eb',
          marginBottom: '1rem',
        }}>
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
      <button
        onClick={handleAddToCart}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (e.target) e.target.style.backgroundColor = '#1d4ed8';
        }}
        onMouseLeave={(e) => {
          if (e.target) e.target.style.backgroundColor = '#2563eb';
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

