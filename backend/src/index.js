const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const touristRoutes = require('./routes/touristRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/auth_routes'); // Import auth routes
const aiRoutes = require('./routes/aiRoutes'); // Import AI routes

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('🗄️  MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// API Routes
app.use('/api/tourist', touristRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/ai', aiRoutes); // Use AI routes

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🛡️ Smart Tourist Safety Monitoring API is running!',
    timestamp: new Date().toISOString(),
    features: {
      ai_risk_analysis: true,
      sentiment_analysis: true,
      notification_logging: true,
      mongodb_atlas: true,
      crime_data_analysis: true
    },
    environment: 'production'
  });
});

// Status route for monitoring
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    services: {
      ai: !!process.env.HUGGINGFACE_API_KEY,
      mongodb: mongoose.connection.readyState === 1
    },
    uptime: process.uptime()
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
    path: req.originalUrl,
    availableRoutes: [
      'POST /api/ai/analyze',
      'POST /api/ai/emergency-alert',
      'GET /api/ai/location-history/:userId',
      'POST /api/ai/sentiment-analysis',
      'GET /api/status'
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🧠 AI features: ${!!process.env.HUGGINGFACE_API_KEY ? 'ENABLED' : 'DISABLED'}`);
  console.log(`� MongoDB: ${mongoose.connection.readyState === 1 ? 'CONNECTED' : 'CONNECTING'}`);
});
