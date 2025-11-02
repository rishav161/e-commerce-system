import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';

// Load environment variables
dotenv.config();

const getDataSourceConfig = () => {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    // Extract and decode password - ensure it's always a string
    let password = url.password || '';
    if (password) {
      try {
        password = decodeURIComponent(password);
      } catch (e) {
        password = url.password || '';
      }
    }
    const finalPassword = String(password || '');
    
    // For cloud databases (like Render.com), use public schema
    const isCloudDatabase = url.hostname.includes('render.com') || 
                           url.hostname.includes('.amazonaws.com') ||
                           url.hostname.includes('.cloud') ||
                           url.hostname.includes('heroku.com');
    const schemaName = isCloudDatabase ? 'public' : 'product_order';
    
    // Check if SSL is required
    const requiresSSL = url.hostname.includes('render.com') || 
                       url.searchParams.get('sslmode') === 'require' ||
                       url.searchParams.get('ssl') === 'true';
    
    return {
      type: 'postgres' as const,
      host: url.hostname,
      port: parseInt(url.port || '5432'),
      username: decodeURIComponent(url.username || ''),
      password: finalPassword,
      database: url.pathname.slice(1),
      schema: schemaName,
      entities: [Product],
      synchronize: false,
      ssl: requiresSSL ? {
        rejectUnauthorized: false,
      } : false,
    };
  }
  
  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'product_order_db',
    schema: 'product_order',
    entities: [Product],
    synchronize: false,
  };
};

const AppDataSource = new DataSource(getDataSourceConfig());

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    const productRepository = AppDataSource.getRepository(Product);

    // Clear existing products
    await productRepository.clear();

    // Seed products
    const products = [
      {
        name: 'Laptop',
        description: 'High-performance laptop for work and gaming',
        price: 1299.99,
        stock: 50,
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features',
        price: 899.99,
        stock: 100,
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation',
        price: 249.99,
        stock: 75,
      },
      {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking',
        price: 399.99,
        stock: 60,
      },
      {
        name: 'Tablet',
        description: '10-inch tablet perfect for reading and browsing',
        price: 499.99,
        stock: 40,
      },
      {
        name: 'Camera',
        description: 'Professional DSLR camera for photography',
        price: 1599.99,
        stock: 30,
      },
      {
        name: 'Gaming Console',
        description: 'Latest gaming console with 4K support',
        price: 499.99,
        stock: 25,
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with excellent sound quality',
        price: 79.99,
        stock: 90,
      },
    ];

    await productRepository.save(products);
    console.log('Products seeded successfully!');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();

