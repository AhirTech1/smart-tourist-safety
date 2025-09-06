const mongoose = require('mongoose');

const crimeDataSchema = new mongoose.Schema({
  area: {
    type: String,
    required: true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  crimeType: {
    type: String,
    enum: [
      'theft',
      'assault',
      'robbery',
      'fraud',
      'vandalism',
      'harassment',
      'pickpocketing',
      'scam',
      'kidnapping',
      'other'
    ],
    required: true,
  },
  severity: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  reportedBy: {
    type: String,
    enum: ['police', 'tourist', 'local', 'admin'],
    default: 'admin',
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'dismissed'],
    default: 'pending',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  timeOfIncident: {
    type: Date,
    required: true,
  },
  affectedRadius: {
    type: Number, // Radius in meters where this crime data affects safety scores
    default: 500,
  },
});

// Create indexes for efficient querying
crimeDataSchema.index({ coordinates: '2dsphere' });
crimeDataSchema.index({ timestamp: -1 });
crimeDataSchema.index({ area: 1 });
crimeDataSchema.index({ crimeType: 1 });

module.exports = mongoose.model('CrimeData', crimeDataSchema);
