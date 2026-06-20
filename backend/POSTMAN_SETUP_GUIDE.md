# Postman Collection Guide

## Files Created

You now have two Postman files ready to import:

1. **Store_API.postman_collection.json** - Complete API collection with 27 endpoints
2. **Store_API_Environment.postman_environment.json** - Environment variables

---

## 📥 Import into Postman

### Step 1: Import the Collection

1. Open **Postman**
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose **Store_API.postman_collection.json**
5. Click **Import**

✅ All 27 endpoints will appear in your left sidebar

### Step 2: Import the Environment

1. Click **Import** button again
2. Select **File** tab
3. Choose **Store_API_Environment.postman_environment.json**
4. Click **Import**

✅ Environment variables will be loaded

### Step 3: Select the Environment

1. Top right corner, find the environment dropdown
2. Select **Store API Environment**
3. You'll see the variables are now active

---

## 🗂️ Collection Structure

The collection is organized into **6 categories**:

### 1. Health & Info (2 endpoints)
- Health Check - Server status
- API Info - Version and endpoints

### 2. Authentication (3 endpoints)
- Register New User
- Login User
- Logout User

### 3. Products (7 endpoints)
- Get All Products (with filtering, search, sorting)
- Get Product by ID
- Get Featured Products
- Get Categories
- Create Product (Admin)
- Update Product (Admin)
- Delete Product (Admin)

### 4. Orders (6 endpoints)
- Create Order
- Get User Orders
- Get Order Statistics
- Get Order by ID
- Update Order Status
- Cancel Order

### 5. Wishlist (6 endpoints)
- Get Wishlist
- Add to Wishlist
- Remove from Wishlist
- Toggle Wishlist Item
- Check if in Wishlist
- Clear Wishlist

### 6. Users (4 endpoints)
- Get All Users
- Get User by ID
- Update User
- Delete User

---

## 🔧 Using Environment Variables

The collection uses these variables (set in the Environment):

```
{{base_url}}      → http://localhost:3000
{{api_url}}       → http://localhost:3000/api
{{auth_token}}    → Your JWT token (leave empty for now)
{{user_id}}       → Replace with actual user ID
{{product_id}}    → Replace with actual product ID
{{order_id}}      → Replace with actual order ID
```

### How to Use Variables

In any request URL or body, use:
```
{{variable_name}}
```

For example:
```
GET {{api_url}}/users/{{user_id}}
```

---

## 🚀 Quick Start Testing

### 1. Test Health Check
1. Click **Health & Info** → **Health Check**
2. Click **Send**
3. You should see `"status": "OK"`

### 2. Test APIs
1. Click **Products** → **Get All Products**
2. Click **Send**
3. You'll get back all products with pagination

### 3. Create an Order
1. Click **Orders** → **Create Order**
2. The body has a template with all required fields
3. Update `userId`, `productId`, addresses as needed
4. Click **Send**

---

## 📝 Example: Testing Login Flow

1. **Register User**
   - Go to **Authentication** → **Register New User**
   - Create user: `{"name":"Test","email":"test@example.com","password":"123456"}`
   - Click **Send** → Get user ID from response

2. **Login User**
   - Go to **Authentication** → **Login User**
   - Enter your email and password
   - Click **Send**
   - Copy the `token` from response

3. **Set Token in Environment**
   - Top right → Environment dropdown
   - Click environment name → **Edit**
   - In `auth_token`, paste the token
   - Click **Save**

4. **Use Protected Resources**
   - You can now use authenticated endpoints
   - Add header: `Authorization: Bearer {{auth_token}}`

---

## 🔑 Sample IDs for Testing

The backend auto-seeds with sample data. You can use these:

**Sample Users:**
```
Email: john@example.com      Password: john123
Email: jane@example.com      Password: jane123
Email: admin@example.com     Password: admin123
```

**Sample Products:**
12 products are auto-seeded - use **Get All Products** to get actual IDs

---

## 📤 Making Requests

### GET Request Example
```
GET http://localhost:3000/api/products?search=jacket&limit=10
No body needed
```

### POST Request Example
```
POST http://localhost:3000/api/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "john123"
}
```

### PUT Request Example
```
PUT http://localhost:3000/api/orders/ORD-1234567890/status
Body (JSON):
{
  "status": "shipped",
  "shippingTrackingNumber": "TRACK123"
}
```

---

## 🔍 Understanding Responses

All APIs return this format:

### Success Response
```json
{
  "success": true,
  "message": "Action completed",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### List Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## 💡 Tips & Tricks

### 1. Save Response Values
After getting a response:
1. Click the response
2. Copy values you need
3. Paste into environment variables

### 2. Use Pre-request Scripts
To auto-set variables:
1. Click **Pre-request Script** tab
2. Add custom JavaScript

### 3. Use Tests
To validate responses:
1. Click **Tests** tab
2. Add validation tests

### 4. Create Collections
Organize your requests:
- Right-click folder
- Create new folder/request

### 5. Use Variables in Body
```json
{
  "userId": "{{user_id}}",
  "productId": "{{product_id}}"
}
```

---

## 🐛 Troubleshooting

### "Connection Refused"
**Problem**: Cannot connect to backend
**Solution**: 
- Make sure backend is running: `npm run dev`
- Check if port 3000 is in use
- Verify `base_url` in environment

### "404 Not Found"
**Problem**: Endpoint not found
**Solution**:
- Verify endpoint path is correct
- Check for typos in URL
- Make sure all path parameters are included

### "Invalid JSON"
**Problem**: Request body is malformed
**Solution**:
- Check JSON formatting (valid characters, quotes)
- Use `Ctrl+E` to format body
- Verify all required fields are present

### "Unauthorized"
**Problem**: 401 error
**Solution**:
- Paste auth_token in environment
- Ensure token is valid
- Check Authorization header

---

## 📋 Endpoints Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| GET | /api/products/:id | Get single product |
| POST | /api/orders | Create order |
| GET | /api/orders/user/:userId | Get user orders |
| GET | /api/wishlist/:userId | Get wishlist |
| POST | /api/auth/login | Login user |
| GET | /api/users | Get all users |

---

## 🔗 Integration with Frontend

Once you've tested the APIs:

1. **Note working endpoints** - All should respond with data
2. **Copy response formats** - Use as reference for frontend
3. **Test error cases** - See how API handles bad input
4. **Check auth flow** - Understand token usage

---

## 📞 Support

For detailed API documentation:
- **See**: `backend/API_DOCUMENTATION.md`

For integration steps:
- **See**: `FRONTEND_INTEGRATION.md`

For architecture overview:
- **See**: `BACKEND_ARCHITECTURE.md`

---

## ✅ Verification Checklist

Before deploying:

- [ ] All endpoints respond with status 200-201
- [ ] Errors return appropriate status codes
- [ ] Response format is consistent
- [ ] Can login and get token
- [ ] Can create orders
- [ ] Pagination works
- [ ] Filters work
- [ ] Search works

---

**Latest Update**: 2024  
**Collection Version**: 1.0.0  
**Total Endpoints**: 27
