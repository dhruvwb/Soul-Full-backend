const { getAllDocs } = require('../utils/firestoreHelpers');
const slugify = require('../utils/slugify');

exports.getDomesticPackages = async (req, res) => {
  const items = (await getAllDocs('domesticPackages')).filter(i => i.isActive !== false);
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.getDomesticPackageBySlug = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();
  const items = await getAllDocs('domesticPackages');
  let item = items.find(i => i.isActive !== false && i.slug === slug);
  if (!item) {
    const match = items.find(entry => entry.isActive !== false && slugify(entry.slug || entry.title) === slug);
    if (match) {
      item = match;
    }
  }
  if (!item) {
    return res.status(404).json({ message: 'Package not found' });
  }
  return res.json(item);
};

exports.getPackageCategories = async (req, res) => {
  const items = (await getAllDocs('packageCategories')).filter(i => i.isActive !== false);
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.getPackagesByCategory = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();
  const categories = await getAllDocs('packageCategories');
  const category = categories.find(c => c.isActive !== false && c.slug === slug);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  const packages = (await getAllDocs('domesticPackages')).filter(
    p => p.isActive !== false && p.categoryIds && p.categoryIds.includes(category.id)
  );
  packages.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  return res.json({ category, packages });
};

exports.getPopularPackages = async (req, res) => {
  const items = (await getAllDocs('popularPackages')).filter(i => i.isActive !== false);
  items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.getBlogs = async (req, res) => {
  const items = (await getAllDocs('blogs')).filter(i => i.isActive !== false);
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.getBlogBySlug = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();
  const items = await getAllDocs('blogs');
  let item = items.find(i => i.isActive !== false && i.slug === slug);
  if (!item) {
    const match = items.find(entry => entry.isActive !== false && slugify(entry.slug || entry.title) === slug);
    if (match) {
      item = match;
    }
  }
  if (!item) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  return res.json(item);
};

exports.getNews = async (req, res) => {
  const items = (await getAllDocs('news')).filter(i => i.isActive !== false);
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.getGallery = async (req, res) => {
  const items = (await getAllDocs('galleryItems')).filter(i => i.isActive !== false);
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.getReviews = async (req, res) => {
  const items = (await getAllDocs('reviews')).filter(i => i.isActive !== false);
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.getCms = async (req, res) => {
  const docs = await getAllDocs('cmsContent');
  const doc = docs.length > 0 ? docs[0] : {};
  res.json(doc);
};

const customCategories = [
  { key: 'honeymoon', label: 'Honeymoon Packages' },
  { key: 'yoga', label: 'Yoga Retreats' },
  { key: 'eco', label: 'Eco Tourism' },
  { key: 'spiritual', label: 'Spiritual Tours' }
];

exports.getCustomPackageCategories = async (req, res) => {
  const packages = (await getAllDocs('customPackages')).filter(p => p.isActive !== false);
  packages.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  const categories = customCategories.map(category => {
    const match = packages.find(item => item.category === category.key && item.imageUrl);
    return {
      ...category,
      imageUrl: match ? match.imageUrl : ''
    };
  });
  res.json(categories);
};

exports.getCustomPackages = async (req, res) => {
  const category = String(req.query.category || '').toLowerCase();
  let items = await getAllDocs('customPackages');
  items = items.filter(i => i.isActive !== false);
  if (category) {
    items = items.filter(i => i.category === category);
  }
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.getDestinations = async (req, res) => {
  const items = (await getAllDocs('destinations')).filter(i => i.isActive !== false);
  items.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
  res.json(items);
};

exports.getDestinationBySlug = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();
  const items = await getAllDocs('destinations');
  let item = items.find(i => i.isActive !== false && i.slug === slug);
  if (!item) {
    const match = items.find(entry => entry.isActive !== false && slugify(entry.slug || entry.name) === slug);
    if (match) {
      item = match;
    }
  }
  if (!item) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  return res.json(item);
};
