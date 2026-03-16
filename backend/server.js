const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const uploadRoutes = require('./routes/upload');
const testUploadRoutes = require('./routes/test-upload');
const connectDB = require('./utils/dbConnection');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://ai-ds-frontends.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/test-upload', testUploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'AI & DS Event Management API is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint with detailed info
app.get('/api/db-status', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  
  res.json({
    success: true,
    database: {
      status: states[dbState] || 'Unknown',
      readyState: dbState,
      host: mongoose.connection.host || 'localhost',
      port: mongoose.connection.port || 27017,
      name: mongoose.connection.name || 'ai-ds-events',
      collections: mongoose.connection.db ? Object.keys(mongoose.connection.db.collections || {}).length : 0
    }
  });
});

// Test Atlas connection endpoint
app.get('/api/test-connection', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected',
        status: 'disconnected'
      });
    }

    // Test database operation
    await mongoose.connection.db.admin().ping();
    
    res.json({
      success: true,
      message: 'Database connection is healthy',
      status: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database connection test failed',
      error: error.message,
      status: 'error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API route not found' 
  });
});

// Start server function
const startServer = async () => {
  console.log('🚀 Starting AI & DS Event Management Server...');
  console.log('📊 Environment:', process.env.NODE_ENV || 'development');
  
  // Connect to MongoDB
  try {
    await connectDB();
    console.log('✅ Database connection established!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️ Server will not start without database connection');
    process.exit(1);
  }
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log('\n🎉 Server Started Successfully!');
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 DB Status: http://localhost:${PORT}/api/db-status`);
    console.log('\n📋 Available Endpoints:');
    console.log('   POST /api/auth/login - Admin login');
    console.log('   GET  /api/events - Get all events');
    console.log('   POST /api/events - Create event (admin)');
    console.log('   POST /api/upload/single - Upload image (admin)');
    console.log('\n✅ Ready to accept requests!');
  });
};

// Start the server
startServer();

// Export for Vercel (if needed)
module.exports = app;