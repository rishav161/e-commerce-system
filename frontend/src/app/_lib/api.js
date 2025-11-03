/**
 * API Client for backend services
 */

import { env } from '@/config/env';

/**
 * Base API request function
 */
async function apiRequest(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Handle network errors (connection refused, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const urlObj = new URL(url);
      throw new Error(
        `Cannot connect to backend server at ${urlObj.origin}. ` +
        `Please make sure the backend service is running on port ${urlObj.port}. ` +
        `To start the backend, run: cd backend/product-order-service && npm run start:dev`
      );
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * Product Service API
 */
export const productAPI = {
  /**
   * Get all products
   */
  getProducts: () => apiRequest(`${env.PRODUCT_SERVICE_URL}/products`),

  /**
   * Get product by ID
   */
  getProduct: (id) => apiRequest(`${env.PRODUCT_SERVICE_URL}/products/${id}`),

  /**
   * Create product (admin)
   */
  createProduct: (data) =>
    apiRequest(`${env.PRODUCT_SERVICE_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update product (admin)
   */
  updateProduct: (id, data) =>
    apiRequest(`${env.PRODUCT_SERVICE_URL}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Delete product (admin)
   */
  deleteProduct: (id) =>
    apiRequest(`${env.PRODUCT_SERVICE_URL}/products/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Order Service API
 */
export const orderAPI = {
  /**
   * Get all orders
   */
  getOrders: () => apiRequest(`${env.PRODUCT_SERVICE_URL}/orders`),

  /**
   * Get order by ID
   */
  getOrder: (id) => apiRequest(`${env.PRODUCT_SERVICE_URL}/orders/${id}`),

  /**
   * Create order
   */
  createOrder: (data) =>
    apiRequest(`${env.PRODUCT_SERVICE_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Get orders by customer ID
   */
  getOrdersByCustomer: (customerId) =>
    apiRequest(`${env.PRODUCT_SERVICE_URL}/orders/customer/${customerId}`),
};

/**
 * Customer Service API
 */
export const customerAPI = {
  /**
   * Get all customers
   */
  getCustomers: () => apiRequest(`${env.CUSTOMER_SERVICE_URL}/customers`),

  /**
   * Get customer by ID
   */
  getCustomer: (id) => apiRequest(`${env.CUSTOMER_SERVICE_URL}/customers/${id}`),

  /**
   * Get customer by email
   */
  getCustomerByEmail: (email) =>
    apiRequest(`${env.CUSTOMER_SERVICE_URL}/customers/email/${email}`),

  /**
   * Create customer
   */
  createCustomer: (data) =>
    apiRequest(`${env.CUSTOMER_SERVICE_URL}/customers`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update customer
   */
  updateCustomer: (id, data) =>
    apiRequest(`${env.CUSTOMER_SERVICE_URL}/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Get customer orders
   */
  getCustomerOrders: (customerId) =>
    apiRequest(`${env.CUSTOMER_SERVICE_URL}/customers/${customerId}/orders`),
};

