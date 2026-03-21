const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');
const { logActivity } = require('../services/activityService');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await getAllDocs('reviews');
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.create = async (req, res) => {
  const payload = {
    ...req.body,
    rating: Number(req.body.rating || 5),
    isActive: parseBoolean(req.body.isActive)
  };
  const doc = await createDoc('reviews', payload);
  await logActivity(`Added review: ${doc.name}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const payload = {
    ...req.body,
    rating: Number(req.body.rating || 5),
    isActive: parseBoolean(req.body.isActive)
  };
  const doc = await updateDoc('reviews', req.params.id, payload);
  if (!doc) {
    return res.status(404).json({ message: 'Review not found' });
  }
  await logActivity(`Updated review: ${doc.name}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await getDocById('reviews', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Review not found' });
  }
  await deleteDoc('reviews', req.params.id);
  await logActivity(`Deleted review: ${doc.name}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await getDocById('reviews', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Review not found' });
  }
  const updated = await updateDoc('reviews', req.params.id, { isActive: !doc.isActive });
  return res.json(updated);
};
