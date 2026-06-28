const mongoose = require('mongoose');
const logger = require('../utils/logger');
const seedDatabase = require('./seed');

/**
 * Connect to MongoDB
 * @returns {Promise} MongoDB connection
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/store-db';
    
    logger.info(`Connecting to MongoDB: ${mongoURI}`);

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);

    // Seed database with sample data
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Running database seeding...');
      await seedDatabase();
    }

    return conn;
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    // DO NOT crash the serverless container on database connection failure
    // process.exit(1);
  }
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
