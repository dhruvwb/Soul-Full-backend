const { createDoc, getAllDocs } = require('../utils/firestoreHelpers');

const logActivity = async message => {
  try {
    await createDoc('activities', { message });
  } catch (error) {
    // Avoid failing request because of activity logging
  }
};

const getRecentActivity = async (limit = 10) => {
  const items = await getAllDocs('activities');
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  return items.slice(0, limit);
};

module.exports = { logActivity, getRecentActivity };
