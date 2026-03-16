const Admin = require('../models/Admin');
const { seedEvents } = require('./seedData');
const { testCloudinaryConnection } = require('./testCloudinary');

const createDefaultAdmin = async () => {
  try {
    console.log('🔄 Initializing admin and data setup...');
    
    // Test Cloudinary connection (non-blocking)
    testCloudinaryConnection().catch(err => {
      console.log('⚠️ Cloudinary test failed:', err.message);
    });
    
    // Check if any admin already exists
    const existingAdmin = await Admin.findOne();
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
    } else {
      // Create default admin user
      const defaultAdmin = new Admin({
        username: process.env.ADMIN_USERNAME || 'admin',
        passwordHash: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'super_admin'
      });

      await defaultAdmin.save();
      
      console.log('🎉 Default admin created successfully!');
      console.log('📧 Username:', defaultAdmin.username);
      console.log('🔑 Password: admin123');
      console.log('⚠️  IMPORTANT: Please change the default password in production!');
      console.log('🔗 Login at: /admin/login');
    }

    // Seed sample events (non-blocking)
    setTimeout(async () => {
      try {
        const Event = require('../models/Event');
        const eventCount = await Event.countDocuments();
        
        if (eventCount === 0) {
          await seedEvents();
          console.log('✅ Sample events with images created successfully');
        } else {
          console.log('✅ Events already exist in database');
        }
      } catch (seedError) {
        console.log('⚠️ Could not seed events:', seedError.message);
      }
    }, 3000);

  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
    // Don't throw error to prevent server crash
  }
};

module.exports = createDefaultAdmin;