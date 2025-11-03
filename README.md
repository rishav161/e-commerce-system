# E-Commerce System 🛒

A full-stack e-commerce application built with modern technologies, featuring microservices architecture, real-time messaging, and a responsive frontend.

## 📋 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Local Setup](#-local-setup)
- [Environment Configuration](#-environment-configuration)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 🚀 Features

- **Product Management**: Add, view, and manage products with pricing and inventory
- **Shopping Cart**: Add/remove items with persistent cart storage
- **Order Processing**: Complete checkout flow with order history
- **Customer Management**: User registration and order tracking
- **Real-time Communication**: RabbitMQ for inter-service messaging
- **Responsive Design**: Mobile-friendly React frontend
- **Database Integration**: PostgreSQL with TypeORM

## 🏗️ System Architecture

### Overview

This e-commerce system follows a microservices architecture pattern, consisting of three main components:

1. **Frontend Application** (Port 3000)
2. **Product & Order Service** (Port 3001)
3. **Customer Service** (Port 3002)

### Microservices Architecture

```
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────┐
│   Frontend      │────│  Product & Order     │────│   PostgreSQL    │
│   (Next.js)     │    │  Service (NestJS)    │    │   Database      │
└─────────────────┘    └──────────────────────┘    └─────────────────┘
         │                       │                           │
         │                       │                           │
         └───────────────────────┼───────────────────────────┘
                                 │
                    ┌──────────────────────┐
                    │  Customer Service    │
                    │  (NestJS)            │
                    └──────────────────────┘
                             │
                    ┌──────────────────────┐
                    │     RabbitMQ         │
                    │  Message Broker      │
                    └──────────────────────┘
```

### Service Responsibilities

#### Frontend Service (Port 3000)
- **Technology**: Next.js 15 with React
- **Responsibilities**:
  - User interface and user experience
  - Client-side routing and navigation
  - API communication with backend services
  - Shopping cart management (local storage)
  - Form handling and validation

#### Product & Order Service (Port 3001)
- **Technology**: NestJS with TypeScript
- **Responsibilities**:
  - Product catalog management (CRUD operations)
  - Order processing and management
  - Inventory tracking
  - Order-item relationships
  - Publishing order events to RabbitMQ

#### Customer Service (Port 3002)
- **Technology**: NestJS with TypeScript
- **Responsibilities**:
  - Customer data management
  - Customer-order relationship tracking
  - Consuming order events from RabbitMQ
  - Customer profile management

### Communication Patterns

#### REST API Communication
- Frontend ↔ Backend Services: HTTP REST APIs
- Synchronous request-response pattern
- JSON data format for all communications

#### Event-Driven Communication (RabbitMQ)
- **Order Created Event**: Product Service → Customer Service
  - When an order is placed, the Product Service publishes an "order_created" event
  - Customer Service consumes this event and creates a customer-order relationship record

#### Database Layer
- **PostgreSQL Database**: Single database shared by both backend services
- **TypeORM**: Object-Relational Mapping for type-safe database operations
- **Schema Separation**: Different tables for different services with proper relationships

## 🛠️ Tech Stack

### Backend Services
- **Framework**: NestJS (Node.js framework for scalable applications)
- **Language**: TypeScript (type-safe JavaScript)
- **Database ORM**: TypeORM
- **Message Broker**: RabbitMQ with amqplib
- **Database**: PostgreSQL
- **Validation**: class-validator & class-transformer

### Frontend Application
- **Framework**: Next.js 15 (React framework with App Router)
- **Language**: JavaScript
- **Styling**: CSS-in-JS (inline styles)
- **State Management**: React Context API
- **Routing**: Next.js App Router

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Process Manager**: npm scripts
- **Environment Management**: dotenv

## 📋 Prerequisites

Before running this application locally, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** database (local or cloud)
- **RabbitMQ** (optional, for local development) - [Download here](https://www.rabbitmq.com/download.html)

## 🚀 Local Setup

Follow these steps to set up and run the e-commerce system locally:

### 1. Clone the Repository
```bash
git clone https://github.com/rishav161/e-commerce-system.git
cd e-commerce-system
```

### 2. Install Dependencies

#### Backend Services
```bash
# Product & Order Service
cd backend/product-order-service
npm install

# Customer Service
cd ../customer-service
npm install
```

#### Frontend Application
```bash
cd ../../frontend
npm install
```

### 3. Environment Configuration

Create the necessary environment files (see [Environment Configuration](#environment-configuration) section below).

### 4. Start Services

#### Terminal 1: Product & Order Service
```bash
cd backend/product-order-service
npm run start:dev
```

#### Terminal 2: Customer Service
```bash
cd backend/customer-service
npm run start:dev
```

#### Terminal 3: Frontend Application
```bash
cd frontend
npm run dev
```

### 5. Seed Database (Optional)

Populate the database with sample data:
```bash
cd backend/product-order-service
npm run seed
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Product Service API**: http://localhost:3001
- **Customer Service API**: http://localhost:3002

## 🔧 Environment Configuration

### Backend Services

Create `.env` files in each backend service directory:

#### `backend/product-order-service/.env`
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db

# RabbitMQ Configuration (optional for local development)
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_EXCHANGE=ecommerce_exchange
RABBITMQ_ROUTING_KEY=order_created

# Service Configuration
PORT=3001
NODE_ENV=development
```

#### `backend/customer-service/.env`
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db

# RabbitMQ Configuration (optional for local development)
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_EXCHANGE=ecommerce_exchange
RABBITMQ_ROUTING_KEY=order_created
RABBITMQ_QUEUE=customer_order_queue

# Service Configuration
PORT=3002
NODE_ENV=development
```

### Frontend Application

Create `.env.local` in the frontend directory:

#### `frontend/.env.local`
```env
# API Endpoints
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_CUSTOMER_SERVICE_URL=http://localhost:3002

# Development Configuration
NODE_ENV=development
```

## 📡 API Documentation

### Base URLs
- **Product & Order Service**: `http://localhost:3001`
- **Customer Service**: `http://localhost:3002`

### Product Service Endpoints

#### GET `/products`
Get all products with pagination.

**Response Format:**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop for work and gaming",
    "price": 1299.99,
    "stock": 50,
    "createdAt": "2025-11-02T12:55:24.961Z",
    "updatedAt": "2025-11-02T12:55:24.961Z"
  }
]
```

**Example:**
```bash
curl -X GET http://localhost:3001/products
```

#### GET `/products/:id`
Get a specific product by ID.

**Parameters:**
- `id` (number): Product ID

**Response Format:**
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop for work and gaming",
  "price": 1299.99,
  "stock": 50,
  "createdAt": "2025-11-02T12:55:24.961Z",
  "updatedAt": "2025-11-02T12:55:24.961Z"
}
```

**Example:**
```bash
curl -X GET http://localhost:3001/products/1
```

#### POST `/products`
Create a new product.

**Request Body:**
```json
{
  "name": "Wireless Headphones",
  "description": "Premium wireless headphones with noise cancellation",
  "price": 249.99,
  "stock": 75
}
```

**Response Format:**
```json
{
  "id": 3,
  "name": "Wireless Headphones",
  "description": "Premium wireless headphones with noise cancellation",
  "price": 249.99,
  "stock": 75,
  "createdAt": "2025-11-02T12:55:24.961Z",
  "updatedAt": "2025-11-02T12:55:24.961Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Headphones",
    "description": "Premium wireless headphones with noise cancellation",
    "price": 249.99,
    "stock": 75
  }'
```

#### GET `/orders`
Get all orders with customer and order item details.

**Response Format:**
```json
[
  {
    "id": 1,
    "customerId": 1,
    "totalAmount": 1299.99,
    "shippingAddress": "123 Main St, City, State 12345",
    "createdAt": "2025-11-02T12:55:24.961Z",
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "productName": "Laptop",
        "quantity": 1,
        "price": 1299.99
      }
    ]
  }
]
```

#### GET `/orders/:id`
Get a specific order by ID.

**Parameters:**
- `id` (number): Order ID

#### POST `/orders`
Create a new order.

**Request Body:**
```json
{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "shippingAddress": "123 Main St, City, State 12345"
}
```

**Response Format:**
```json
{
  "id": 2,
  "customerId": 1,
  "totalAmount": 2799.97,
  "shippingAddress": "123 Main St, City, State 12345",
  "createdAt": "2025-11-02T12:55:24.961Z",
  "items": [
    {
      "id": 3,
      "orderId": 2,
      "productId": 1,
      "productName": "Laptop",
      "quantity": 2,
      "price": 1299.99
    },
    {
      "id": 4,
      "orderId": 2,
      "productId": 2,
      "productName": "Smartphone",
      "quantity": 1,
      "price": 899.99
    }
  ]
}
```

### Customer Service Endpoints

#### GET `/customers`
Get all customers.

**Response Format:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "City",
    "zipCode": "12345",
    "createdAt": "2025-11-02T12:55:24.961Z",
    "updatedAt": "2025-11-02T12:55:24.961Z"
  }
]
```

#### GET `/customers/:id`
Get a specific customer by ID.

**Parameters:**
- `id` (number): Customer ID

#### POST `/customers`
Create a new customer.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "address": "456 Oak Ave",
  "city": "Another City",
  "zipCode": "67890"
}
```

