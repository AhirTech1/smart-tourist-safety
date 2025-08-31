// models/tourist.js

const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
    unique: true,
  },
  contactInfo: {
    phone: String,
    email: String,
  },
  location: {
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tourist', touristSchema);
