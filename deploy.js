#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AI & DS Event Management - Render + Vercel Deployment Helper\n');

// Check if we're in the right directory
if (!fs.existsSync('frontend') || !fs.existsSync('backend')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Function to run commands
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`🔄 Running: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    console.log('✅ Success!\n');
  } catch (error) {
    console.error(`❌ Failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Function to check if command exists
function commandExists(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

console.log('📋 Deployment Stack:');
console.log('🌐 Frontend: Vercel (Free tier)');
console.log('🖥️  Backend: Render (Free tier)');
console.log('🗄️  Database: MongoDB Atlas (Free tier)');
console.log('📷 Images: Cloudinary (Free tier)\n');

console.log('📋 Pre-deployment Checklist:');
console.log('1. ✅ GitHub repository created');
console.log('2. ✅ MongoDB Atlas cluster setup');
console.log('3. ✅ Cloudinary account ready');
console.log('4. ✅ Environment variables prepared\n');

// Check for required tools
console.log('🔍 Checking required tools...');

const tools = [
  { name: 'git', required: true },
  { name: 'npm', required: true },
  { name: 'vercel', required: false, install: 'npm install -g vercel' }
];

tools.forEach(tool => {
  if (commandExists(tool.name)) {
    console.log(`✅ ${tool.name} is installed`);
  } else if (tool.required) {
    console.error(`❌ ${tool.name} is required but not installed`);
    process.exit(1);
  } else {
    console.log(`⚠️  ${tool.name} is not installed (optional)`);
    if (tool.install) {
      console.log(`   Install with: ${tool.install}`);
    }
  }
});

console.log('\n🏗️  Preparing project for deployment...');

// Install dependencies
console.log('📦 Installing backend dependencies...');
runCommand('npm install', 'backend');

console.log('📦 Installing frontend dependencies...');
runCommand('npm install', 'frontend');

// Build frontend to test
console.log('🔨 Testing frontend build...');
runCommand('npm run build', 'frontend');

console.log('✅ Build test completed successfully!\n');

console.log('🚀 Deployment Steps:\n');

console.log('📤 Step 1: Push to GitHub');
console.log('   1. Go to GitHub.com and create new repository');
console.log('   2. Name it "ai-ds-events" and make it Public');
console.log('   3. In terminal: git init');
console.log('   4. Add files: git add .');
console.log('   5. Commit: git commit -m "Initial commit"');
console.log('   6. Add remote: git remote add origin https://github.com/yourusername/ai-ds-events.git');
console.log('   7. Push: git push -u origin main\n');

console.log('🖥️  Step 2: Deploy Backend (Render)');
console.log('   1. Go to https://render.com/');
console.log('   2. Connect GitHub → Select repository');
console.log('   3. Choose "Web Service"');
console.log('   4. Root Directory: backend');
console.log('   5. Build Command: npm install');
console.log('   6. Start Command: npm start');
console.log('   7. Add environment variables (see DEPLOYMENT.md)');
console.log('   8. Deploy and copy URL\n');

console.log('🌐 Step 3: Deploy Frontend (Vercel)');
console.log('   1. Go to https://vercel.com/');
console.log('   2. Import GitHub repository');
console.log('   3. Root Directory: frontend');
console.log('   4. Framework: Create React App');
console.log('   5. Add REACT_APP_API_URL environment variable');
console.log('   6. Deploy\n');

console.log('🔧 Step 4: Update Backend FRONTEND_URL');
console.log('   1. Copy Vercel URL');
console.log('   2. Update FRONTEND_URL in Render environment variables');
console.log('   3. Redeploy backend\n');

console.log('📋 Environment Variables Needed:');
console.log('\n🖥️  Backend (Render):');
console.log('   NODE_ENV=production');
console.log('   MONGODB_URI=mongodb+srv://...');
console.log('   JWT_SECRET=your-secret-key');
console.log('   CLOUDINARY_CLOUD_NAME=your-cloud-name');
console.log('   CLOUDINARY_API_KEY=your-api-key');
console.log('   CLOUDINARY_API_SECRET=your-api-secret');
console.log('   ADMIN_USERNAME=admin');
console.log('   ADMIN_PASSWORD=admin123');
console.log('   FRONTEND_URL=https://your-app.vercel.app');

console.log('\n🌐 Frontend (Vercel):');
console.log('   REACT_APP_API_URL=https://your-backend.onrender.com/api');

console.log('\n📖 For detailed step-by-step instructions, see DEPLOYMENT.md');
console.log('🎉 Ready for deployment with Render + Vercel!');