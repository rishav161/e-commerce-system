# E-Commerce Backend Microservices

This backend consists of two NestJS microservices that communicate via RabbitMQ.

## Services

1. **Product & Order Service** (Port 3001)
   - Manages products and orders
   - Publishes `order_created` events to RabbitMQ

2. **Customer Service** (Port 3002)
   - Manages customer data
   - Subscribes to `order_created` events from RabbitMQ

## Prerequisites

- Node.js (v18+)
- PostgreSQL
- RabbitMQ
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

For Product & Order Service:
```bash
cd product-order-service
npm install
```

For Customer Service:
```bash
cd customer-service
npm install
```

### 2. Database Setup

Create two PostgreSQL databases:
```sql
CREATE DATABASE product_order_db;
CREATE DATABASE customer_db;
```

### 3. Configure Environment Variables

#### Product & Order Service (.env)
```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=product_order_db

RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_EXCHANGE=ecommerce_exchange
RABBITMQ_ROUTING_KEY=order_created
```

#### Customer Service (.env)
```env
PORT=3002

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=customer_db

RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_EXCHANGE=ecommerce_exchange
RABBITMQ_ROUTING_KEY=order_created
RABBITMQ_QUEUE=customer_order_queue
```

### 4. Run Migrations and Seed Data

For Product & Order Service:
```bash
cd product-order-service
# Enable synchronize in database.module.ts temporarily for development, or run migrations
npm run seed
```

### 5. Start RabbitMQ

Make sure RabbitMQ is running:
```bash
# Using Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### 6. Start Services

Product & Order Service:
```bash
cd product-order-service
npm run start:dev
```

Customer Service (in a new terminal):
```bash
cd customer-service
npm run start:dev
```

## API Endpoints

### Product & Order Service (http://localhost:3001)

**Products:**
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create a product

**Orders:**
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `GET /orders/customer/:customerId` - Get orders by customer ID
- `POST /orders` - Create an order (decreases stock, publishes RabbitMQ event)

### Customer Service (http://localhost:3002)

**Customers:**
- `GET /customers` - Get all customers
- `GET /customers/:id` - Get customer by ID
- `GET /customers/:id/orders` - Get customer orders
- `POST /customers` - Create a customer

## Architecture

- **Microservices**: Separate services for product/order and customer management
- **Message Queue**: RabbitMQ for async communication
- **Database**: PostgreSQL with TypeORM
- **Validation**: class-validator for request validation

