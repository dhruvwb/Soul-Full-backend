const { getAllDocs } = require('../utils/firestoreHelpers');

const fallbackDestinations = [
  { name: 'Jaipur', enquiriesCount: 87 },
  { name: 'Agra', enquiriesCount: 72 },
  { name: 'Kerala', enquiriesCount: 58 },
  { name: 'Goa', enquiriesCount: 45 },
  { name: 'Varanasi', enquiriesCount: 38 }
];

exports.getStats = async (req, res) => {
  const [enquiries, destinations] = await Promise.all([
    getAllDocs('enquiries'),
    getAllDocs('destinations')
  ]);

  const totalEnquiries = enquiries.length;
  const activeDestinations = destinations
    .filter(d => d.isActive !== false)
    .sort((a, b) => (b.enquiriesCount || 0) - (a.enquiriesCount || 0) || (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0))
    .slice(0, 8);

  const totalVisitors = Number(process.env.TOTAL_VISITORS || 0);
  const popularDestinations = activeDestinations.length > 0 ? activeDestinations : fallbackDestinations;

  res.json({
    totalEnquiries,
    totalVisitors,
    popularDestinations
  });
};
