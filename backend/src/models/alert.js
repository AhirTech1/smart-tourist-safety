// models/alert.js

const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'Panic', 
      'GeoFence', 
      'LowBattery', 
      'LostConnection',
      'HighRisk',
      'AnomalyDetected',
      'CrimeAlert',
      'SafetyBreach'
    ],
    required: true,
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    accuracy: Number,
  },
  message: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0,
  },
  anomalies: [{
    type: String,
    description: String,
    severity: Number,
  }],
  nearestEmergencyServices: [{
    type: {
      type: String,
      enum: ['police', 'hospital', 'fire', 'tourist_help'],
    },
    name: String,
    distance: Number, // in meters
    contact: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  }],
  notificationsSent: [{
    recipient: String, // phone or email
    type: String, // 'sms', 'email', 'push'
    status: String, // 'sent', 'delivered', 'failed'
    timestamp: Date,
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Active', 'Acknowledged', 'Resolved', 'False_Alarm'],
    default: 'Active',
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: String,
});

// Create indexes for efficient querying
alertSchema.index({ tourist: 1, timestamp: -1 });
alertSchema.index({ status: 1 });
alertSchema.index({ type: 1 });
alertSchema.index({ severity: 1 });

module.exports = mongoose.model('Alert', alertSchema);
