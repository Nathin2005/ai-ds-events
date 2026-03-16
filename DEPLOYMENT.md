# AI & DS Event Management - Deployment Guide

## 🎯 Deployment Stack
- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier)
- **Database**: MongoDB Atlas (Free tier)
- **Images**: Cloudinary (Free tier)

## 📋 Prerequisites

Before starting, create accounts for:

1. **GitHub Account** - To store your code
2. **MongoDB Atlas** - For cloud database
3. **Cloudinary** - For image storage
4. **Render** - For backend hosting
5. **Vercel** - For frontend hosting

---

## 🗄️ Step 1: Setup MongoDB Atlas (5 minutes)

### 1.1 Create Account & Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create account
3. Create a new project (name it "AI-DS-Events")
4. Click "Build a Database"
5. Choose **"M0 Sandbox"** (Free tier)
6. Select **AWS** and closest region
7. Name cluster "ai-ds-events" and click "Create"

### 1.2 Create Database User
1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Username: `admin`
4. Password: Generate secure password (save it!)
5. Privileges: **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Configure Network Access
1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.4 Get Connection String
1. Go to **"Clusters"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your database password
5. Add database name: `/ai-ds-events` before the `?`

**Final format:**
```
mongodb+srv://admin:yourpassword@ai-ds-events.xxxxx.mongodb.net/ai-ds-events?retryWrites=true&w=majority
```

---

## 📷 Step 2: Setup Cloudinary (3 minutes)

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Go to **Dashboard**
4. Copy these values:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

---

## 🚀 Step 3: Deploy Backend to Render (10 minutes)

### 3.1 Push Code to GitHub

1. **Initialize Git Repository** (if not already done)
   - Open terminal in your project root
   - Initialize git: `git init`
   - Add all files: `git add .`
   - Make first commit: `git commit -m "Initial commit"`

