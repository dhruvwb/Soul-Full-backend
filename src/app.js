// src/app.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./db');
const { ensureSeedAdmin } = require('../controller/adminAuthController');
const { ensureSeedCustomPackages } = require('../controller/customPackageSeed');

// Load environment variables
dotenv.config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// Connect to MongoDB (non-blocking - won't crash app if fails)
connectDB().catch(err => {
  console.error('⚠️ DB initialization error (app will continue):', err.message);
});

// Run seeding operations (non-blocking)
Promise.all([
  ensureSeedAdmin().catch(err => console.warn('⚠️ Admin seeding skipped:', err.message)),
  ensureSeedCustomPackages().catch(err => console.warn('⚠️ Package seeding skipped:', err.message))
]).catch(err => console.warn('⚠️ Seeding error:', err.message));

const app = express();

// Middleware - CORS with detailed logging
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

console.log('✅ CORS Allowed Origins:', allowedOrigins);

app.use(
    cors({
        origin: (origin, callback) => {
            console.log('🔍 CORS Check - Origin:', origin);
            if (!origin || allowedOrigins.includes(origin)) {
                console.log('✅ CORS allowed for:', origin);
                return callback(null, true);
            }
            console.warn('❌ CORS blocked for:', origin);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routers
const experiencesRouter = require('../router/experiencesRouter');
const toursOfIndiaRouter = require('../router/tourOfIndiaRouter');
const bestTimeToVisitRouter = require('../router/bestTimeToVisitRouter');
const travelGuideRouter = require('../router/travelGuideRouter');
const enquiryRouter = require('../router/enquiryRouter');
const contactRouter = require('../router/contactRouter');
const adminAuthRouter = require('../router/adminAuthRouter');
const adminDomesticRouter = require('../router/adminDomesticRouter');
const adminBlogRouter = require('../router/adminBlogRouter');
const adminReviewRouter = require('../router/adminReviewRouter');
const adminPackageCategoryRouter = require('../router/adminPackageCategoryRouter');
const adminPopularPackageRouter = require('../router/adminPopularPackageRouter');
const adminNewsRouter = require('../router/adminNewsRouter');
const adminGalleryRouter = require('../router/adminGalleryRouter');
const adminCmsRouter = require('../router/adminCmsRouter');
const adminEnquiryRouter = require('../router/adminEnquiryRouter');
const adminActivityRouter = require('../router/adminActivityRouter');
const adminDestinationRouter = require('../router/adminDestinationRouter');
const adminCustomPackageRouter = require('../router/adminCustomPackageRouter');
const adminStatsRouter = require('../router/adminStatsRouter');
const adminUploadRouter = require('../router/adminUploadRouter');
const publicRouter = require('../router/publicRouter');

// Mount routers
app.use('/api/experiences', experiencesRouter);
app.use('/api/tours-of-india', toursOfIndiaRouter);
app.use('/api/best-time-to-visit', bestTimeToVisitRouter);
app.use('/api/travel-guide', travelGuideRouter);
app.use('/api/enquiry', enquiryRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/domestic', adminDomesticRouter);
app.use('/api/admin/blogs', adminBlogRouter);
app.use('/api/admin/reviews', adminReviewRouter);
app.use('/api/admin/package-categories', adminPackageCategoryRouter);
app.use('/api/admin/popular-packages', adminPopularPackageRouter);
app.use('/api/admin/news', adminNewsRouter);
app.use('/api/admin/gallery', adminGalleryRouter);
app.use('/api/admin/cms', adminCmsRouter);
app.use('/api/admin/enquiries', adminEnquiryRouter);
app.use('/api/admin/activity', adminActivityRouter);
app.use('/api/admin/destinations', adminDestinationRouter);
app.use('/api/admin/custom-packages', adminCustomPackageRouter);
app.use('/api/admin/stats', adminStatsRouter);
app.use('/api/admin/upload', adminUploadRouter);
app.use('/api/public', publicRouter);
//app.use('/api/contact', contactRouter);


// Sample route
app.get('/', (req, res) => {
    res.send('🌍 Travel backend is running!');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ ERROR:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body
    });
    
    // Handle multer errors gracefully
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large' });
    }
    if (err.message && err.message.includes('Only image')) {
        return res.status(400).json({ message: err.message });
    }
    
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Server Error'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
