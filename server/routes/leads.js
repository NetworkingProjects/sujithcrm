import express from 'express';
import Lead from '../db/models/Lead.js';
import User from '../db/models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all leads (with role-based filtering)
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // Sales members can only see their assigned leads
    if (req.user.role === 'sales_member') {
      query.assignedTo = req.user.userId;
    }
    
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .sort({ lastActivity: -1 });

    res.json({
      success: true,
      leads
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single lead
router.get('/:id', auth, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Sales members can only see their assigned leads
    if (req.user.role === 'sales_member') {
      query.assignedTo = req.user.userId;
    }
    
    const lead = await Lead.findOne(query).populate('assignedTo', 'name email');
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      lead
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new lead
router.post('/', auth, async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      lastActivity: new Date()
    };

    // If sales member creates lead, auto-assign to themselves
    if (req.user.role === 'sales_member') {
      leadData.assignedTo = req.user.userId;
    }

    const lead = new Lead(leadData);
    await lead.save();
    await lead.populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update lead
router.put('/:id', auth, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Sales members can only update their assigned leads
    if (req.user.role === 'sales_member') {
      query.assignedTo = req.user.userId;
    }
    
    const updateData = {
      ...req.body,
      lastActivity: new Date()
    };

    const lead = await Lead.findOneAndUpdate(
      query,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete lead (admin and sales_manager only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role === 'sales_member') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;