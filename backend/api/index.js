const app = require('../src/app');
const { connectDB } = require('../src/config/database');

// Establish database connection on startup
connectDB().catch(err => {
  console.error("Database connection failed during serverless startup:", err.message);
});

// Export Express app as a serverless function handler
module.exports = app;
