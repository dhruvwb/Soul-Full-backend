const CustomPackage = require('../models/customPackageModel');
const { logActivity } = require('../services/activityService');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await CustomPackage.find().sort({ createdAt: -1 });
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
  const doc = await CustomPackage.create(payload);
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

  const doc = await CustomPackage.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  await logActivity(`Updated customized package: ${doc.title}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await CustomPackage.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  await logActivity(`Deleted customized package: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await CustomPackage.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  doc.isActive = !doc.isActive;
  await doc.save();
  return res.json(doc);
};
