const express = require('express');
const router = express.Router();
const NPTELCertification = require('../models/NPTELCertification');
const auth = require('../middleware/auth');

// Get all NPTEL certifications (public)
router.get('/', async (req, res) => {
  try {
    const { category, year, grade, sort = 'date_desc', limit = 50 } = req.query;
    
    let query = {};
    if (category) {
      query.category = category;
    }
    if (year) {
      query.year = parseInt(year);
    }
    if (grade) {
      query.grade = grade;
    }
    
    let sortOption = {};
    switch (sort) {
      case 'date_asc':
        sortOption = { completionDate: 1 };
        break;
      case 'date_desc':
        sortOption = { completionDate: -1 };
        break;
      case 'score_desc':
        sortOption = { score: -1, completionDate: -1 };
        break;
      case 'name_asc':
        sortOption = { participantName: 1 };
        break;
      default:
        sortOption = { completionDate: -1 };
    }
    
    const certifications = await NPTELCertification.find(query)
      .sort(sortOption)
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: certifications,
      count: certifications.length
    });
  } catch (error) {
    console.error('Error fetching NPTEL certifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NPTEL certifications',
      error: error.message
    });
  }
});

// Get single NPTEL certification by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const certification = await NPTELCertification.findById(req.params.id);
    
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'NPTEL certification not found'
      });
    }
    
    res.json({
      success: true,
      data: certification
    });
  } catch (error) {
    console.error('Error fetching NPTEL certification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NPTEL certification',
      error: error.message
    });
  }
});

// Get certifications by category (public)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { year, limit = 50 } = req.query;
    
    let query = { category };
    if (year) {
      query.year = parseInt(year);
    }
    
    const certifications = await NPTELCertification.find(query)
      .sort({ completionDate: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: certifications,
      count: certifications.length
    });
  } catch (error) {
    console.error('Error fetching certifications by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certifications by category',
      error: error.message
    });
  }
});

// Get top performers (public)
router.get('/stats/top-performers', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    const topPerformers = await NPTELCertification.getTopPerformers(category);
    
    res.json({
      success: true,
      data: topPerformers.slice(0, parseInt(limit)),
      count: topPerformers.length
    });
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top performers',
      error: error.message
    });
  }
});

// Get statistics (public)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalCertifications = await NPTELCertification.countDocuments();
    const facultyCertifications = await NPTELCertification.countDocuments({ category: 'faculty' });
    const studentCertifications = await NPTELCertification.countDocuments({ category: 'student' });
    
    const currentYear = new Date().getFullYear();
    const currentYearCertifications = await NPTELCertification.countDocuments({ year: currentYear });
    
    const gradeStats = await NPTELCertification.aggregate([
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalCertifications,
        faculty: facultyCertifications,
        student: studentCertifications,
        currentYear: currentYearCertifications,
        gradeDistribution: gradeStats
      }
    });
  } catch (error) {
    console.error('Error fetching NPTEL statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NPTEL statistics',
      error: error.message
    });
  }
});

// Create new NPTEL certification (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const certification = new NPTELCertification(req.body);
    await certification.save();
    
    res.status(201).json({
      success: true,
      message: 'NPTEL certification created successfully',
      data: certification
    });
  } catch (error) {
    console.error('Error creating NPTEL certification:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create NPTEL certification',
      error: error.message
    });
  }
});

// Update NPTEL certification (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const certification = await NPTELCertification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'NPTEL certification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'NPTEL certification updated successfully',
      data: certification
    });
  } catch (error) {
    console.error('Error updating NPTEL certification:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update NPTEL certification',
      error: error.message
    });
  }
});

// Delete NPTEL certification (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const certification = await NPTELCertification.findByIdAndDelete(req.params.id);
    
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'NPTEL certification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'NPTEL certification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting NPTEL certification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete NPTEL certification',
      error: error.message
    });
  }
});

module.exports = router;