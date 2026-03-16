# Deploy Backend to Vercel

## 🚀 Complete Guide: Backend + Frontend on Vercel

### Step 1: Prepare Backend for Vercel

I've already configured:
- ✅ `backend/vercel.json` - Vercel configuration
- ✅ `backend/api/index.js` - Serverless function entry point
- ✅ Modified `backend/server.js` - Serverless compatibility

### Step 2: Deploy Backend to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select your GitHub repository
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - Click "Deploy"

3. **Set Environment Variables**
   After deployment, go to Settings → Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://hareeshragavan404_db_user:hareesh86820@cluster0.cao4dak.mongodb.net/ai-ds-events?retryWrites=true&w=majority
   JWT_SECRET=aB9xK2mP8qR5vN3wE7yT1uI6oL4sD0fG9hJ2kM5nQ8rV1xC3zA6bE9yW2tU5iO8pL
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=dcklece1w
   CLOUDINARY_API_KEY=183642849123838
   CLOUDINARY_API_SECRET=Ksv4Reaw9_TrAbVdyKVtJ22w0L8
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Redeploy**
   - Go to Deployments → Redeploy

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy backend
cd backend
vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
# ... add all other variables

# Deploy to production
vercel --prod
```

### Step 3: Deploy Frontend to Vercel

1. **Create New Project**
   - Go to Vercel Dashboard
   - Click "Add New" → "Project"
   - Select your repository
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App

2. **Set Environment Variable**
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.vercel.app/api`
   - Click "Deploy"

### Step 4: Update CORS Settings

1. **Get Frontend URL** from Vercel
2. **Update Backend Environment Variables**:
   - Go to backend project → Settings → Environment Variables
   - Update `FRONTEND_URL` with your frontend Vercel URL
   - Redeploy backend

### Step 5: Test Deployment

1. **Test Backend**:
   - Visit: `https://your-backend-url.vercel.app/api/health`
   - Should return: `{"success":true,"status":"OK",...}`

2. **Test Frontend**:
   - Visit your frontend URL
   - Try admin login: username `admin`, password `admin123`

## 🔧 Vercel Backend Benefits

- ✅ **Serverless Functions** - Auto-scaling
- ✅ **Global Edge Network** - Fast worldwide
- ✅ **Automatic HTTPS** - Secure by default
- ✅ **Zero Configuration** - Works out of the box
- ✅ **Free Tier** - Generous limits
- ✅ **Same Platform** - Frontend + Backend together

## 📋 Environment Variables Summary

### Backend Environment Variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.net/ai-ds-events?retryWrites=true&w=majority
JWT_SECRET=aB9xK2mP8qR5vN3wE7yT1uI6oL4sD0fG9hJ2kM5nQ8rV1xC3zA6bE9yW2tU5iO8pL
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=dcklece1w
CLOUDINARY_API_KEY=183642849123838
CLOUDINARY_API_SECRET=Ksv4Reaw9_TrAbVdyKVtJ22w0L8
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend Environment Variables:
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

## 🚨 Important Notes

1. **Serverless Limitations**:
   - 10-second execution timeout
   - Cold starts (first request may be slow)
   - Stateless (no persistent connections)

2. **Database Connection**:
   - Uses connection pooling
   - Automatically reconnects on each request
   - Optimized for serverless

3. **File Uploads**:
   - Limited to 50MB per request
   - Uses Cloudinary for storage

## ✅ Expected Result

After deployment:
- **Backend**: `https://your-backend.vercel.app/api`
- **Frontend**: `https://your-frontend.vercel.app`
- **Admin Login**: Works with `admin` / `admin123`
- **Events**: Load from MongoDB Atlas
- **Images**: Upload to Cloudinary

Your full-stack application will be running on Vercel! 🎉