'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { orderAPI } from '@/app/_lib/api';
import Link from 'next/link';

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // If orderId is provided, fetch specific order, otherwise fetch all orders
      if (orderId) {
        try {
          const order = await orderAPI.getOrder(orderId);
          setOrders([order]);
        } catch (err) {
          // If specific order not found, fetch all orders
          const data = await orderAPI.getOrders();
          setOrders(data || []);
        }
      } else {
        const data = await orderAPI.getOrders();
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <p style={{ fontSize: '1.2rem', color: '#dc2626' }}>Error: {error}</p>
        <button
          onClick={fetchOrders}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Retry
        </button>
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#000',
          }}>
            Order History
          </h1>
          <Link
            href="/products"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
              No orders found.
            </p>
            <Link
              href="/products"
              style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  padding: '2rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px solid #e5e5e5',
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#000',
                      marginBottom: '0.5rem',
                    }}>
                      Order #{order.id}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#666',
                    }}>
                      Placed on {formatDate(order.createdAt || order.created_at)}
                    </p>
                  </div>
                  <div style={{
                    textAlign: 'right',
                  }}>
                    <p style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#2563eb',
                    }}>
                      ${Number(order.totalAmount || order.total_amount || 0).toFixed(2)}
                    </p>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#666',
                      marginTop: '0.25rem',
                    }}>
                      {order.status || 'Completed'}
                    </p>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div style={{
                    marginBottom: '1.5rem',
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '1rem',
                      color: '#333',
                    }}>
                      Items:
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}>
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            backgroundColor: '#fafafa',
                            borderRadius: '6px',
                          }}
                        >
                          <div>
                            <p style={{
                              fontSize: '1rem',
                              fontWeight: '500',
                              color: '#000',
                              marginBottom: '0.25rem',
                            }}>
                              {item.productName || item.product_name}
                            </p>
                            <p style={{
                              fontSize: '0.9rem',
                              color: '#666',
                            }}>
                              Quantity: {item.quantity} × ${Number(item.price || 0).toFixed(2)}
                            </p>
                          </div>
                          <p style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#000',
                          }}>
                            ${(Number(item.quantity || 0) * Number(item.price || 0)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.shippingAddress && (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                  }}>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#666',
                      marginBottom: '0.5rem',
                    }}>
                      <strong>Shipping Address:</strong>
                    </p>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#333',
                    }}>
                      {order.shippingAddress || order.shipping_address}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

