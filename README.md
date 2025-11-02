# E-Commerce System 🛒

A full-stack e-commerce application built with modern technologies, featuring microservices architecture, real-time messaging, and a responsive frontend.

## 🚀 Features

- **Product Management**: Add, view, and manage products with pricing and inventory
- **Shopping Cart**: Add/remove items with persistent cart storage
- **Order Processing**: Complete checkout flow with order history
- **Customer Management**: User registration and order tracking
- **Real-time Communication**: RabbitMQ for inter-service messaging
- **Responsive Design**: Mobile-friendly React frontend
- **Database Integration**: PostgreSQL with TypeORM

## 🏗️ Architecture

### Backend (Microservices)
- **Product & Order Service** (Port 3001): Handles products, orders, and inventory
- **Customer Service** (Port 3002): Manages customer data and order relationships
- **Message Queue**: RabbitMQ for event-driven communication

### Frontend
- **Next.js**: React framework with App Router
- **Responsive UI**: Modern design with CSS-in-JS
- **API Integration**: RESTful communication with backend services

### Database
- **PostgreSQL**: Cloud-hosted database (Render.com)
- **TypeORM**: Object-relational mapping for TypeScript

## 🛠️ Tech Stack

### Backend
- **NestJS**: Node.js framework for scalable applications
- **TypeScript**: Type-safe JavaScript
- **TypeORM**: Database ORM
- **RabbitMQ**: Message broker
- **PostgreSQL**: Database

### Frontend
- **Next.js 15**: React framework
- **React**: UI library
- **JavaScript**: Client-side logic
- **CSS**: Styling

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- RabbitMQ (optional, for local development)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/rishav161/e-commerce-system.git
cd e-commerce-system
```

### 2. Backend Setup

#### Product & Order Service
```bash
cd backend/product-order-service
npm install
npm run start:dev
```

#### Customer Service
```bash
cd backend/customer-service
npm install
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Database Setup
- The application uses a cloud PostgreSQL database
- Database connection is configured via `DATABASE_URL` environment variable
- Run the seed script to populate sample data:
```bash
cd backend/product-order-service
npm run seed
```

## 🔧 Environment Variables

### Backend Services
Create `.env` files in each backend service directory:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# RabbitMQ (optional for local development)
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_EXCHANGE=ecommerce_exchange

# Ports
PORT=3001  # for product-order-service
PORT=3002  # for customer-service
```

### Frontend
Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_CUSTOMER_SERVICE_URL=http://localhost:3002
```

## 📡 API Endpoints

### Product Service (Port 3001)
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order

### Customer Service (Port 3002)
- `GET /customers` - Get all customers
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `GET /customers/:id/orders` - Get customer's orders

## 🌐 Deployment

### Backend Services (Render.com)
1. Connect your GitHub repository to Render
2. Deploy each service as a separate web service
3. Set environment variables in Render dashboard
4. Deploy the database separately or use Render's PostgreSQL

### Frontend (Vercel/Netlify)
1. Connect repository to Vercel/Netlify
2. Set environment variables for API URLs
3. Deploy automatically on push

## 🧪 Testing the Application

1. **Start all services** (backend + frontend)
2. **Visit** `http://localhost:3000`
3. **Browse products** and add to cart
4. **Complete checkout** with customer information
5. **View order history** in the orders page

## 📁 Project Structure

```
e-commerce-system/
├── backend/
│   ├── product-order-service/     # Products & Orders microservice
│   └── customer-service/          # Customer management microservice
├── frontend/                      # Next.js application
│   ├── src/
│   │   ├── app/                   # App Router pages
│   │   ├── components/            # Reusable components
│   │   └── lib/                   # API utilities
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature-name`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Rishav Jaiswal**
- GitHub: [@rishav161](https://github.com/rishav161)
- Email: rishavjaiswal864@gmail.com

---

⭐ **Star this repo** if you found it helpful!
