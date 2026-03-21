// src/firebaseConfig.js
/**
 * Firebase Configuration
 * Initializes Firebase Admin SDK with Firestore database
 * Supports both local (file-based) and hosted (env-based) deployments
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let serviceAccount;

// Try to load from file first (local development)
const keyFilePath = path.join(__dirname, '../firebase-key.json');
if (fs.existsSync(keyFilePath)) {
  console.log('📄 Loading Firebase credentials from file');
  serviceAccount = require('../firebase-key.json');
} 
// Try to load from environment variable (Render deployment)
else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.log('🔐 Loading Firebase credentials from environment variable');
  try {
    serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8'));
  } catch (error) {
    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', error.message);
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT environment variable');
  }
}
else {
  throw new Error('Firebase credentials not found! Please provide either firebase-key.json or FIREBASE_SERVICE_ACCOUNT env variable');
}

// Initialize Firebase Admin SDK with service account credentials
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
  console.log('✅ Firebase Admin SDK initialized successfully');
  console.log(`📚 Project ID: ${serviceAccount.project_id}`);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  throw error;
}

// Get Firestore database reference
const db = admin.firestore();

// Enable offline persistence (optional, for better reliability)
try {
  db.enablePersistence().catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️  Multiple tabs open, persistence disabled');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️  Browser doesn\'t support persistence');
    }
  });
} catch (error) {
  // Persistence already enabled or not available - this is okay
}

module.exports = {
  admin,
  db,
  firestore: db,
};
