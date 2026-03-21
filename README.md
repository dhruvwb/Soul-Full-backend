# 🌍 Soulful India Tours - Backend API

> Node.js + Express REST API for travel/tour management platform

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

```bash
# 1. Navigate to backend folder
cd TravelWebBackend-main/Backend

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env

# 4. Fill in .env with your values
# Edit .env and update:
# - MONGODB_URI
# - JWT_SECRET
# - EMAIL credentials (optional for testing)

# 5. Run development server
npm run dev

# Server should run at http://localhost:5000 🎉
```

---

## 🔐 Environment Variables

Create a `.env` file in `TravelWebBackend-main/Backend/` with:

```env
# Server
PORT=5000
NODE_ENV=development

# Database - Local (Development)
MONGODB_URI=mongodb://127.0.0.1:27017/TravelWeb

# OR Database - MongoDB Atlas (Production)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT
JWT_SECRET=your_random_secret_key_min_32_chars_please
JWT_EXPIRE=7d

# CORS - Allowed frontend origins
FRONTEND_ORIGINS=http://localhost:3000,http://localhost:3001

# Email Configuration (for sending emails)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_specific_password
EMAIL_FROM=noreply@soulfulindiatours.com

# Admin Seeding (first time setup)
ADMIN_EMAIL=admin@soulfulindiatours.com
ADMIN_PASSWORD=Admin@123

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### 📝 Getting Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Search for "App passwords"
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password and paste in `.env`

---

## 💻 Running Locally

### Development Mode (with auto-reload)
```bash
npm run dev
# Output: 🚀 Server running at http://localhost:5000
```

### Production Mode
```bash
npm start
```

### Check if Server is Running
```bash
# Open browser and visit:
http://localhost:5000/

# Should show: "🌍 Travel backend is running!"
```

---

## 📚 API Endpoints

### Base URL: `http://localhost:5000/api`

### Public Endpoints (No authentication needed)

#### Tours & Experiences
```
GET    /experiences              - Get all experiences
GET    /experiences/:id          - Get single experience
GET    /tours-of-india           - Get all India tours
GET    /best-time-to-visit       - Best time info
GET    /travel-guide             - Travel guides
```

#### User Actions
```
POST   /enquiry                  - Submit tour enquiry
POST   /contact                  - Submit contact form
GET    /public                   - Public data
```

### Admin Endpoints (Authentication required)

#### Authentication
```
POST   /admin/auth/login         - Admin login
POST   /admin/auth/logout        - Admin logout
POST   /admin/auth/refresh       - Refresh JWT token
```

#### Content Management
```
GET    /admin/blogs              - Get all blogs
POST   /admin/blogs              - Create blog
PUT    /admin/blogs/:id          - Update blog
DELETE /admin/blogs/:id          - Delete blog

GET    /admin/gallery            - Get gallery
POST   /admin/gallery            - Upload gallery image

GET    /admin/destinations       - Get destinations
POST   /admin/destinations       - Add destination

GET    /admin/packages           - Get packages
POST   /admin/packages           - Create package
PUT    /admin/packages/:id       - Update package

GET    /admin/popular-packages   - Get popular packages
POST   /admin/popular-packages   - Create popular package

GET    /admin/news               - Get news
POST   /admin/news               - Create news

GET    /admin/reviews            - Get reviews
POST   /admin/reviews            - Add review
```

#### Admin Dashboard
```
GET    /admin/enquiries          - Get all enquiries
GET    /admin/enquiries/:id      - Get enquiry details
PUT    /admin/enquiries/:id      - Update enquiry status

GET    /admin/stats              - Dashboard statistics
GET    /admin/activity           - Recent activities
```

#### File Upload
```
POST   /admin/upload             - Upload image/file
```

---

## 🧪 Testing with Postman

### 1. Download Postman
- https://www.postman.com/downloads/

### 2. Test Endpoints

#### Test 1: Check Server
```
GET http://localhost:5000/
Expected: "🌍 Travel backend is running!"
```

#### Test 2: Admin Login
```
POST http://localhost:5000/api/admin/auth/login

Body (JSON):
{
  "email": "admin@soulfulindiatours.com",
  "password": "Admin@123"
}

Expected Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "admin@soulfulindiatours.com",
    "role": "admin"
  }
}
```

