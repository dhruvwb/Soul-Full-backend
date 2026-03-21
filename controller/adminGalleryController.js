const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');
const { logActivity } = require('../services/activityService');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

const getMediaType = file => {
  if (!file) return undefined;
  return file.mimetype.startsWith('video/') ? 'video' : 'image';
};

const buildItemsFromFiles = (files, basePayload) =>
  (files || []).map(file => ({
    ...basePayload,
    mediaUrl: `/uploads/${file.filename}`,
    mediaType: getMediaType(file)
  }));

exports.list = async (req, res) => {
  const items = await getAllDocs('galleryItems');
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.create = async (req, res) => {
  const files = req.files || [];
  if (files.length === 0) {
    return res.status(400).json({ message: 'Media file is required' });
  }
  const basePayload = {
    title: req.body.title || '',
    place: req.body.place || '',
    shortDescription: req.body.shortDescription || '',
    description: req.body.description || '',
    isActive: parseBoolean(req.body.isActive)
  };
  const items = buildItemsFromFiles(files, basePayload);
  // Create multiple documents (one per file)
  const docs = await Promise.all(items.map(item => createDoc('galleryItems', item)));
  await logActivity(`Added ${docs.length} gallery item(s)`);
  res.status(201).json(docs);
};

exports.update = async (req, res) => {
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const mediaType = req.file ? getMediaType(req.file) : undefined;
  const payload = {
    title: req.body.title || '',
    place: req.body.place || '',
    shortDescription: req.body.shortDescription || '',
    description: req.body.description || '',
    mediaUrl: mediaUrl || req.body.existingMediaUrl,
    mediaType: mediaType || req.body.existingMediaType,
    isActive: parseBoolean(req.body.isActive)
  };

  const doc = await updateDoc('galleryItems', req.params.id, payload);
  if (!doc) {
    return res.status(404).json({ message: 'Gallery item not found' });
  }
  await logActivity(`Updated gallery item: ${doc.title || doc.mediaType}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await getDocById('galleryItems', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Gallery item not found' });
  }
  await deleteDoc('galleryItems', req.params.id);
  await logActivity(`Deleted gallery item: ${doc.title || doc.mediaType}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await getDocById('galleryItems', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Gallery item not found' });
  }
  const updated = await updateDoc('galleryItems', req.params.id, { isActive: !doc.isActive });
  return res.json(updated);
};