**Response Format:**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "address": "456 Oak Ave",
  "city": "Another City",
  "zipCode": "67890",
  "createdAt": "2025-11-02T12:55:24.961Z",
  "updatedAt": "2025-11-02T12:55:24.961Z"
}
```

#### GET `/customers/:id/orders`
Get all orders for a specific customer.

**Parameters:**
- `id` (number): Customer ID

**Response Format:**
```json
[
  {
    "id": 1,
    "customerId": 1,
    "totalAmount": 1299.99,
    "shippingAddress": "123 Main St, City, State 12345",
    "createdAt": "2025-11-02T12:55:24.961Z"
  }
]
```

## 🧪 Testing

### Manual Testing Steps

1. **Start all services** (backend + frontend) as described in [Local Setup](#local-setup)

2. **Access the application** at `http://localhost:3000`

3. **Test Product Features**:
   - Browse products on the homepage
   - View product details
   - Add products to cart

4. **Test Cart Functionality**:
   - Add/remove items from cart
   - Update item quantities
   - Verify cart persistence (localStorage)

5. **Test Checkout Process**:
   - Fill customer information form
   - Complete order placement
   - Verify order creation

6. **Test Order History**:
   - Navigate to orders page
   - View order details and items
   - Verify customer-order relationships

### API Testing

