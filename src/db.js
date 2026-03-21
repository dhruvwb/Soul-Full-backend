// src/db.js
const mongoose = require('mongoose');
require('dotenv').config();

// Support both MONGODB_URI (production) and MONGO_URI (local development)
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/TravelWeb';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Using URI:', MONGO_URI.substring(0, 50) + '...');
    
    // Don't crash - let app run with dummy data for testing
    console.warn('⚠️  Running without database connection - using dummy/test data');
    console.warn('💡 API will still work, but data won\'t persist');
    
    return false;
  }
};

module.exports = connectDB;
