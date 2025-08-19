import express from 'express';
import Lead from '../db/models/Lead.js';
import User from '../db/models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    let leadQuery = {};
    let userQuery = {};
    
    // Role-based filtering
    if (req.user.role === 'sales_member') {
      leadQuery.assignedTo = req.user.userId;
    } else if (req.user.role === 'sales_manager') {
      // Sales manager can see all sales members' data
      const salesMembers = await User.find({ role: 'sales_member' });
      const salesMemberIds = salesMembers.map(user => user._id);
      leadQuery.assignedTo = { $in: salesMemberIds };
    }

    // Get lead statistics
    const totalLeads = await Lead.countDocuments(leadQuery);
    const qualifiedLeads = await Lead.countDocuments({ ...leadQuery, status: 'qualified' });
    const proposalLeads = await Lead.countDocuments({ ...leadQuery, status: 'proposal' });
    const wonLeads = await Lead.countDocuments({ ...leadQuery, status: 'won' });
    const newLeads = await Lead.countDocuments({ 
      ...leadQuery, 
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    });

    // Calculate total revenue from won leads
    const revenueResult = await Lead.aggregate([
      { $match: { ...leadQuery, status: 'won' } },
      { $group: { _id: null, totalRevenue: { $sum: '$value' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get team size
    let activeSalesMembers = 1;
    if (req.user.role === 'admin') {
      activeSalesMembers = await User.countDocuments({ 
        role: { $in: ['sales_manager', 'sales_member'] }, 
        isActive: true 
      });
    } else if (req.user.role === 'sales_manager') {
      activeSalesMembers = await User.countDocuments({ 
        role: 'sales_member', 
        isActive: true 
      });
    }

    // Calculate monthly target achievement (mock calculation)
    const monthlyTarget = Math.min(Math.round((wonLeads / Math.max(totalLeads, 1)) * 100), 100);

    // Get recent leads
    const recentLeads = await Lead.find(leadQuery)
      .populate('assignedTo', 'name email')
      .sort({ lastActivity: -1 })
      .limit(5);

    // Get team performance (for admin and sales_manager)
    let teamMembers = [];
    if (req.user.role === 'admin' || req.user.role === 'sales_manager') {
      const teamQuery = req.user.role === 'admin' 
        ? { role: { $in: ['sales_manager', 'sales_member'] }, isActive: true }
        : { role: 'sales_member', isActive: true };
        
      const team = await User.find(teamQuery);
      
      for (const member of team) {
        const memberLeads = await Lead.countDocuments({ assignedTo: member._id });
        const memberWonLeads = await Lead.countDocuments({ assignedTo: member._id, status: 'won' });
        const memberRevenueResult = await Lead.aggregate([
          { $match: { assignedTo: member._id, status: 'won' } },
          { $group: { _id: null, revenue: { $sum: '$value' } } }
        ]);
        const memberRevenue = memberRevenueResult.length > 0 ? memberRevenueResult[0].revenue : 0;
        const performance = memberLeads > 0 ? Math.round((memberWonLeads / memberLeads) * 100) : 0;

        teamMembers.push({
          id: member._id,
          name: member.name,
          role: member.role === 'sales_manager' ? 'Sales Manager' : 'Sales Rep',
          performance,
          deals: memberWonLeads,
          revenue: memberRevenue
        });
      }
    }

    res.json({
      success: true,
      stats: {
        totalLeads,
        monthlyTarget,
        activeSalesMembers,
        totalRevenue,
        conversions: wonLeads,
        newLeads
      },
      leadDistribution: {
        qualified: qualifiedLeads,
        proposal: proposalLeads,
        won: wonLeads,
        total: totalLeads
      },
      recentLeads: recentLeads.map(lead => ({
        id: lead._id,
        company: lead.company,
        contact: lead.contact,
        status: lead.status,
        value: lead.value,
        lastActivity: lead.lastActivity
      })),
      teamMembers
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;