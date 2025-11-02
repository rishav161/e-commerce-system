# Quick Setup Guide

## Step 1: Create PostgreSQL Databases

Run this in PowerShell:
```powershell
psql -U postgres
```

Then run:
```sql
CREATE DATABASE product_order_db;
CREATE DATABASE customer_db;
\q
```

Or use the SQL file:
```powershell
psql -U postgres -f backend/create-databases.sql
```

## Step 2: Start RabbitMQ

Using Docker:
```powershell
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Management UI: http://localhost:15672 (guest/guest)

## Step 3: Configure .env Files

### Product & Order Service (`backend/product-order-service/.env`):
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

### Customer Service (`backend/customer-service/.env`):
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

## Step 4: Install Dependencies

Product & Order Service:
```powershell
cd backend/product-order-service
npm install
```

Customer Service:
```powershell
cd backend/customer-service
npm install
```

## Step 5: Seed Products

```powershell
cd backend/product-order-service
npm run seed
```

## Step 6: Start Services

Terminal 1 - Product & Order Service:
```powershell
cd backend/product-order-service
npm run start:dev
```

Terminal 2 - Customer Service:
```powershell
cd backend/customer-service
npm run start:dev
```

## Verify Setup

- Product Service: http://localhost:3001/products
- Customer Service: http://localhost:3002/customers
- RabbitMQ Management: http://localhost:15672

