'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import '../../styles/links.css';

export default function Header() {
  const { getCartItemsCount } = useCart();

  return (
    <header style={{
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e5e5',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <Link href="/" style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#000',
        textDecoration: 'none',
      }}>
        E-Commerce Store
      </Link>

      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/products" className="nav-link">
          Products
        </Link>
        <Link href="/cart" style={{
          color: '#666',
          textDecoration: 'none',
          fontSize: '1rem',
          position: 'relative',
          transition: 'color 0.2s',
        }} className="nav-link">
          Cart
          {getCartItemsCount() > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-12px',
              backgroundColor: '#ff4444',
              color: '#fff',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}>
              {getCartItemsCount()}
            </span>
          )}
        </Link>
        <Link href="/orders" className="nav-link">
          Orders
        </Link>
      </nav>
    </header>
  );
}

