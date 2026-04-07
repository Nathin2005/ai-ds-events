const express = require('express');
const router = express.Router();
const MOU = require('../models/MOU');
const auth = require('../middleware/auth');

// Get all MOUs (public)
router.get('/', async (req, res) => {
  try {
    const { status, sort = 'date_desc', limit = 50 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    let sortOption = {};
    switch (sort) {
      case 'date_asc':
        sortOption = { signingDate: 1 };
        break;
      case 'date_desc':
        sortOption = { signingDate: -1 };
        break;
      case 'company_asc':
        sortOption = { companyName: 1 };
        break;
      case 'company_desc':
        sortOption = { companyName: -1 };
        break;
      default:
        sortOption = { signingDate: -1 };
    }
    
    const mous = await MOU.find(query)
      .sort(sortOption)
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: mous,
      count: mous.length
    });
  } catch (error) {
    console.error('Error fetching MOUs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch MOUs',
      error: error.message
    });
  }
});

// Get single MOU by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const mou = await MOU.findById(req.params.id);
    
    if (!mou) {
      return res.status(404).json({
        success: false,
        message: 'MOU not found'
      });
    }
    
    res.json({
      success: true,
      data: mou
    });
  } catch (error) {
    console.error('Error fetching MOU:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch MOU',
      error: error.message
    });
  }
});

// Create new MOU (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const mou = new MOU(req.body);
    await mou.save();
    
    res.status(201).json({
      success: true,
      message: 'MOU created successfully',
      data: mou
    });
  } catch (error) {
    console.error('Error creating MOU:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create MOU',
      error: error.message
    });
  }
});

// Update MOU (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const mou = await MOU.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!mou) {
      return res.status(404).json({
        success: false,
        message: 'MOU not found'
      });
    }
    
    res.json({
      success: true,
      message: 'MOU updated successfully',
      data: mou
    });
  } catch (error) {
    console.error('Error updating MOU:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update MOU',
      error: error.message
    });
  }
});

// Delete MOU (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const mou = await MOU.findByIdAndDelete(req.params.id);
    
    if (!mou) {
      return res.status(404).json({
        success: false,
        message: 'MOU not found'
      });
    }
    
    res.json({
      success: true,
      message: 'MOU deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting MOU:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete MOU',
      error: error.message
    });
  }
});

// Get active MOUs (public)
router.get('/status/active', async (req, res) => {
  try {
    const mous = await MOU.getActive();
    
    res.json({
      success: true,
      data: mous,
      count: mous.length
    });
  } catch (error) {
    console.error('Error fetching active MOUs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active MOUs',
      error: error.message
    });
  }
});

module.exports = router;