Use tools like Postman, curl, or Thunder Client to test API endpoints:

```bash
# Test product service
curl http://localhost:3001/products

# Test customer service
curl http://localhost:3002/customers

# Test order creation
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId": 1, "items": [{"productId": 1, "quantity": 1}], "shippingAddress": "Test Address"}'
```

### Database Verification

Connect to your PostgreSQL database to verify data integrity:

```sql
-- Check products
SELECT * FROM products;

-- Check orders
SELECT * FROM orders;

-- Check order items
SELECT * FROM order_items;

-- Check customers
SELECT * FROM customers;

-- Check customer orders
SELECT * FROM customer_orders;
```

## 📁 Project Structure

```
e-commerce-system/
├── backend/
│   ├── product-order-service/          # Product & Order Microservice
│   │   ├── src/
│   │   │   ├── app.module.ts           # Main application module
│   │   │   ├── main.ts                 # Application entry point
│   │   │   ├── products/               # Product management
│   │   │   │   ├── products.controller.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   ├── products.module.ts
│   │   │   │   ├── entities/product.entity.ts
│   │   │   │   └── dto/
│   │   │   ├── orders/                 # Order management
│   │   │   │   ├── orders.controller.ts
│   │   │   │   ├── orders.service.ts
│   │   │   │   ├── orders.module.ts
│   │   │   │   ├── entities/
│   │   │   │   └── dto/
│   │   │   ├── database/               # Database configuration
│   │   │   │   ├── database.module.ts
│   │   │   │   └── seed.ts             # Database seeding script
│   │   │   └── rabbitmq/               # Message queue service
│   │   │       ├── rabbitmq.module.ts
│   │   │       └── rabbitmq.service.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   │
│   └── customer-service/               # Customer Microservice
│       ├── src/
│       │   ├── app.module.ts
│       │   ├── main.ts
│       │   ├── customers/
│       │   │   ├── customers.controller.ts
│       │   │   ├── customers.service.ts
│       │   │   ├── customers.module.ts
│       │   │   ├── entities/
│       │   │   └── dto/
│       │   ├── database/
│       │   └── rabbitmq/
│       ├── package.json
│       ├── tsconfig.json
│       └── nest-cli.json
│
├── frontend/                           # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                        # Next.js App Router
│   │   │   ├── layout.js               # Root layout
│   │   │   ├── page.js                 # Homepage
│   │   │   ├── globals.css             # Global styles
│   │   │   ├── (shop)/                 # Route groups
│   │   │   │   └── products/
│   │   │   │       └── page.js         # Products page
│   │   │   ├── cart/                   # Shopping cart
│   │   │   │   └── page.js
│   │   │   ├── checkout/               # Checkout process
│   │   │   │   └── page.js
│   │   │   ├── orders/                 # Order history
│   │   │   │   └── page.js
│   │   │   └── _components/            # Reusable components
│   │   │       ├── ProductCard.js
│   │   │       ├── Header.js
│   │   │       ├── CartProvider.js
│   │   │       └── Providers.js
│   │   ├── config/                     # Configuration
│   │   │   └── env.js
│   │   └── utils/                      # Utility functions
│   │       └── index.js
│   ├── package.json
│   ├── next.config.mjs
│   ├── jsconfig.json
│   └── eslint.config.mjs
│
├── .gitignore                          # Git ignore rules
└── README.md                           # This documentation
```

## 🤝 Contributing

We welcome contributions to the E-Commerce System! Please follow these steps:

### 1. Fork the Repository
- Click the "Fork" button on GitHub
- Clone your fork locally

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow the existing code style and architecture
- Update documentation if needed
- Test your changes thoroughly

### 4. Commit Changes
```bash
git commit -m "Add: Brief description of your changes"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```
- Open a pull request on GitHub
- Provide a clear description of your changes

### Development Guidelines
- **Code Style**: Follow TypeScript/JavaScript best practices
- **Testing**: Test all changes before submitting
- **Documentation**: Update README for significant changes
- **Commits**: Use clear, descriptive commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rishav Jaiswal**
- GitHub: [@rishav161](https://github.com/rishav161)
- Email: rishavjaiswal864@gmail.com

---

⭐ **Star this repository** if you found it helpful!
