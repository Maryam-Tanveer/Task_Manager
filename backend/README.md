# Store Backend API

A professional Express.js backend API built with Node.js, npm, and MongoDB using Mongoose.

## 📋 Project Structure

```
src/
├── server.js           # Application entry point
├── app.js              # Express app configuration
├── routes/             # API route definitions
│   ├── index.js
│   ├── auth.routes.js
│   └── users.routes.js
├── controllers/        # Request handlers and business logic
│   ├── auth.controller.js
│   └── users.controller.js
├── models/             # Mongoose database schemas
│   ├── User.js
│   └── Product.js
├── middleware/         # Custom middleware
├── config/             # Configuration files
│   ├── database.js     # MongoDB connection
│   └── seed.js         # Database seeding
└── utils/              # Utility functions
    └── logger.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or MongoDB Atlas cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure MongoDB in `.env`:
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/store-db

# Or MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/store-db
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📌 Available Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### API Routes
- `GET /api` - API information

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users Routes
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB object modeling
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **dotenv** - Environment variables
- **morgan** - HTTP request logger

### Dev Dependencies
- **nodemon** - Auto-reload during development
- **eslint** - Code linting

## ⚙️ Configuration

Configuration is managed through environment variables in the `.env` file:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/store-db
```

## 📚 Database Models

### User Model
- `name` - User's full name (required)
- `email` - Unique email address (required)
- `password` - Encrypted password (required, min 6 chars)
- `role` - User role (user | admin, default: user)
- `isActive` - Account status (default: true)
- `phone` - Phone number
- `address` - Address object (street, city, state, zipCode, country)
- `profileImage` - Profile image URL
- `lastLogin` - Last login timestamp
- `createdAt` / `updatedAt` - Auto timestamps

### Product Model
- `name` - Product name (required)
- `description` - Product description (required)
- `price` - Regular price (required)
- `discountPrice` - Discounted price
- `category` - Product category (required)
- `stock` - Available stock quantity
- `image` / `images` - Product images
- `rating` - Product rating (0-5)
- `sku` - Stock keeping unit (unique)
- `tags` - Product tags array
- `isActive` - Product availability
- `createdAt` / `updatedAt` - Auto timestamps

## 📝 Project Features

✅ Express.js with professional structure
✅ MongoDB integration with Mongoose
✅ Security middleware (Helmet)
✅ CORS configuration
✅ Error handling middleware
✅ Logger utility with file logging
✅ RESTful API design
✅ Database models with validation
✅ Environment-based configuration
✅ Development tools with Nodemon

## 🤝 Best Practices

This project implements professional backend development standards:

- RESTful API design
- Modular code organization
- Error handling middleware
- Security headers with Helmet
- CORS support
- Database schema validation
- Logging utilities
- Environment-based configuration
- User authentication flow

## 📖 MongoDB Setup

For detailed MongoDB connection and setup instructions, see [MONGODB_SETUP.md](MONGODB_SETUP.md)

### Quick Local Setup
```bash
# Windows (with MongoDB installed)
mongod

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## 🔐 Security Considerations

- Passwords should be hashed with bcrypt (TODO)
- Implement JWT authentication (TODO)
- Add input validation middleware
- Use HTTPS in production
- Implement rate limiting
- Add CSRF protection if needed

## 📄 License

MIT

## 👤 Author

Maryam
