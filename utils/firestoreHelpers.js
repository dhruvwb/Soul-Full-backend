// utils/firestoreHelpers.js
/**
 * Firestore Helper Functions
 * Common database operations for Firestore
 * Usage: const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');
 */

const { db } = require('../src/firebaseConfig');

/**
 * Get all documents from a collection
 * @param {string} collection - Collection name
 * @returns {Promise<Array>} Array of documents with IDs
 */
const getAllDocs = async (collection) => {
  try {
    const snapshot = await db.collection(collection).get();
    const docs = [];
    snapshot.forEach(doc => {
      docs.push({
        _id: doc.id,
        ...doc.data(),
      });
    });
    return docs;
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    throw error;
  }
};

/**
 * Get a single document by ID
 * @param {string} collection - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} Document data with ID
 */
const getDocById = async (collection, docId) => {
  try {
    const doc = await db.collection(collection).doc(docId).get();
    if (!doc.exists) {
      return null;
    }
    return {
      _id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error(`Error fetching ${collection}/${docId}:`, error);
    throw error;
  }
};

/**
 * Create a new document
 * @param {string} collection - Collection name
 * @param {Object} data - Document data
 * @returns {Promise<Object>} Created document with ID
 */
const createDoc = async (collection, data) => {
  try {
    const docRef = await db.collection(collection).add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return {
      _id: docRef.id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error creating ${collection}:`, error);
    throw error;
  }
};

/**
 * Update a document
 * @param {string} collection - Collection name
 * @param {string} docId - Document ID
 * @param {Object} data - Data to update
 * @returns {Promise<Object>} Updated document
 */
const updateDoc = async (collection, docId, data) => {
  try {
    await db.collection(collection).doc(docId).update({
      ...data,
      updatedAt: new Date(),
    });
    const updated = await getDocById(collection, docId);
    return updated;
  } catch (error) {
    console.error(`Error updating ${collection}/${docId}:`, error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} collection - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<boolean>} Success status
 */
const deleteDoc = async (collection, docId) => {
  try {
    await db.collection(collection).doc(docId).delete();
    return true;
  } catch (error) {
    console.error(`Error deleting ${collection}/${docId}:`, error);
    throw error;
  }
};

/**
 * Query documents with filter
 * @param {string} collection - Collection name
 * @param {string} field - Field to filter
 * @param {string} operator - Comparison operator ('==', '>', '<', '>=', '<=', '!=')
 * @param {any} value - Value to compare
 * @returns {Promise<Array>} Matching documents
 */
const queryDocs = async (collection, field, operator, value) => {
  try {
    const snapshot = await db.collection(collection).where(field, operator, value).get();
    const docs = [];
    snapshot.forEach(doc => {
      docs.push({
        _id: doc.id,
        ...doc.data(),
      });
    });
    return docs;
  } catch (error) {
    console.error(`Error querying ${collection}:`, error);
    throw error;
  }
};

module.exports = {
  getAllDocs,
  getDocById,
  createDoc,
  updateDoc,
  deleteDoc,
  queryDocs,
};
