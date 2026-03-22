const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');
const { logActivity } = require('../services/activityService');
const slugify = require('../utils/slugify');

const buildImages = req => (req.files || []).map(file => `/uploads/${file.filename}`);

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

const parseIdList = value => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch (error) {
    return String(value)
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }
};

exports.list = async (req, res) => {
  const items = await getAllDocs('domesticPackages');
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const images = buildImages(req);
    const slugSource = req.body.slug || req.body.title;
    const payload = {
      ...req.body,
      images,
      categoryIds: parseIdList(req.body.categoryIds) || [],
      enquireEnabled: parseBoolean(req.body.enquireEnabled) ?? true,
      isActive: parseBoolean(req.body.isActive) ?? true,
      createdAt: new Date().toISOString()
    };
    if (slugSource) {
      payload.slug = slugify(slugSource);
    }
    
    // Remove undefined values for Firestore
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    
    const doc = await createDoc('domesticPackages', payload);
    await logActivity(`Added domestic package: ${doc.title}`);
    res.status(201).json(doc);
  } catch (error) {
    console.error('❌ Error creating domestic package:', error.message);
    res.status(500).json({ message: 'Failed to create package', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const images = buildImages(req);
    const existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : undefined;
    const slugSource = req.body.slug || req.body.title;

    const payload = {
      ...req.body,
      images: existingImages ? [...existingImages, ...images] : undefined,
      categoryIds: parseIdList(req.body.categoryIds),
      enquireEnabled: parseBoolean(req.body.enquireEnabled),
      isActive: parseBoolean(req.body.isActive)
    };
    if (slugSource) {
      payload.slug = slugify(slugSource);
    }

    // Remove undefined values for Firestore
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const doc = await updateDoc('domesticPackages', req.params.id, payload);

    if (!doc) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await logActivity(`Updated domestic package: ${doc.title}`);
    return res.json(doc);
  } catch (error) {
    console.error('❌ Error updating domestic package:', error.message);
    res.status(500).json({ message: 'Failed to update package', error: error.message });
  }
};

exports.remove = async (req, res) => {
  const doc = await getDocById('domesticPackages', req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Package not found' });
  }
  await deleteDoc('domesticPackages', req.params.id);
  await logActivity(`Deleted domestic package: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  try {
    const doc = await getDocById('domesticPackages', req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Package not found' });
    }
    const updated = await updateDoc('domesticPackages', req.params.id, { isActive: !doc.isActive });
    return res.json(updated);
  } catch (error) {
    console.error('❌ Error toggling domestic package:', error.message);
    res.status(500).json({ message: 'Failed to toggle package', error: error.message });
  }
};
