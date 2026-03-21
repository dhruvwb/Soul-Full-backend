const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');
const { logActivity } = require('../services/activityService');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await getAllDocs('customPackages');
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.create = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const payload = {
    category: req.body.category,
    title: req.body.title,
    description: req.body.description || '',
    imageUrl,
    isActive: parseBoolean(req.body.isActive)
  };
  const doc = await createDoc('customPackages', payload);
  await logActivity(`Added customized package: ${doc.title}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const payload = {
    category: req.body.category,
    title: req.body.title,
    description: req.body.description || '',
    imageUrl: imageUrl || req.body.existingImage,
    isActive: parseBoolean(req.body.isActive)
  };

  const doc = await updateDoc('customPackages', req.params.id, payload);
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  await logActivity(`Updated customized package: ${doc.title}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await getDocById('customPackages', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  await deleteDoc('customPackages', req.params.id);
  await logActivity(`Deleted customized package: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await getDocById('customPackages', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  const updated = await updateDoc('customPackages', req.params.id, { isActive: !doc.isActive });
  return res.json(updated);
};
