# Swagger API Documentation Setup Guide

## Overview

Swagger/OpenAPI documentation has been successfully integrated into your Store API. This provides an interactive API documentation interface where you can test all endpoints directly from your browser.

## What is Swagger?

Swagger (OpenAPI) is an open-source API documentation tool that:
- Provides interactive API documentation
- Allows real-time endpoint testing
- Shows request/response schemas
- Generates client SDK code
- Auto-generates from JSDoc comments

## Accessing Swagger Documentation

### Local Development
Once your backend server is running, access Swagger at:
```
http://localhost:3000/api-docs
```

### Features Available in Swagger UI

1. **Interactive Endpoint Testing**
   - Click "Try it out" on any endpoint
   - Fill in parameters and request body
   - Click "Execute" to make real API calls
   - View response data and headers

2. **Complete Request/Response Examples**
   - See exact request format required
   - View response schema and examples
   - Understand all error responses

3. **Authentication Support**
   - Click the lock icon on protected endpoints
   - Paste your JWT token to test authenticated endpoints
   - Token persists across requests

4. **Request Parameter Documentation**
   - Query parameters with descriptions
   - Path parameters
   - Request body schemas
   - Response schemas

## Starting the Development Server

```bash
cd backend
npm install    # Install all dependencies including Swagger
npm run dev    # Start the development server
```

Then navigate to: **http://localhost:3000/api-docs**

## API Endpoints Documentation

### Health Check
- **GET** `/health` - Verify API is running

### Authentication (Public)
- **POST** `/api/auth/register` - Create new user account
- **POST** `/api/auth/login` - Authenticate user and get token
- **POST** `/api/auth/logout` - Logout user

### Products (Mostly Public)
- **GET** `/api/products` - Get all products with filters
- **GET** `/api/products/featured` - Get featured products
- **GET** `/api/products/categories` - Get all product categories
- **GET** `/api/products/{id}` - Get single product
- **POST** `/api/products` - Create product (Admin)
- **PUT** `/api/products/{id}` - Update product (Admin)
- **DELETE** `/api/products/{id}` - Delete product (Admin)

### Orders (Protected)
- **POST** `/api/orders` - Create new order
- **GET** `/api/orders/user/{userId}` - Get user's orders
- **GET** `/api/orders/user/{userId}/stats` - Get order statistics
- **GET** `/api/orders/{orderId}` - Get order details
- **PUT** `/api/orders/{orderId}/status` - Update order status (Admin)
- **PUT** `/api/orders/{orderId}/cancel` - Cancel pending order

### Wishlist (Protected)
- **GET** `/api/wishlist/{userId}` - Get user's wishlist
- **POST** `/api/wishlist/{userId}/add` - Add item to wishlist
- **DELETE** `/api/wishlist/{userId}/remove/{productId}` - Remove item
- **PUT** `/api/wishlist/{userId}/toggle` - Toggle item (add/remove)
- **GET** `/api/wishlist/{userId}/check/{productId}` - Check if in wishlist
- **DELETE** `/api/wishlist/{userId}/clear` - Clear entire wishlist

### Users (Protected)
- **GET** `/api/users` - Get all users (Admin)
- **GET** `/api/users/{id}` - Get user by ID
- **PUT** `/api/users/{id}` - Update user profile
- **DELETE** `/api/users/{id}` - Delete user (Admin)

## Testing Protected Endpoints

### Method 1: Using Swagger UI (Recommended)

1. Navigate to **http://localhost:3000/api-docs**
2. Look for endpoints with a lock icon 🔒
3. Click on a protected endpoint
4. Click the green "Authorize" button in the top right
5. Enter your JWT token in the format: `Bearer YOUR_TOKEN_HERE`
6. Click "Authorize"
7. Now test the endpoint with "Try it out" → "Execute"

### Method 2: Getting a Valid Token

1. First, register or login to get a token:
   - Go to `POST /api/auth/register` or `POST /api/auth/login`
   - Click "Try it out"
   - Enter credentials
   - Click "Execute"
   - Copy the `token` from the response

2. Use that token to authorize all subsequent requests

### Sample Login Credentials

The backend auto-seeds with sample users:
- **Email:** admin@store.com | **Password:** password123
- **Email:** john@store.com | **Password:** password123
- **Email:** jane@store.com | **Password:** password123

## Example Workflows

### Workflow 1: Complete Shopping Flow

1. **Get Products**
   - `GET /api/products` - Browse all products
   - `GET /api/products/categories` - See available categories
   - `GET /api/products/{id}` - View product details

2. **Create Order**
   - `POST /api/auth/login` - Login and get token
   - `POST /api/orders` - Create order with cart items

3. **Track Order**
   - `GET /api/orders/user/{userId}` - View all orders
   - `GET /api/orders/{orderId}` - Check specific order status
   - `GET /api/orders/user/{userId}/stats` - View order statistics

### Workflow 2: Wishlist Management

1. **Add to Wishlist**
   - `POST /api/wishlist/{userId}/add` - Add product to wishlist
   - Body: `{ "productId": "..." }`

2. **Manage Wishlist**
   - `GET /api/wishlist/{userId}` - View all wishlist items
   - `PUT /api/wishlist/{userId}/toggle` - Toggle wishlist item
   - `DELETE /api/wishlist/{userId}/remove/{productId}` - Remove item
   - `DELETE /api/wishlist/{userId}/clear` - Clear all items

## Generated Files

The Swagger implementation created these files:

1. **`src/config/swagger.js`**
   - Main Swagger configuration
   - Defines OpenAPI 3.0 spec
   - Schema definitions for all models
   - Server configurations

2. **Updated Route Files** (with JSDoc/Swagger comments)
   - `src/routes/products.routes.js`
   - `src/routes/auth.routes.js`
   - `src/routes/users.routes.js`
   - `src/routes/orders.routes.js`
   - `src/routes/wishlist.routes.js`

3. **Updated App File**
   - `src/app.js` - Integrated Swagger UI middleware

4. **Updated Dependencies**
   - `package.json` - Added:
     - `swagger-ui-express` (^5.0.0)
     - `swagger-jsdoc` (^6.2.8)

## Troubleshooting

### Issue: Swagger UI Not Loading
**Solution:**
- Make sure server is running: `npm run dev`
- Check that port 3000 is accessible
- Clear browser cache and refresh

### Issue: Endpoints Not Showing in Swagger
**Solution:**
- Ensure JSDoc comments are properly formatted
- Check that route files are in `src/routes/` directory
- Restart the development server

### Issue: "Cannot find module 'swagger-ui-express'"
**Solution:**
- Run `npm install` to ensure all packages are installed
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Issue: Protected Endpoints Return 401
**Solution:**
- Ensure you've copied the correct JWT token
- Include "Bearer " prefix before the token
- For testing, use sample credentials to generate a new token

## Next Steps

1. ✅ Start your development server: `npm run dev`
2. ✅ Navigate to `http://localhost:3000/api-docs`
3. ✅ Test endpoints directly in Swagger UI
4. ✅ Use the interactive documentation for frontend integration
5. ✅ Copy example requests to integrate with frontend

## Frontend Integration Reference

When integrating with your React frontend, reference the Swagger documentation for:
- Exact API endpoint URLs
- Required request headers
- Query parameters for filtering
- Response object structures
- Error handling patterns

## Additional Resources

- **OpenAPI 3.0 Specification:** https://swagger.io/specification/
- **Swagger UI Documentation:** https://swagger.io/tools/swagger-ui/
- **Swagger JSDoc:** https://github.com/Surnet/swagger-jsdoc

---

**API is now fully documented and ready for testing!** 🚀
