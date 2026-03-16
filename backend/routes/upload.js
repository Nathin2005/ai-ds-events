const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      // Check specific image formats
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (allowedFormats.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'), false);
      }
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      folder: 'ai-ds-events',
      quality: 'auto',
      format: 'auto',
      ...options
    };

    cloudinary.uploader.upload_stream(
      defaultOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes
          });
        }
      }
    ).end(buffer);
  });
};

// @route   POST /api/upload/single
// @desc    Upload single image
// @access  Private (Admin only)
router.post('/single', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('📤 Single upload started');
    console.log('👤 Admin:', req.admin ? req.admin.username : 'Not authenticated');
    console.log('📁 File:', req.file ? req.file.originalname : 'No file');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Check Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary config missing');
      return res.status(500).json({
        success: false,
        message: 'Cloudinary configuration is missing'
      });
    }

    console.log('🔄 Uploading to Cloudinary...');

    // Upload to Cloudinary with cover image optimization
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'ai-ds-events/covers',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto:good' },
        { format: 'auto' }
      ]
    });

    console.log('✅ Upload successful:', result.url);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    
    if (error.message.includes('File too large')) {
      return res.status(413).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading image',
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images for gallery
// @access  Private (Admin only)
router.post('/multiple', auth, upload.array('images', 10), async (req, res) => {
  try {
    console.log('📤 Multiple upload started');
    console.log('👤 Admin:', req.admin ? req.admin.username : 'Not authenticated');
    console.log('📁 Files:', req.files ? req.files.length : 0);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    // Check Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary config missing');
      return res.status(500).json({
        success: false,
        message: 'Cloudinary configuration is missing'
      });
    }

    console.log('🔄 Uploading multiple files to Cloudinary...');

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map((file, index) => {
      console.log(`📤 Uploading file ${index + 1}: ${file.originalname}`);
      return uploadToCloudinary(file.buffer, {
        folder: 'ai-ds-events/gallery',
        transformation: [
          { width: 1000, height: 750, crop: 'limit' },
          { quality: 'auto:good' },
          { format: 'auto' }
        ]
      });
    });

    const results = await Promise.all(uploadPromises);
    console.log('✅ All uploads successful');

    res.json({
      success: true,
      message: `${results.length} images uploaded successfully`,
      data: results
    });
  } catch (error) {
    console.error('❌ Multiple upload error:', error);
    
    if (error.message.includes('File too large')) {
      return res.status(413).json({
        success: false,
        message: 'One or more files are too large. Maximum size is 10MB per file.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading images',
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete image from Cloudinary
// @access  Private (Admin only)
router.delete('/:publicId(*)', auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found or already deleted'
      });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image'
    });
  }
});

// @route   GET /api/upload/debug
// @desc    Debug upload configuration
// @access  Private (Admin only)
router.get('/debug', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      debug: {
        cloudinaryConfig: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
          api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
          api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
        },
        admin: {
          id: req.admin._id,
          username: req.admin.username,
          role: req.admin.role
        },
        environment: process.env.NODE_ENV
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Debug error',
      error: error.message
    });
  }
});

// @route   GET /api/upload/stats
// @desc    Get upload statistics
// @access  Private (Admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    // Get Cloudinary usage stats
    const stats = await cloudinary.api.usage();
    
    res.json({
      success: true,
      data: {
        totalImages: stats.resources,
        storageUsed: stats.bytes,
        storageLimit: stats.limit,
        transformations: stats.transformations,
        bandwidth: stats.bandwidth
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upload statistics'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed.'
      });
    }
  }
  
  res.status(400).json({
    success: false,
    message: error.message || 'Upload error'
  });
});

module.exports = router;