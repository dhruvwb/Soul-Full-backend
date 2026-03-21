const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await getAllDocs('charDhamYatra');
    const active = categories.filter(c => c.isActive !== false);
    res.status(200).json(active);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const categories = await getAllDocs('charDhamYatra');
    const category = categories.find(c => c.slug === req.params.slug);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const category = await createDoc('charDhamYatra', req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create category', details: err.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const categories = await getAllDocs('charDhamYatra');
    const category = categories.find(c => c.slug === req.params.slug);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    const updated = await updateDoc('charDhamYatra', category._id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update category', details: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const categories = await getAllDocs('charDhamYatra');
    const category = categories.find(c => c.slug === req.params.slug);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    await deleteDoc('charDhamYatra', category._id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
