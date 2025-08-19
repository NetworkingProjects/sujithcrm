import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Lead from './models/Lead.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create initial users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@company.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Sales Manager',
        email: 'manager@company.com',
        password: 'password123',
        role: 'sales_manager'
      },
      {
        name: 'Alice Cole',
        email: 'alice@company.com',
        password: 'password123',
        role: 'sales_member'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@company.com',
        password: 'password123',
        role: 'sales_member'
      }
    ];

    const createdUsers = await User.create(users);
    console.log('👥 Created users');

    // Get sales members for lead assignment
    const salesMembers = createdUsers.filter(user => user.role === 'sales_member');

    // Create sample leads
    const leads = [
      {
        company: 'Tech Innovations Inc',
        contact: 'John Smith',
        email: 'john@techinnovations.com',
        phone: '+1-555-0123',
        status: 'qualified',
        value: 25000,
        priority: 'high',
        source: 'website',
        assignedTo: salesMembers[0]._id,
        notes: 'Interested in enterprise solution'
      },
      {
        company: 'Global Solutions Ltd',
        contact: 'Sarah Johnson',
        email: 'sarah@globalsolutions.com',
        phone: '+1-555-0124',
        status: 'proposal',
        value: 45000,
        priority: 'high',
        source: 'referral',
        assignedTo: salesMembers[0]._id,
        notes: 'Proposal sent, waiting for response'
      },
      {
        company: 'Startup Ventures',
        contact: 'Mike Wilson',
        email: 'mike@startupventures.com',
        phone: '+1-555-0125',
        status: 'won',
        value: 15000,
        priority: 'medium',
        source: 'social_media',
        assignedTo: salesMembers[1]._id,
        notes: 'Deal closed successfully'
      },
      {
        company: 'NextGen Software',
        contact: 'Emily Davis',
        email: 'emily@nextgen.com',
        phone: '+1-555-0126',
        status: 'new',
        value: 30000,
        priority: 'medium',
        source: 'event',
        assignedTo: salesMembers[1]._id,
        notes: 'Met at tech conference'
      },
      {
        company: 'Digital Corp',
        contact: 'David Brown',
        email: 'david@digitalcorp.com',
        phone: '+1-555-0127',
        status: 'qualified',
        value: 20000,
        priority: 'low',
        source: 'cold_outreach',
        assignedTo: salesMembers[0]._id,
        notes: 'Responded to cold email campaign'
      }
    ];

    await Lead.create(leads);
    console.log('📊 Created sample leads');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@company.com / password123');
    console.log('Sales Manager: manager@company.com / password123');
    console.log('Sales Member: alice@company.com / password123');
    console.log('Sales Member: bob@company.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();