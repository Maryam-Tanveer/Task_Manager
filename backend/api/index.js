const app = require('../src/app');
const { connectDB } = require('../src/config/database');

// Export a serverless handler that waits for MongoDB to connect before handling requests
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection failed during serverless startup:', err.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Database connection failed' }));
    return;
  }

  return app(req, res);
};
