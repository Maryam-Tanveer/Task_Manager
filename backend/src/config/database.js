const mongoose = require('mongoose');
const logger = require('../utils/logger');
const seedDatabase = require('./seed');

// Cache mongoose connection for serverless environments like Vercel
const cached = global.__mongooseCache || (global.__mongooseCache = { conn: null, promise: null });

/**
 * Connect to MongoDB
 * @returns {Promise} MongoDB connection
 */
const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (cached.promise) {
    return cached.promise;
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/store-db';
  logger.info(`Connecting to MongoDB: ${mongoURI}`);

  mongoose.set('bufferCommands', false);
  mongoose.set('strictQuery', false);

  cached.promise = mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4,
    })
    .then(async (conn) => {
      cached.conn = conn;
      logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
      if (process.env.NODE_ENV !== 'production') {
        logger.info('Running database seeding...');
        await seedDatabase();
      }
      return conn;
    })
    .catch((error) => {
      cached.promise = null;
      cached.conn = null;
      logger.error(`❌ MongoDB connection failed: ${error.message}`);
      throw error;
    });

  return cached.promise;
};

/**
 * Disconnect from MongoDB
 * @returns {Promise}
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('✅ MongoDB disconnected');
  } catch (error) {
    logger.error(`❌ MongoDB disconnection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
