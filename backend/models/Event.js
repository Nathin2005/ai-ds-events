const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
    index: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required'],
    trim: true
  },
  venue: {
    type: String,
    trim: true,
    default: 'AI & DS Department'
  },
  organizer: {
    type: String,
    trim: true,
    default: 'AI & DS Department'
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'Cover image must be a valid URL'
    }
  },
  galleryImages: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'Gallery image must be a valid URL'
    }
  }],
  isUpcoming: {
    type: Boolean,
    default: function() {
      return this.eventDate >= new Date();
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'published'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
eventSchema.index({ eventDate: -1 });
eventSchema.index({ isUpcoming: 1 });
eventSchema.index({ status: 1 });

// Update isUpcoming before saving
eventSchema.pre('save', function(next) {
  this.isUpcoming = this.eventDate >= new Date();
  next();
});

// Virtual for formatted date
eventSchema.virtual('formattedDate').get(function() {
  return this.eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for event status based on date
eventSchema.virtual('eventStatus').get(function() {
  const now = new Date();
  if (this.eventDate > now) {
    return 'upcoming';
  } else if (this.eventDate.toDateString() === now.toDateString()) {
    return 'today';
  } else {
    return 'past';
  }
});

// Static method to get upcoming events
eventSchema.statics.getUpcoming = function() {
  return this.find({
    eventDate: { $gte: new Date() },
    status: 'published'
  }).sort({ eventDate: 1 });
};

// Static method to get past events
eventSchema.statics.getPast = function() {
  return this.find({
    eventDate: { $lt: new Date() },
    status: 'published'
  }).sort({ eventDate: -1 });
};

module.exports = mongoose.model('Event', eventSchema);