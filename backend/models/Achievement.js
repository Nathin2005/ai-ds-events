const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  category: {
    type: String,
    enum: ['faculty', 'student', 'project'],
    required: [true, 'Category is required'],
    index: true
  },
  type: {
    type: String,
    enum: ['award', 'recognition', 'publication', 'patent', 'competition', 'research', 'other'],
    required: [true, 'Type is required'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  achievedBy: {
    type: String,
    required: [true, 'Achiever name is required'],
    trim: true,
    maxlength: [100, 'Achiever name cannot exceed 100 characters']
  },
  achieverId: {
    type: String,
    trim: true,
    maxlength: [50, 'Achiever ID cannot exceed 50 characters']
  },
  coAchievers: [{
    name: {
      type: String,
      trim: true
    },
    id: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      trim: true
    }
  }],
  mentor: {
    name: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    }
  },
  awardingBody: {
    type: String,
    required: [true, 'Awarding body is required'],
    trim: true,
    maxlength: [150, 'Awarding body cannot exceed 150 characters']
  },
  achievementDate: {
    type: Date,
    required: [true, 'Achievement date is required'],
    index: true
  },
  level: {
    type: String,
    enum: ['international', 'national', 'state', 'regional', 'institutional'],
    required: [true, 'Level is required'],
    index: true
  },
  prize: {
    position: {
      type: String,
      enum: ['1st', '2nd', '3rd', 'participation', 'special_mention', 'other'],
      default: 'participation'
    },
    amount: {
      type: Number,
      min: [0, 'Prize amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  certificateImage: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/i.test(v);
      },
      message: 'Certificate image must be a valid URL'
    }
  },
  additionalImages: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'Additional image must be a valid URL'
    }
  }],
  documentUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/i.test(v);
      },
      message: 'Document URL must be a valid URL'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [2020, 'Year must be 2020 or later'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
achievementSchema.index({ achievementDate: -1 });
achievementSchema.index({ category: 1, type: 1 });
achievementSchema.index({ level: 1 });
achievementSchema.index({ year: -1 });
achievementSchema.index({ isPublished: 1 });

// Virtual for academic year
achievementSchema.virtual('academicYear').get(function() {
  const achievementYear = this.achievementDate.getFullYear();
  const achievementMonth = this.achievementDate.getMonth();
  
  if (achievementMonth >= 6) { // July onwards
    return `${achievementYear}-${achievementYear + 1}`;
  } else {
    return `${achievementYear - 1}-${achievementYear}`;
  }
});

// Static method to get achievements by category
achievementSchema.statics.getByCategory = function(category) {
  return this.find({ category, isPublished: true }).sort({ achievementDate: -1 });
};

// Static method to get achievements by type
achievementSchema.statics.getByType = function(type) {
  return this.find({ type, isPublished: true }).sort({ achievementDate: -1 });
};

// Static method to get achievements by level
achievementSchema.statics.getByLevel = function(level) {
  return this.find({ level, isPublished: true }).sort({ achievementDate: -1 });
};

// Static method to get recent achievements
achievementSchema.statics.getRecent = function(limit = 10) {
  return this.find({ isPublished: true })
    .sort({ achievementDate: -1 })
    .limit(limit);
};

// Static method to get achievements by year
achievementSchema.statics.getByYear = function(year) {
  return this.find({ year, isPublished: true }).sort({ achievementDate: -1 });
};

module.exports = mongoose.model('Achievement', achievementSchema);