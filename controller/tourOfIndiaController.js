const { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc } = require('../utils/firestoreHelpers');

// CATEGORY CRUD

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = (await getAllDocs('tourCategories')).filter(c => c.isActive !== false);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const categories = await getAllDocs('tourCategories');
    const category = categories.find(c => c.isActive !== false && c.slug === req.params.categorySlug);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const doc = await createDoc('tourCategories', req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create category', details: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const categories = await getAllDocs('tourCategories');
    const category = categories.find(c => c.slug === req.params.categorySlug);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    const updated = await updateDoc('tourCategories', category.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update category', details: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categories = await getAllDocs('tourCategories');
    const category = categories.find(c => c.slug === req.params.categorySlug);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    await deleteDoc('tourCategories', category.id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

// PACKAGE CRUD

exports.createPackage = async (req, res) => {
  try {
    const categories = await getAllDocs('tourCategories');
    const category = categories.find(c => c.slug === req.params.categorySlug);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const packageData = {
      ...req.body,
      categoryId: category.id,
      categorySlug: category.slug
    };

    const tourPackage = await createDoc('tourPackages', packageData);
    res.status(201).json(tourPackage);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create package', details: err.message });
  }
};

// Get all packages under a category
exports.getPackagesByCategory = async (req, res) => {
  try {
    const packages = (await getAllDocs('tourPackages')).filter(
      p => p.categorySlug === req.params.categorySlug && p.isActive !== false
    );
    res.status(200).json(packages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
};

// Get a specific package by slug under a category
exports.getPackageBySlug = async (req, res) => {
  try {
    const packages = await getAllDocs('tourPackages');
    const pkg = packages.find(
      p => p.categorySlug === req.params.categorySlug && 
           p.slug === req.params.packageSlug && 
           p.isActive !== false
    );
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.status(200).json(pkg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch package' });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const packages = await getAllDocs('tourPackages');
    const pkg = packages.find(
      p => p.categorySlug === req.params.categorySlug && 
           p.slug === req.params.packageSlug
    );
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    const updated = await updateDoc('tourPackages', pkg.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update package', details: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const packages = await getAllDocs('tourPackages');
    const pkg = packages.find(
      p => p.categorySlug === req.params.categorySlug && 
           p.slug === req.params.packageSlug
    );
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    await deleteDoc('tourPackages', pkg.id);
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete package' });
  }
};
