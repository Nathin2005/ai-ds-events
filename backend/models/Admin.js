const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Only add additional indexes (username already has unique index)
// adminSchema.index({ username: 1 }); // Removed duplicate
// adminSchema.index({ isActive: 1 }); // Moved to field definition

// Virtual for account lock status
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passwordHash')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.isLocked) {
    throw new Error('Account is temporarily locked due to too many failed login attempts');
  }
  
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.passwordHash);
    
    if (isMatch) {
      // Reset login attempts on successful login
      if (this.loginAttempts > 0) {
        this.loginAttempts = 0;
        this.lockUntil = undefined;
        await this.save();
      }
      return true;
    } else {
      // Increment login attempts on failed login
      this.loginAttempts += 1;
      
      // Lock account after 5 failed attempts for 30 minutes
      if (this.loginAttempts >= 5) {
        this.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
      }
      
      await this.save();
      return false;
    }
  } catch (error) {
    throw error;
  }
};

// Update last login timestamp
adminSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find active admin
adminSchema.statics.findActiveAdmin = function(username) {
  return this.findOne({ 
    username: username.toLowerCase(), 
    isActive: true 
  });
};

module.exports = mongoose.model('Admin', adminSchema);