2. **Create GitHub Repository**
   - Go to [GitHub.com](https://github.com) and login
   - Click the **"+"** button → **"New repository"**
   - Repository name: `ai-ds-events` (or your preferred name)
   - Make it **Public** (required for free Render deployment)
   - Don't initialize with README (since you already have files)
   - Click **"Create repository"**

3. **Connect Local Repository to GitHub**
   - Copy the repository URL from GitHub
   - In terminal, add remote: `git remote add origin https://github.com/yourusername/ai-ds-events.git`
   - Push code: `git push -u origin main`

4. **Verify Upload**
   - Refresh your GitHub repository page
   - You should see all your project files including `frontend/` and `backend/` folders

### 3.2 Deploy on Render
1. Go to [Render](https://render.com/)
2. Click **"Get Started for Free"** and sign up
3. Connect your **GitHub account**
4. Click **"New +"** → **"Web Service"**
5. Select your repository
6. Configure settings:

**Basic Settings:**
- **Name**: `ai-ds-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Plan Type**: Free
- **Auto-Deploy**: Yes

### 3.3 Set Environment Variables
In Render dashboard, go to **Environment** tab and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-ds-events?retryWrites=true&w=majority
JWT_SECRET=aB9xK2mP8qR5vN3wE7yT1uI6oL4sD0fG9hJ2kM5nQ8rV1xC3zA6bE9yW2tU5iO8pL
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**⚠️ Important Notes:**
- Replace MongoDB URI with your actual Atlas connection string
- Include `/ai-ds-events` database name in the URI
- Add `?retryWrites=true&w=majority` parameters
- Use your actual Cloudinary credentials
- **FRONTEND_URL**: Just the domain, NO `/api` at the end
- FRONTEND_URL will be updated after frontend deployment

### 3.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://your-app-name.onrender.com`

### 3.5 Test Backend
Visit: `https://your-app-name.onrender.com/api/health`
You should see: `{"success":true,"status":"OK",...}`

---

## 🌐 Step 4: Deploy Frontend to Vercel (5 minutes)

### 4.1 Deploy on Vercel
1. Go to [Vercel](https://vercel.com/)
2. Click **"Start Deploying"** and sign up
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Configure settings:

**Project Settings:**
- **Project Name**: `ai-ds-frontend`
- **Framework Preset**: `Create React App`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 4.2 Set Environment Variables
Before deploying, add environment variable:
- **Name**: `REACT_APP_API_URL`
- **Value**: `https://your-backend-url.onrender.com/api`

### 4.3 Deploy
1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes)
3. Copy your frontend URL: `https://your-app-name.vercel.app`

### 4.4 Update Backend FRONTEND_URL
1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy backend (it will restart automatically)

---

## ✅ Step 5: Final Testing (5 minutes)

### 5.1 Test Complete Application
1. Visit your frontend URL
2. Navigate through the site
3. Test admin login:
   - Go to `/admin/login`
   - Username: `admin`
   - Password: `admin123`

### 5.2 Test API Endpoints
```bash
# Health check
curl https://your-backend-url.onrender.com/api/health

# Get events
curl https://your-backend-url.onrender.com/api/events

# Test admin login
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🔧 Step 6: Post-Deployment Configuration

### 6.1 Change Default Admin Password
1. Login to admin panel
2. Create a new admin user with secure credentials
3. Update environment variables if needed

### 6.2 Add Sample Events (Optional)
The system will automatically create sample events on first run.

### 6.3 Custom Domain (Optional)
- **Vercel**: Add custom domain in project settings
- **Render**: Add custom domain in service settings

---

## 📱 Quick Deployment Commands

If you prefer command line:

```bash
# Install CLIs
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Backend deploys automatically via GitHub
```

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Git & GitHub Issues

**1. Repository Already Exists Error**
```
fatal: remote origin already exists
```
**Solution**: 
- Remove existing remote: `git remote remove origin`
- Add new remote: `git remote add origin https://github.com/yourusername/ai-ds-events.git`
- Push: `git push -u origin main`

**2. Authentication Failed**
**Solutions**:
- Use GitHub Personal Access Token instead of password
- Or use GitHub Desktop app for easier authentication
- Or use SSH keys (advanced)

**3. Large Files Warning**
**Solution**: 
- Add `.gitignore` file to exclude `node_modules/` folders
- Remove node_modules: `git rm -r --cached node_modules`
- Commit changes: `git commit -m "Remove node_modules"`

#### Backend Issues

**1. Build Failed on Render**
```
Error: Cannot find module 'xyz'
```
**Solution**: Check `backend/package.json` dependencies
```bash
cd backend
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**2. Database Connection Failed**
```
MongoNetworkError: connection timed out
```
**Solutions**:
- Verify MongoDB Atlas connection string
- Check Network Access allows 0.0.0.0/0
- Ensure database user exists with correct password

**3. Environment Variables Not Working**
**Solution**: In Render dashboard:
- Go to Environment tab
- Ensure no extra spaces in variable names/values
- Redeploy after changes

**4. CORS Errors**
```
Access to fetch blocked by CORS policy
```
**Solution**: Update `FRONTEND_URL` in backend environment variables

#### Frontend Issues

**1. API Calls Failing**
```
Network Error or 404
```
**Solutions**:
- Check `REACT_APP_API_URL` environment variable
- Ensure backend URL ends with `/api`
- Test backend health endpoint first

**2. Build Failed on Vercel**
```
Module not found or Build failed
```
**Solution**: 
```bash
cd frontend
npm install
npm run build  # Test locally first
```

**3. Environment Variables Not Loading**
- Ensure variable name starts with `REACT_APP_`
- Redeploy after adding environment variables

#### General Issues

**1. 500 Internal Server Error**
- Check Render logs: Dashboard → Logs tab
- Look for specific error messages

**2. Slow Cold Starts (Render Free Tier)**
- Free tier services sleep after 15 minutes
- First request may take 30+ seconds
- Consider upgrading for production use

---

## 📊 Monitoring & Maintenance

### Check Application Health

**Backend Health Check:**
```bash
curl https://your-backend-url.onrender.com/api/health
```

**Database Status:**
```bash
curl https://your-backend-url.onrender.com/api/db-status
```

### View Logs

**Render Logs:**
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab

**Vercel Logs:**
1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions" → "View Logs"

### Performance Monitoring

**MongoDB Atlas:**
- Monitor database usage in Atlas dashboard
- Set up alerts for connection issues

**Render:**
- Monitor CPU/Memory usage
- Check response times

---

## 🔒 Security Checklist

### Before Going Live

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Restrict MongoDB Atlas IP access (optional)
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Review CORS settings
- [ ] Set up proper error handling
- [ ] Enable rate limiting (already configured)

### Regular Maintenance

- [ ] Rotate JWT secrets periodically
- [ ] Monitor database usage
- [ ] Update dependencies regularly
- [ ] Backup important data
- [ ] Monitor application logs

---

## 💰 Cost Breakdown (Free Tiers)

| Service | Free Tier Limits | Upgrade Cost |
|---------|------------------|--------------|
| **Render** | 750 hours/month, sleeps after 15min | $7/month for always-on |
| **Vercel** | 100GB bandwidth, unlimited deployments | $20/month for team features |
| **MongoDB Atlas** | 512MB storage, shared RAM | $9/month for dedicated |
| **Cloudinary** | 25GB storage, 25GB bandwidth | $89/month for more storage |

**Total Free Tier**: Perfect for development and small production apps
**Estimated Monthly Cost for Production**: $25-45/month

---

## 🚀 Going to Production

### Performance Optimizations

1. **Enable Caching**
   - Add Redis for session storage
   - Implement API response caching

2. **Database Optimization**
   - Add database indexes
   - Implement connection pooling
   - Consider read replicas

3. **CDN & Assets**
   - Optimize images with Cloudinary transformations
   - Enable Vercel's Edge Network

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Add performance monitoring
   - Configure uptime monitoring

### Scaling Considerations

- **Render**: Upgrade to paid plan for better performance
- **MongoDB Atlas**: Move to dedicated cluster
- **Cloudinary**: Upgrade for more storage/bandwidth
- **Consider**: Load balancing, database sharding

---

## 📞 Support Resources

- **Render Support**: [render.com/docs](https://render.com/docs)
- **Vercel Support**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Cloudinary**: [cloudinary.com/documentation](https://cloudinary.com/documentation)

---

## 🎉 Congratulations!

Your AI & DS Event Management System is now live! 

**Frontend**: `https://your-app-name.vercel.app`
**Backend**: `https://your-app-name.onrender.com`
**Admin Panel**: `https://your-app-name.vercel.app/admin/login`

Share your deployed application and start managing events! 🚀
