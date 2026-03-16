# AI & DS Event Management System - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Install Dependencies
```bash
npm run install-deps
```

### 2. Environment Setup

#### Backend Environment (.env file is already created)
The backend `.env` file is already configured with default values. You need to:

1. **MongoDB**: 
   - Install MongoDB locally OR
   - Get MongoDB Atlas connection string and replace `MONGODB_URI`

2. **Cloudinary** (for image uploads):
   - Sign up at https://cloudinary.com
   - Replace these values in `backend/.env`:
     ```
     CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
     CLOUDINARY_API_KEY=your-actual-api-key
     CLOUDINARY_API_SECRET=your-actual-api-secret
     ```

#### Frontend Environment (.env file is already created)
The frontend `.env` file is already configured and ready to use.

### 3. Start the Application

#### Option 1: Use the startup script (Windows)
```bash
start.bat
```

#### Option 2: Manual start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

### 5. Default Admin Credentials
```
Username: admin
Password: admin123
```

## 📁 Project Structure

```
ai-ds-event-management/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── utils/              # Helper functions
│   └── server.js           # Main server file
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API integration
│   └── public/             # Static assets
└── package.json            # Root configuration
```

## 🔧 Configuration Details

### MongoDB Setup Options

#### Option 1: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Use default connection: `mongodb://localhost:27017/ai-ds-events`

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Replace `MONGODB_URI` in `backend/.env`

### Cloudinary Setup (Required for image uploads)
1. Sign up at https://cloudinary.com (free tier available)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Update `backend/.env` file

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `build` folder

### Backend (Render/Railway)
1. Deploy the `backend` folder
2. Set environment variables
3. Update `FRONTEND_URL` in backend `.env`

## 🔍 Troubleshooting

### MongoDB Connection Issues

The server includes detailed MongoDB connection diagnostics. If MongoDB fails to connect, you'll see specific error messages and solutions.

#### Common MongoDB Errors and Solutions:

**1. MongoNetworkError - Cannot reach MongoDB server**
```
❌ Network Error: Cannot reach MongoDB server
💡 Solutions:
   1. Check if MongoDB is running locally
   2. Verify MongoDB service is started
   3. Check firewall settings
   4. Verify connection string format
```

**2. MongooseServerSelectionError - Server not available**
```
❌ Server Selection Error: MongoDB server not available
💡 Solutions:
   • Windows: net start MongoDB
   • Mac: brew services start mongodb-community
   • Linux: sudo systemctl start mongod
```

**3. MongoParseError - Invalid connection string**
```
❌ Parse Error: Invalid connection string format
💡 Correct formats:
   • Local: mongodb://localhost:27017/ai-ds-events
   • Atlas: mongodb+srv://username:password@cluster.mongodb.net/database
```

**4. Authentication Failed**
```
❌ Authentication Error: Invalid credentials
💡 Solutions:
   1. Check username/password in connection string
   2. Verify user permissions in MongoDB
   3. Check IP whitelist (for Atlas)
```

#### MongoDB Setup Instructions:

**Local MongoDB Installation:**

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start service: `net start MongoDB`
4. Verify: Open MongoDB Compass and connect to `mongodb://localhost:27017`

**Mac:**
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
# Install MongoDB
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

**MongoDB Atlas (Cloud) Setup:**
1. Go to https://mongodb.com/atlas
2. Create free account and cluster
3. Create database user
4. Whitelist IP (use 0.0.0.0/0 for development)
5. Get connection string and update `backend/.env`

#### Testing MongoDB Connection:

**1. Check if MongoDB is running:**
```bash
# Windows
net start | findstr MongoDB

# Mac/Linux
brew services list | grep mongodb
# or
sudo systemctl status mongod
```

**2. Test connection with MongoDB Compass:**
- Download MongoDB Compass
- Connect to `mongodb://localhost:27017`
- Should show available databases

**3. Test with command line:**
```bash
# Connect to local MongoDB
mongosh mongodb://localhost:27017

# Should show MongoDB shell prompt
```

#### Server Diagnostics:

The server provides helpful endpoints for debugging:

**Health Check:** `GET http://localhost:5000/api/health`
```json
{
  "success": true,
  "status": "OK",
  "database": "Connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Database Status:** `GET http://localhost:5000/api/db-status`
```json
{
  "success": true,
  "database": {
    "status": "Connected",
    "readyState": 1,
    "host": "localhost",
    "port": 27017,
    "name": "ai-ds-events"
  }
}
```

### Other Common Issues

1. **Port already in use**
   - Change ports in `.env` files
   - Kill existing processes: `netstat -ano | findstr :5000`

2. **Image upload not working**
   - Verify Cloudinary credentials in `backend/.env`
   - Check file size limits (5MB max)
   - Ensure internet connection for Cloudinary

3. **CORS errors**
   - Ensure `FRONTEND_URL` is correct in `backend/.env`
   - Check if both servers are running

4. **Frontend not loading**
   - Check if Node.js version is 16+
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

### Getting Help
- Check server console for detailed error messages
- Use browser developer tools for frontend errors
- Test API endpoints with Postman or curl
- Verify all environment variables are set correctly

## 📋 Features Included

### Public Features
- ✅ Home page with department overview
- ✅ Events listing with search and filtering
- ✅ Event details with photo galleries
- ✅ Responsive design
- ✅ 3D animations and modern UI

### Admin Features
- ✅ Secure login system
- ✅ Dashboard with statistics
- ✅ Create/Edit/Delete events
- ✅ Image upload functionality
- ✅ Event management

### Technical Features
- ✅ JWT authentication
- ✅ Cloudinary image storage
- ✅ Input validation
- ✅ Error handling
- ✅ Security middleware

## 🎯 Next Steps

1. Set up MongoDB and Cloudinary
2. Run the application
3. Login with admin credentials
4. Create your first event
5. Customize the department information
6. Deploy to production

Happy coding! 🚀