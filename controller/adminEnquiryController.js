const { getAllDocs, getDocById, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');

exports.list = async (req, res) => {
  const items = await getAllDocs('enquiries');
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.markRead = async (req, res) => {
  const { isRead } = req.body;
  const doc = await updateDoc('enquiries', req.params.id, { isRead: Boolean(isRead) });

  if (!doc) {
    return res.status(404).json({ message: 'Enquiry not found' });
  }

  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await getDocById('enquiries', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Enquiry not found' });
  }
  await deleteDoc('enquiries', req.params.id);
  return res.json({ message: 'Deleted' });
};
