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
    enum: ['Panic', 'GeoFence', 'LowBattery', 'LostConnection'],
    required: true,
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Active', 'Resolved'],
    default: 'Active',
  },
});

module.exports = mongoose.model('Alert', alertSchema);
