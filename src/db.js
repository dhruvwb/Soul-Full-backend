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
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Using URI:', MONGO_URI.substring(0, 50) + '...');
    
    // For testing without DB, log a warning but don't exit
    if (process.env.NODE_ENV === 'testing') {
      console.warn('⚠️  Running in testing mode without database connection');
    } else {
      process.exit(1); // Stop the server if DB connection fails
    }
  }
};

module.exports = connectDB;
