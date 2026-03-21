const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');
const { logActivity } = require('../services/activityService');
const slugify = require('../utils/slugify');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await getAllDocs('experiences');
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.create = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const slugSource = req.body.slug || req.body.title;
  const payload = {
    title: req.body.title,
    description: req.body.description || '',
    imageUrl,
    slug: slugSource ? slugify(slugSource) : undefined,
    isActive: parseBoolean(req.body.isActive)
  };
  const doc = await createDoc('experiences', payload);
  await logActivity(`Added customized package: ${doc.title}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const slugSource = req.body.slug || req.body.title;
  const payload = {
    title: req.body.title,
    description: req.body.description || '',
    imageUrl: imageUrl || req.body.existingImage,
    slug: slugSource ? slugify(slugSource) : undefined,
    isActive: parseBoolean(req.body.isActive)
  };

  const doc = await updateDoc('experiences', req.params.id, payload);
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  await logActivity(`Updated customized package: ${doc.title}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await getDocById('experiences', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  await deleteDoc('experiences', req.params.id);
  await logActivity(`Deleted customized package: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await getDocById('experiences', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  const updated = await updateDoc('experiences', req.params.id, { isActive: !doc.isActive });
  return res.json(updated);
};
