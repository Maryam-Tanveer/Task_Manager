# Store Backend API Documentation

## Overview

Professional Express.js backend API for the eCommerce Store application. Built with Node.js, Express, MongoDB, and Mongoose.

## Base URL

```
http://localhost:3000/api
```

## Authentication

JWT Token-based authentication (implementation in progress). For now, most endpoints are public.

Include token in headers:

```
Authorization: Bearer <token>
```

## API Endpoints

### 1. Authentication Routes (`/api/auth`)

#### Register New User

```
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User

```
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Logout

```
POST /api/auth/logout
```

**Response:**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 2. Products Routes (`/api/products`)

#### Get All Products (with Filtering & Search)

```
GET /api/products?category=electronics&sortBy=price-low&search=laptop&page=1&limit=20&minPrice=100&maxPrice=1000
```

**Query Parameters:**

- `category` (string) - Filter by category (e.g., "electronics", "clothing")
- `search` (string) - Search in product name and description
- `sortBy` (string) - Sort order: "featured", "price-low", "price-high", "rating", "popular"
- `page` (number) - Page number (default: 1)
- `limit` (number) - Limit per page (default: 20, max: 100)
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "discountPrice": 79.99,
      "category": "electronics",
      "image": "image_url",
      "rating": 4.5,
      "reviewCount": 120,
      "stock": 50
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### Get Featured Products

```
GET /api/products/featured?limit=6
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Featured Product",
      "price": 99.99,
      "rating": 4.8,
      "reviewCount": 500
    }
  ],
  "count": 6
}
```

#### Get Product by ID

```
GET /api/products/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Detailed description",
    "price": 99.99,
    "discountPrice": 79.99,
    "category": "electronics",
    "stock": 50,
    "image": "image_url",
    "images": ["url1", "url2"],
    "rating": 4.5,
    "reviewCount": 120,
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get All Categories

```
GET /api/products/categories
```

**Response:**

```json
{
  "success": true,
  "data": ["electronics", "clothing", "jewelry"],
  "count": 3
}
```

#### Create Product (Admin Only)

```
POST /api/products
```

**Request Body:**

```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "stock": 100,
  "image": "image_url",
  "rating": 4.5
}
```

#### Update Product (Admin Only)

```
PUT /api/products/:id
```

**Request Body:**

```json
{
  "name": "Updated Product",
  "price": 89.99,
  "stock": 80
}
```

#### Delete Product (Admin Only)

```
DELETE /api/products/:id
```

---

### 3. Orders Routes (`/api/orders`)

#### Create Order

```
POST /api/orders
```

**Request Body:**

```json
{
  "userId": "user_id",
  "items": [
    {
      "productId": "product_id",
      "title": "Product Name",
      "price": 99.99,
      "quantity": 1,
      "image": "image_url"
    }
  ],
  "subtotal": 99.99,
  "tax": 8.00,
  "shippingCost": 0,
  "total": 107.99,
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "state": "NY",
    "country": "USA"
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "state": "NY",
    "country": "USA"
  },
  "paymentMethod": "credit-card"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "order_db_id",
    "orderId": "ORD-1234567890",
    "userId": "user_id",
    "items": [...],
    "subtotal": 99.99,
    "tax": 8.00,
    "total": 107.99,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z",
    "estimatedDelivery": "2024-01-06T00:00:00Z"
  }
}
```

#### Get User Orders

```
GET /api/orders/user/:userId?status=pending&page=1&limit=10
```

**Query Parameters:**

- `status` (string) - Filter by status: "pending", "confirmed", "shipped", "delivered", "cancelled"
- `page` (number) - Page number
- `limit` (number) - Results per page

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "order_db_id",
      "orderId": "ORD-1234567890",
      "status": "pending",
      "items": [...],
      "total": 107.99,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

#### Get Order by ID

```
GET /api/orders/:orderId
```

**Response:**

```json
{
  "success": true,
  "data": {
    "orderId": "ORD-1234567890",
    "userId": "user_id",
    "items": [...],
    "total": 107.99,
    "status": "pending",
    "estimatedDelivery": "2024-01-06T00:00:00Z"
  }
}
```

#### Update Order Status

```
PUT /api/orders/:orderId/status
```

**Request Body:**

```json
{
  "status": "shipped",
  "shippingTrackingNumber": "TRACK123456"
}
```

**Status Values:** `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