#### Test 3: Get Tours (Public)
```
GET http://localhost:5000/api/experiences

Expected: Array of tour objects
```

#### Test 4: Create Blog (Admin)
```
POST http://localhost:5000/api/admin/blogs

Headers:
Authorization: Bearer <your_jwt_token_from_login>

Body (JSON):
{
  "title": "Top 10 Travel Tips",
  "content": "Here are the best travel tips...",
  "author": "Admin",
  "category": "travel-tips"
}
```

---

## 🗄️ Using Dummy Data (Before Database)

If you don't have MongoDB set up yet, you can use dummy data for testing:

```bash
# In your controller files, import dummy data:
const { getDummyList, getDummyItem } = require('../utils/dummyData');

// In route handlers:
router.get('/', (req, res) => {
  const tours = getDummyList('tours');
  res.json(tours);
});
```

See `utils/dummyData.js` for all available dummy data.

---

## 🌐 Setting Up MongoDB Atlas (Production Database)

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Create account with email

### Step 2: Create Cluster
1. Click "Create" cluster
2. Choose **Free** tier
3. Select region closest to you
4. Click "Create Cluster"
5. Wait 2-3 minutes for deployment

### Step 3: Get Connection String
1. Click "Connect" button
2. Select "Connect your application"
3. Choose "Node.js" driver
4. Copy connection string
5. Replace `<password>` with your database password
6. Paste in `.env` as `MONGODB_URI`

### Step 4: Add IP to Whitelist
1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (or add specific IPs)
4. Click "Confirm"

### Example Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

---

## 🚀 Deploying to Render

### Prerequisites
- GitHub account with code pushed
- Render account (https://render.com)

### Step 1: Connect GitHub
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repos

### Step 2: Create Web Service
1. Click "New +"
2. Select "Web Service"
3. Choose your GitHub repository
4. Click "Connect"

### Step 3: Configure Deployment
```
Name:                  soulful-india-backend
Root Directory:        TravelWebBackend-main/Backend
Runtime:               Node
Build Command:         npm install
Start Command:         npm start
Environment:           Node
```

### Step 4: Add Environment Variables
Click "Advanced" and add:
```
PORT                   5000
NODE_ENV               production
MONGODB_URI            mongodb+srv://...
JWT_SECRET             your_production_secret_key
FRONTEND_ORIGINS       https://your-vercel-frontend.vercel.app
EMAIL_SERVICE          gmail
EMAIL_USER             your_email@gmail.com
EMAIL_PASSWORD         app_password
```

### Step 5: Deploy
Click "Create Web Service" and wait 5-10 minutes.

### Get Live URL
Your backend URL: `https://your-service-name.onrender.com`

---

## 🐛 Troubleshooting

### Issue: Port already in use
```bash
# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Issue: MongoDB connection failed
- Check `MONGODB_URI` in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Verify username/password are correct
- Check internet connection

### Issue: CORS errors in frontend
- Update `FRONTEND_ORIGINS` in `.env`
- Format: `http://localhost:3000,http://localhost:3001`
- No spaces between origins

### Issue: JWT token expired
- Increase `JWT_EXPIRE` in `.env` (e.g., `30d`)
- Or implement refresh token endpoint

### Issue: .env file not loading
```bash
# Verify .env is in correct location:
TravelWebBackend-main/Backend/.env

# Restart server:
npm run dev
```

### Issue: Nodemon not restarting
```bash
# Clear nodemon cache
npm install -g nodemon
nodemon --exec node src/app.js
```

---

## 📖 Documentation

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT Docs](https://jwt.io/)

---

## 📞 Support

Need help? Check:
1. This README
2. Logs in terminal
3. Postman test results
4. `.env` file configuration

---

## ✅ Deployment Checklist

- [ ] `.env` file created with all variables
- [ ] MongoDB Atlas database set up
- [ ] Local testing done with `npm run dev`
- [ ] API endpoints tested in Postman
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Production environment variables set
- [ ] Backend deployed and live
- [ ] Frontend connected to live backend

---

**Happy coding! 🚀**
