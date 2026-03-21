const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');
const { logActivity } = require('../services/activityService');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await getAllDocs('news');
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.create = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const payload = {
    ...req.body,
    imageUrl,
    isActive: parseBoolean(req.body.isActive)
  };
  const doc = await createDoc('news', payload);
  await logActivity(`Added news: ${doc.title}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const payload = {
    ...req.body,
    imageUrl: imageUrl || req.body.existingImageUrl,
    isActive: parseBoolean(req.body.isActive)
  };

  const doc = await updateDoc('news', req.params.id, payload);
  if (!doc) {
    return res.status(404).json({ message: 'News item not found' });
  }
  await logActivity(`Updated news: ${doc.title}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await getDocById('news', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'News item not found' });
  }
  await deleteDoc('news', req.params.id);
  await logActivity(`Deleted news: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await getDocById('news', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'News item not found' });
  }
  const updated = await updateDoc('news', req.params.id, { isActive: !doc.isActive });
  return res.json(updated);
};
