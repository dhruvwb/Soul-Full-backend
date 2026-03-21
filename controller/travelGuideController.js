const { getAllDocs, createDoc } = require('../utils/firestoreHelpers');

// Get all guides
exports.getAllGuides = async (req, res) => {
  try {
    const guides = (await getAllDocs('travelGuides')).filter(g => g.isActive !== false);
    res.status(200).json(guides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guides' });
  }
};

// Get guide by slug
exports.getGuideBySlug = async (req, res) => {
  try {
    const guides = await getAllDocs('travelGuides');
    const guide = guides.find(g => g.isActive !== false && g.slug === req.params.regionSlug);
    if (!guide) return res.status(404).json({ error: 'Guide not found' });
    res.status(200).json(guide);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guide' });
  }
};

// Create a new guide
exports.createGuide = async (req, res) => {
  try {
    const guide = await createDoc('travelGuides', req.body);
    res.status(201).json(guide);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create guide', details: err.message });
  }
};
