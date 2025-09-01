const mongoose = require('mongoose');

const highRiskZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  radius: {
    type: Number, // in meters
    required: true,
  },
  riskType: {
    type: String,
    enum: ['High-Alert', 'Natural-Calamity-Prone', 'Other'],
    default: 'High-Alert',
  },
  description: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('HighRiskZone', highRiskZoneSchema);