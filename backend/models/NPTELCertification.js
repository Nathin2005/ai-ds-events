const mongoose = require('mongoose');

const nptelCertificationSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [200, 'Course name cannot exceed 200 characters']
  },
  courseCode: {
    type: String,
    trim: true,
    maxlength: [50, 'Course code cannot exceed 50 characters']
  },
  category: {
    type: String,
    enum: ['faculty', 'student'],
    required: [true, 'Category is required'],
    index: true
  },
  participantName: {
    type: String,
    required: [true, 'Participant name is required'],
    trim: true,
    maxlength: [100, 'Participant name cannot exceed 100 characters']
  },
  participantId: {
    type: String,
    trim: true,
    maxlength: [50, 'Participant ID cannot exceed 50 characters']
  },
  department: {
    type: String,
    trim: true,
    default: 'AI & DS'
  },
  semester: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [2020, 'Year must be 2020 or later'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  completionDate: {
    type: Date,
    required: [true, 'Completion date is required'],
    index: true
  },
  score: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  grade: {
    type: String,
    enum: ['Elite', 'Elite + Gold', 'Successfully Completed', 'Not Completed'],
    required: [true, 'Grade is required']
  },
  certificateImage: {
    type: String,
    required: [true, 'Certificate image is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'Certificate image must be a valid URL'
    }
  },
  certificateNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  duration: {
    type: String,
    trim: true
  },
  instructor: {
    type: String,
    trim: true
  },
  institution: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
nptelCertificationSchema.index({ completionDate: -1 });
nptelCertificationSchema.index({ category: 1, year: -1 });
nptelCertificationSchema.index({ participantName: 1 });
nptelCertificationSchema.index({ grade: 1 });

// Virtual for academic year
nptelCertificationSchema.virtual('academicYear').get(function() {
  const completionYear = this.completionDate.getFullYear();
  const completionMonth = this.completionDate.getMonth();
  
  if (completionMonth >= 6) { // July onwards
    return `${completionYear}-${completionYear + 1}`;
  } else {
    return `${completionYear - 1}-${completionYear}`;
  }
});

// Static method to get certifications by category
nptelCertificationSchema.statics.getByCategory = function(category) {
  return this.find({ category }).sort({ completionDate: -1 });
};

// Static method to get certifications by year
nptelCertificationSchema.statics.getByYear = function(year) {
  return this.find({ year }).sort({ completionDate: -1 });
};

// Static method to get top performers
nptelCertificationSchema.statics.getTopPerformers = function(category = null) {
  const query = category ? { category } : {};
  return this.find(query)
    .sort({ score: -1, completionDate: -1 })
    .limit(10);
};

module.exports = mongoose.model('NPTELCertification', nptelCertificationSchema);