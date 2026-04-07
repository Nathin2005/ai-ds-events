const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const { auth } = require('../middleware/auth');

// Get all achievements (public)
router.get('/', async (req, res) => {
  try {
    const { category, type, level, year, sort = 'date_desc', limit = 50 } = req.query;
    
    let query = { isPublished: true };
    if (category) {
      query.category = category;
    }
    if (type) {
      query.type = type;
    }
    if (level) {
      query.level = level;
    }
    if (year) {
      query.year = parseInt(year);
    }
    
    let sortOption = {};
    switch (sort) {
      case 'date_asc':
        sortOption = { achievementDate: 1 };
        break;
      case 'date_desc':
        sortOption = { achievementDate: -1 };
        break;
      case 'title_asc':
        sortOption = { title: 1 };
        break;
      case 'level_desc':
        sortOption = { level: -1, achievementDate: -1 };
        break;
      default:
        sortOption = { achievementDate: -1 };
    }
    
    const achievements = await Achievement.find(query)
      .sort(sortOption)
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: achievements,
      count: achievements.length
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements',
      error: error.message
    });
  }
});

// Get achievements by category (public) - MUST be before /:id route
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { type, year, limit = 50 } = req.query;
    
    let query = { category, isPublished: true };
    if (type) {
      query.type = type;
    }
    if (year) {
      query.year = parseInt(year);
    }
    
    const achievements = await Achievement.find(query)
      .sort({ achievementDate: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: achievements,
      count: achievements.length
    });
  } catch (error) {
    console.error('Error fetching achievements by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements by category',
      error: error.message
    });
  }
});

// Get recent achievements (public) - MUST be before /:id route
router.get('/stats/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const recentAchievements = await Achievement.getRecent(parseInt(limit));
    
    res.json({
      success: true,
      data: recentAchievements,
      count: recentAchievements.length
    });
  } catch (error) {
    console.error('Error fetching recent achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent achievements',
      error: error.message
    });
  }
});

// Get statistics (public) - MUST be before /:id route
router.get('/stats/overview', async (req, res) => {
  try {
    const totalAchievements = await Achievement.countDocuments({ isPublished: true });
    const facultyAchievements = await Achievement.countDocuments({ category: 'faculty', isPublished: true });
    const studentAchievements = await Achievement.countDocuments({ category: 'student', isPublished: true });
    const projectAchievements = await Achievement.countDocuments({ category: 'project', isPublished: true });
    
    const currentYear = new Date().getFullYear();
    const currentYearAchievements = await Achievement.countDocuments({ 
      year: currentYear, 
      isPublished: true 
    });
    
    const levelStats = await Achievement.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const typeStats = await Achievement.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalAchievements,
        faculty: facultyAchievements,
        student: studentAchievements,
        project: projectAchievements,
        currentYear: currentYearAchievements,
        levelDistribution: levelStats,
        typeDistribution: typeStats
      }
    });
  } catch (error) {
    console.error('Error fetching achievement statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement statistics',
      error: error.message
    });
  }
});

// Get single achievement by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findOne({ 
      _id: req.params.id, 
      isPublished: true 
    });
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    res.json({
      success: true,
      data: achievement
    });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement',
      error: error.message
    });
  }
});

// Create new achievement (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    
    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create achievement',
      error: error.message
    });
  }
});

// Update achievement (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update achievement',
      error: error.message
    });
  }
});

// Delete achievement (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete achievement',
      error: error.message
    });
  }
});

module.exports = router;