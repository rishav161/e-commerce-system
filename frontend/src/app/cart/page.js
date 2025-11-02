'use client';

import { useCart } from '@/app/_components/CartProvider';
import Link from 'next/link';
import '../../styles/links.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0;
    updateQuantity(productId, quantity);
  };

  if (cart.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>
          Your Cart is Empty
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Start adding products to your cart!
        </p>
        <Link
          href="/products"
          className="primary-link"
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          color: '#000',
        }}>
          Shopping Cart
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '2rem',
        }}>
          {/* Cart Items */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  padding: '1.5rem 0',
                  borderBottom: '1px solid #e5e5e5',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#000',
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#2563eb',
                    marginBottom: '1rem',
                  }}>
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                    color: '#666',
                  }}>
                    Qty:
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      style={{
                        width: '60px',
                        padding: '0.5rem',
                        border: '1px solid #e5e5e5',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        textAlign: 'center',
                      }}
                    />
                  </label>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dc2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: 'fit-content',
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#000',
            }}>
              Order Summary
            </h2>

            <div style={{
              marginBottom: '1.5rem',
            }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    fontSize: '1rem',
                    color: '#666',
                  }}
                >
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '2px solid #e5e5e5',
              paddingTop: '1rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#000',
              }}>
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="button-link"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

