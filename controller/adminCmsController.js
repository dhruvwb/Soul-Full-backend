const { getAllDocs, getDocById, createDoc, updateDoc } = require('../utils/firestoreHelpers');
const { logActivity } = require('../services/activityService');

const CMS_CONFIG_ID = 'cms-config'; // Singleton document ID

exports.get = async (req, res) => {
  const doc = await getDocById('cmsContent', CMS_CONFIG_ID);
  res.json(doc || {});
};

exports.save = async (req, res) => {
  const aboutBannerImage = req.files?.aboutBannerImage?.[0]
    ? `/uploads/${req.files.aboutBannerImage[0].filename}`
    : undefined;
  const aboutImage = req.files?.aboutImage?.[0]
    ? `/uploads/${req.files.aboutImage[0].filename}`
    : undefined;
  const existing = await getDocById('cmsContent', CMS_CONFIG_ID);
  let aboutStats = req.body.aboutStats;
  if (typeof aboutStats === 'string') {
    try {
      aboutStats = JSON.parse(aboutStats);
    } catch (error) {
      aboutStats = [];
    }
  }

  const payload = {
    ...req.body,
    aboutStats,
    aboutBannerImage: aboutBannerImage || req.body.existingAboutBannerImage,
    aboutImage: aboutImage || req.body.existingAboutImage
  };

  let doc;
  if (existing) {
    doc = await updateDoc('cmsContent', CMS_CONFIG_ID, payload);
  } else {
    doc = await createDoc('cmsContent', payload, CMS_CONFIG_ID);
  }

  await logActivity('Updated CMS content');
  res.json(doc);
};
