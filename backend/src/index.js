const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const touristRoutes = require('./routes/touristRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/auth_routes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173',
    'https://smarttouristsafety.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Environment variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

// Database Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log('MongoDB Connected to App Engine');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Initialize database connection
connectDB().catch(err => {
  console.error('Failed to connect to database on startup:', err);
});

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/tourist', touristRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Tourist Safety Monitoring API is running on Google App Engine!',
    timestamp: new Date().toISOString(),
    environment: 'app-engine'
  });
});

// Status route for monitoring
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    services: {
      ai: !!process.env.HUGGINGFACE_API_KEY,
      mongodb: isConnected
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${isConnected ? 'Connected' : 'Disconnected'}`);
});

module.exports = app;
