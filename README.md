# Agrofix - Bulk Vegetable & Fruit Order Management System

Agrofix is a web application that facilitates bulk orders of vegetables and fruits. It provides a user-friendly interface for buyers to browse products and place orders, while giving administrators tools to manage inventory and track orders.

## Features

- Product catalog browsing
- Bulk order placement
- Order tracking
- Admin dashboard for inventory management
- Order status management

## Tech Stack

- Frontend: Next.js with TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Styling: Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd agrofix
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env` file in the root directory with the following content:

4. Initialize the database:
```bash
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
/app
  /api - Backend API routes
  /admin - Admin dashboard pages
  /components - Reusable UI components
  /lib - Utility functions and types
/prisma - Database schema and migrations
```

## API Routes

- `GET /api/products` - Get all products
- `POST /api/products` - Create a product (admin)
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create an order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin)

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!
