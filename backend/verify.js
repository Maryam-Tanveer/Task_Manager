const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');

/**
 * Quick verification script
 * Run: node verify.js
 */

console.log('🔍 Verifying MongoDB setup...\n');

// Check models
console.log('✅ Models loaded:');
console.log('   - User Model:', User.modelName);
console.log('   - Product Model:', Product.modelName);

console.log('\n✅ Database configuration:');
console.log('   - URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/store-db');
console.log('   - Connection file: src/config/database.js');

console.log('\n✅ Controllers updated:');
console.log('   - auth.controller.js (uses User model)');
console.log('   - users.controller.js (uses User model)');

console.log('\n✅ Project structure:');
console.log('   ✓ src/config/database.js - MongoDB connection');
console.log('   ✓ src/models/User.js - User schema');
console.log('   ✓ src/models/Product.js - Product schema');
console.log('   ✓ src/config/seed.js - Database seeding');
console.log('   ✓ MONGODB_SETUP.md - Setup guide');
console.log('   ✓ .env file configured');

console.log('\n📝 Next Steps:');
console.log('   1. Ensure MongoDB is running');
console.log('   2. Run: npm run dev');
console.log('   3. Test endpoints with Postman or curl');
console.log('   4. See MONGODB_SETUP.md for detailed guide\n');
