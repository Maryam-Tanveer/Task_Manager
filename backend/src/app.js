const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// CORS Configuration (MUST be before Helmet)









const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

// Add deployed frontend URLs from environment variables
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

// Add specific Vercel frontend URL
if (!allowedOrigins.includes('https://task-manager-drab-eta.vercel.app')) {
  allowedOrigins.push('https://task-manager-drab-eta.vercel.app');
}

// Log allowed origins in production
console.log('✅ CORS Allowed Origins:', allowedOrigins);





const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);

    // Allow explicit allowed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow Vercel deployments (frontend on *.vercel.app)
    try {
      const vercelMatch = /(^https:\/\/.*\.vercel\.app$)/i.test(origin);
      if (vercelMatch) return callback(null, true);
    } catch (e) {
      // fall through to deny
    }

    // Allow when FRONTEND_URL env var matches
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return callback(null, true);

    // Deny other origins cleanly without throwing an Express error
    console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Handle preflight OPTIONS requests explicitly (required for Vercel serverless)
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Security Middleware (after CORS so it doesn't override CORS headers)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logger Middleware
app.use(morgan('combined'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCss: '.swagger-ui .topbar { display: none }',
}));

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Health check endpoint
 */

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Check if the API server is running
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager Backend API is running successfully',
    health: '/health',
    documentation: '/api-docs'
  });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error Handling Middleware
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err }),
  });
});

module.exports = app;
