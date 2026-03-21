// src/db.js
/**
 * Database Connection
 * Now using Firebase Firestore instead of MongoDB
 */

const { admin, db } = require('./firebaseConfig');

const connectDB = async () => {
  try {
    // Test connection by reading from Firestore
    const testCollection = await db.collection('_healthcheck').limit(1).get();
    console.log('✅ Firebase Firestore connected successfully');
    console.log(`📚 Firestore project: ${admin.app().options.projectId}`);
    return true;
  } catch (error) {
    console.error('❌ Firebase Firestore connection failed:', error.message);
    console.warn('⚠️  Running without database connection - using dummy/test data');
    console.warn('💡 API will still work, but data won\'t persist');
    return false;
  }
};

module.exports = connectDB;

