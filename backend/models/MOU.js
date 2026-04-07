const mongoose = require('mongoose');

const mouSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  mouTitle: {
    type: String,
    required: [true, 'MOU title is required'],
    trim: true,
    maxlength: [200, 'MOU title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  signingDate: {
    type: Date,
    required: [true, 'Signing date is required'],
    index: true
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required']
  },
  mouPhotos: [{
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/i.test(v);
      },
      message: 'MOU photo must be a valid URL'
    }
  }],
  companyLogo: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/i.test(v);
      },
      message: 'Company logo must be a valid URL'
    }
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'terminated'],
    default: 'active'
  },
  contactPerson: {
    name: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  benefits: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
mouSchema.index({ signingDate: -1 });
mouSchema.index({ status: 1 });
mouSchema.index({ companyName: 1 });

// Virtual for MOU status based on dates
mouSchema.virtual('currentStatus').get(function() {
  const now = new Date();
  if (this.status === 'terminated') {
    return 'terminated';
  } else if (this.validUntil < now) {
    return 'expired';
  } else {
    return 'active';
  }
});

// Update status before saving
mouSchema.pre('save', function(next) {
  const now = new Date();
  if (this.validUntil < now && this.status === 'active') {
    this.status = 'expired';
  }
  next();
});

// Static method to get active MOUs
mouSchema.statics.getActive = function() {
  return this.find({
    status: 'active',
    validUntil: { $gte: new Date() }
  }).sort({ signingDate: -1 });
};

module.exports = mongoose.model('MOU', mouSchema);