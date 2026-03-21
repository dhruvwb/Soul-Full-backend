const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');
const { logActivity } = require('../services/activityService');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await getAllDocs('popularPackages');
  items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.create = async (req, res) => {
  const payload = {
    package: req.body.package,
    shortInfo: req.body.shortInfo || '',
    sortOrder: Number(req.body.sortOrder || 0),
    isActive: parseBoolean(req.body.isActive)
  };
  const doc = await createDoc('popularPackages', payload);
  await logActivity('Added popular package');
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const payload = {
    package: req.body.package,
    shortInfo: req.body.shortInfo || '',
    sortOrder: Number(req.body.sortOrder || 0),
    isActive: parseBoolean(req.body.isActive)
  };
  const doc = await updateDoc('popularPackages', req.params.id, payload);
  if (!doc) {
    return res.status(404).json({ message: 'Popular package not found' });
  }
  await logActivity('Updated popular package');
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await getDocById('popularPackages', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Popular package not found' });
  }
  await deleteDoc('popularPackages', req.params.id);
  await logActivity('Deleted popular package');
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await getDocById('popularPackages', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Popular package not found' });
  }
  const updated = await updateDoc('popularPackages', req.params.id, { isActive: !doc.isActive });
  return res.json(updated);
};
