// src/firebaseConfig.js
/**
 * Firebase Configuration
 * Initializes Firebase Admin SDK with Firestore database
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK with service account credentials
const serviceAccount = require('../firebase-key.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
}

// Get Firestore database reference
const db = admin.firestore();

// Enable offline persistence (optional, for better reliability)
try {
  db.enablePersistence();
} catch (error) {
  // Persistence already enabled or not available
}

module.exports = {
  admin,
  db,
  firestore: db,
};
