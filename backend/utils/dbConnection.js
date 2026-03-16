const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-ds-events';
    const isLocal = mongoURI.includes('localhost');
    
    console.log(`🔄 Connecting to ${isLocal ? 'Local' : 'Cloud'} MongoDB...`);
    console.log('📍 URI:', isLocal ? mongoURI : mongoURI.replace(/\/\/.*@/, '//***:***@'));
    
    // Updated connection options for Mongoose 6+
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    };
    
    const conn = await mongoose.connect(mongoURI, options);

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}${conn.connection.port ? ':' + conn.connection.port : ''}`);
    console.log(`📈 Ready State: Connected`);
    
    // Create default admin user after connection is stable
    setTimeout(() => {
      require('./createAdmin')();
    }, 2000);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    throw error;
  }
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

module.exports = connectDB;