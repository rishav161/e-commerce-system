/**
 * Environment configuration
 * Access environment variables with defaults
 */

export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  PRODUCT_SERVICE_URL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3001',
  CUSTOMER_SERVICE_URL: process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_URL || 'http://localhost:3002',
};
