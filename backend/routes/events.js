const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with optional filtering
// @access  Public
router.get('/', [
  query('status').optional().isIn(['published', 'draft', 'cancelled']),
  query('limit').optional().isInt({ min: 1, max: 500 }),
  query('page').optional().isInt({ min: 1 }),
  query('sort').optional().isIn(['date_asc', 'date_desc', 'name_asc', 'name_desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const { status = 'published', limit = 100, page = 1, sort = 'date_desc' } = req.query;
    
    // Build query
    const query = { status };
    
    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'date_asc':
        sortObj = { eventDate: 1 };
        break;
      case 'date_desc':
        sortObj = { eventDate: -1 };
        break;
      case 'name_asc':
        sortObj = { eventName: 1 };
        break;
      case 'name_desc':
        sortObj = { eventName: -1 };
        break;
      default:
        sortObj = { eventDate: -1 };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with date sorting (newest first for all events)
    const [events, totalCount] = await Promise.all([
      Event.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Event.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: events.length,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      data: events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events'
    });
  }
});

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const upcomingEvents = await Event.getUpcoming().select('-__v');

    res.json({
      success: true,
      count: upcomingEvents.length,
      data: upcomingEvents
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming events'
    });
  }
});

// @route   GET /api/events/past
// @desc    Get past events
// @access  Public
router.get('/past', async (req, res) => {
  try {
    const pastEvents = await Event.getPast().select('-__v');

    res.json({
      success: true,
      count: pastEvents.length,
      data: pastEvents
    });
  } catch (error) {
    console.error('Get past events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching past events'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select('-__v');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Only show published events to public, unless admin is authenticated
    if (event.status !== 'published' && !req.admin) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching event'
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Admin only)
router.post('/', [
  auth,
  body('eventName')
    .trim()
    .notEmpty()
    .withMessage('Event name is required')
    .isLength({ max: 100 })
    .withMessage('Event name cannot exceed 100 characters'),
  body('eventDate')
    .isISO8601()
    .withMessage('Valid event date is required'),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 200 })
    .withMessage('Short description cannot exceed 200 characters'),
  body('fullDescription')
    .trim()
    .notEmpty()
    .withMessage('Full description is required'),
  body('coverImage')
    .notEmpty()
    .withMessage('Cover image is required')
    .isURL()
    .withMessage('Cover image must be a valid URL'),
  body('venue').optional().trim(),
  body('organizer').optional().trim(),
  body('galleryImages').optional().isArray(),
  body('galleryImages.*').optional().isURL().withMessage('Gallery images must be valid URLs')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const eventData = {
      ...req.body,
      venue: req.body.venue || 'AI & DS Department',
      organizer: req.body.organizer || 'AI & DS Department'
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating event'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  body('eventName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Event name cannot exceed 100 characters'),
  body('eventDate')
    .optional()
    .isISO8601()
    .withMessage('Valid event date is required'),
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Short description cannot exceed 200 characters'),
  body('fullDescription')
    .optional()
    .trim(),
  body('coverImage')
    .optional()
    .isURL()
    .withMessage('Cover image must be a valid URL'),
  body('venue').optional().trim(),
  body('organizer').optional().trim(),
  body('galleryImages').optional().isArray(),
  body('galleryImages.*').optional().isURL().withMessage('Gallery images must be valid URLs'),
  body('status').optional().isIn(['draft', 'published', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating event'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Delete event error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting event'
    });
  }
});

module.exports = router;