const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');
const { logActivity } = require('../services/activityService');
const slugify = require('../utils/slugify');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

const buildImages = req => {
  // Handle both upload.array (req.files is array) and upload.fields (req.files is object)
  if (Array.isArray(req.files)) {
    return req.files.map(file => `/uploads/${file.filename}`);
  }
  if (req.files && typeof req.files === 'object') {
    const allFiles = [...(req.files.images || []), ...(req.files.image || [])];
    return allFiles.map(file => `/uploads/${file.filename}`);
  }
  return [];
};

exports.list = async (req, res) => {
  const items = await getAllDocs('destinations');
  items.sort((a, b) => (b.enquiriesCount || 0) - (a.enquiriesCount || 0) || (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.create = async (req, res) => {
  const images = buildImages(req);
  const slugSource = req.body.slug || req.body.name;
  const payload = {
    ...req.body,
    images,
    slug: slugSource ? slugify(slugSource) : undefined,
    enquireEnabled: parseBoolean(req.body.enquireEnabled),
    enquiriesCount: Number(req.body.enquiriesCount || 0),
    isActive: parseBoolean(req.body.isActive)
  };
  // Remove raw form fields that shouldn't go to the model
  delete payload.existingImages;
  delete payload.existingImage;
  const doc = await createDoc('destinations', payload);
  await logActivity(`Added destination: ${doc.name}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const images = buildImages(req);
  let existingImages;
  if (req.body.existingImages) {
    existingImages = JSON.parse(req.body.existingImages);
  } else if (req.body.existingImage) {
    // Backward compatibility: single image from old admin
    existingImages = [req.body.existingImage];
  }
  const slugSource = req.body.slug || req.body.name;

  const mergedImages = existingImages || images.length
    ? [...(existingImages || []), ...images]
    : undefined;

  const payload = {
    ...req.body,
    images: mergedImages,
    slug: slugSource ? slugify(slugSource) : undefined,
    enquireEnabled: parseBoolean(req.body.enquireEnabled),
    enquiriesCount: Number(req.body.enquiriesCount || 0),
    isActive: parseBoolean(req.body.isActive)
  };
  // Remove raw form fields that shouldn't go to the model
  delete payload.existingImages;
  delete payload.existingImage;

  const doc = await updateDoc('destinations', req.params.id, payload);
  if (!doc) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  await logActivity(`Updated destination: ${doc.name}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await getDocById('destinations', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  await deleteDoc('destinations', req.params.id);
  await logActivity(`Deleted destination: ${doc.name}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await getDocById('destinations', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  const updated = await updateDoc('destinations', req.params.id, { isActive: !doc.isActive });
  return res.json(updated);
};
