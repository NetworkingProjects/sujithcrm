import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import leadRoutes from './routes/leads.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 API: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});