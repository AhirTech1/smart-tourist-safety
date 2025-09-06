const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  address: {
    type: String,
    default: '',
  },
  accuracy: {
    type: Number, // GPS accuracy in meters
    default: 0,
  },
  speed: {
    type: Number, // Speed in km/h
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
  },
  isEmergency: {
    type: Boolean,
    default: false,
  },
});

// Create indexes for efficient querying
locationSchema.index({ userId: 1, timestamp: -1 });
locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Location', locationSchema);
