const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const testCloudinaryConnection = async () => {
  try {
    console.log('🔄 Testing Cloudinary connection...');
    console.log('📍 Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('📍 API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
    console.log('📍 API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');
    
    // Test connection by getting account details
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('📊 Status:', result.status);
    
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

module.exports = { testCloudinaryConnection };