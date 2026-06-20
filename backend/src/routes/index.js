const express = require('express');
const router = express.Router();

// Import route controllers
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const productsRoutes = require('./products.routes');
const ordersRoutes = require('./orders.routes');
const wishlistRoutes = require('./wishlist.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/wishlist', wishlistRoutes);

// API version info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Store Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      wishlist: '/api/wishlist',
    },
  });
});

module.exports = router;
