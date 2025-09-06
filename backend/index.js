const functions = require('firebase-functions');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Firebase configuration (already initialized)
const { initializeFirebase } = require('./src/config/firebase');

// Import routes
const touristRoutes = require('./src/routes/touristRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const authRoutes = require('./src/routes/auth_routes');
const aiRoutes = require('./src/routes/aiRoutes');

const app = express();

// Initialize Firebase (if not already done)
try {
  initializeFirebase();
} catch (error) {
  console.log('Firebase already initialized or error:', error.message);
}

// Middleware
app.use(cors({
  origin: true, // Allow all origins for Firebase Functions
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Environment variables for Firebase Functions
const MONGO_URI = functions.config().app?.mongo_uri || process.env.MONGO_URI;
const HUGGINGFACE_API_KEY = functions.config().app?.huggingface_api_key || process.env.HUGGINGFACE_API_KEY;
const RISK_THRESHOLD = functions.config().app?.risk_threshold || process.env.RISK_THRESHOLD || '0.7';
const ANOMALY_DETECTION_RADIUS = functions.config().app?.anomaly_detection_radius || process.env.ANOMALY_DETECTION_RADIUS || '1000';

// Set environment variables if not set
if (!process.env.MONGO_URI && MONGO_URI) process.env.MONGO_URI = MONGO_URI;
if (!process.env.HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY) process.env.HUGGINGFACE_API_KEY = HUGGINGFACE_API_KEY;
if (!process.env.RISK_THRESHOLD) process.env.RISK_THRESHOLD = RISK_THRESHOLD;
if (!process.env.ANOMALY_DETECTION_RADIUS) process.env.ANOMALY_DETECTION_RADIUS = ANOMALY_DETECTION_RADIUS;

// Database Connection with retry logic for Firebase Functions
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
    console.log('MongoDB Connected to Firebase Functions');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

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

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Tourist Safety Monitoring API is running on Firebase!',
    timestamp: new Date().toISOString(),
    environment: 'firebase-functions'
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
      firebase: true,
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

// Export the Express app as a Firebase Function
exports.api = functions.region('asia-south1').runWith({
  timeoutSeconds: 540,
  memory: '1GB'
}).https.onRequest(app);

// Optional: Export individual functions for better performance
exports.analyzeRisk = functions.region('asia-south1').runWith({
  timeoutSeconds: 60,
  memory: '512MB'
}).https.onCall(async (data, context) => {
  try {
    await connectDB();
    
    const riskAnalyzer = require('./src/services/riskAnalyzer');
    const result = await riskAnalyzer.analyzeRisk(data.userId, data.location);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Risk analysis error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.sendAlert = functions.region('asia-south1').runWith({
  timeoutSeconds: 60,
  memory: '512MB'
}).https.onCall(async (data, context) => {
  try {
    await connectDB();
    
    const alertService = require('./src/services/alertService');
    const result = await alertService.sendSmartAlert(data);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Alert service error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
