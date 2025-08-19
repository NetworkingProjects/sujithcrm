import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
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
  },
  status: {
    type: String,
    enum: ['new', 'qualified', 'proposal', 'won', 'lost'],
    default: 'new'
  },
  value: {
    type: Number,
    default: 0
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'event', 'cold_outreach', 'other'],
    default: 'website'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Lead', LeadSchema);