#### Cancel Order

```
PUT /api/orders/:orderId/cancel
```

**Request Body:**

```json
{
  "reason": "Changed my mind"
}
```

#### Get Order Statistics

```
GET /api/orders/user/:userId/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalOrders": 10,
    "totalSpent": 1500.00,
    "pendingCount": 2,
    "confirmedCount": 3,
    "shippedCount": 2,
    "deliveredCount": 3,
    "cancelledCount": 0
  }
}
```

---

### 4. Wishlist Routes (`/api/wishlist`)

#### Get User Wishlist

```
GET /api/wishlist/:userId
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "wishlist_id",
    "userId": "user_id",
    "items": [
      {
        "productId": "product_id",
        "title": "Product Name",
        "price": 99.99,
        "image": "image_url",
        "category": "electronics"
      }
    ]
  }
}
```

#### Add to Wishlist

```
POST /api/wishlist/:userId/add
```

**Request Body:**

```json
{
  "productId": "product_id",
  "title": "Product Name",
  "price": 99.99,
  "image": "image_url",
  "category": "electronics"
}
```

#### Remove from Wishlist

```
DELETE /api/wishlist/:userId/remove/:productId
```

#### Toggle Wishlist Item

```
PUT /api/wishlist/:userId/toggle
```

**Request Body:**

```json
{
  "productId": "product_id",
  "title": "Product Name",
  "price": 99.99,
  "image": "image_url",
  "category": "electronics"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Item added to wishlist",
  "inWishlist": true,
  "data": { "items": [...] }
}
```

#### Check if Product in Wishlist

```
GET /api/wishlist/:userId/check/:productId
```

**Response:**

```json
{
  "success": true,
  "inWishlist": true
}
```

#### Clear Wishlist

```
DELETE /api/wishlist/:userId/clear
```

---

### 5. Users Routes (`/api/users`)

#### Get All Users

```
GET /api/users
```

#### Get User by ID

```
GET /api/users/:id
```

#### Update User

```
PUT /api/users/:id
```

**Request Body:**

```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

#### Delete User

```
DELETE /api/users/:id
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Models

### Product

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,
  category: String,
  stock: Number,
  image: String,
  images: [String],
  rating: Number,
  reviewCount: Number,
  isActive: Boolean,
  sku: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Order

```javascript
{
  _id: ObjectId,
  orderId: String,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    title: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  total: Number,
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    zipCode: String,
    state: String,
    country: String
  },
  billingAddress: Object,
  paymentMethod: String,
  status: String,
  estimatedDelivery: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Wishlist

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    title: String,
    price: Number,
    image: String,
    category: String,
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Setup & Installation

### Prerequisites

- Node.js >= 14
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/store-db
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

3. Start development server:

```bash
npm run dev
```

---

## Features Implemented

✅ Product catalog with filtering, search, and sorting  
✅ Shopping cart order creation  
✅ Order management and tracking  
✅ Wishlist functionality  
✅ User authentication with bcrypt  
✅ MongoDB integration  
✅ CORS configuration  
✅ Error handling  
✅ Database seeding  
✅ Comprehensive API documentation

---

## Frontend Integration

The frontend (React) connects to these endpoints via:

```javascript
// API configuration in frontend/src/utils/api.js
const API_BASE_URL = 'http://localhost:3000';

// Usage in components:
fetch(`${API_BASE_URL}/api/products`);
fetch(`${API_BASE_URL}/api/orders`, { method: 'POST' });
```

---

## Next Steps

- [ ] Implement JWT token generation in login
- [ ] Add email verification for registration
- [ ] Implement payment gateway integration
- [ ] Add order notifications
- [ ] Implement admin dashboard APIs
- [ ] Add review and rating system
- [ ] Implement product image upload
- [ ] Add inventory management

---

**Last Updated:** January 2024  
**Version:** 1.0.0
