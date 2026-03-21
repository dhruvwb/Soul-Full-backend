const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');
const { logActivity } = require('../services/activityService');
const slugify = require('../utils/slugify');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await getAllDocs('blogs');
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.create = async (req, res) => {
  const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;
  const slugSource = req.body.slug || req.body.title;
  const payload = {
    ...req.body,
    coverImage,
    isActive: parseBoolean(req.body.isActive)
  };
  if (slugSource) {
    payload.slug = slugify(slugSource);
  }
  const doc = await createDoc('blogs', payload);
  await logActivity(`Added blog: ${doc.title}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;
  const slugSource = req.body.slug || req.body.title;
  const payload = {
    ...req.body,
    coverImage: coverImage || req.body.existingCoverImage,
    isActive: parseBoolean(req.body.isActive)
  };
  if (slugSource) {
    payload.slug = slugify(slugSource);
  }

  const doc = await updateDoc('blogs', req.params.id, payload);
  if (!doc) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  await logActivity(`Updated blog: ${doc.title}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await getDocById('blogs', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  await deleteDoc('blogs', req.params.id);
  await logActivity(`Deleted blog: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await getDocById('blogs', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  const updated = await updateDoc('blogs', req.params.id, { isActive: !doc.isActive });
  return res.json(updated);
};
