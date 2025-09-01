const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const touristSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  tripDuration: {
    type: Number, // Duration in days
    required: true,
  },
  tripItinerary: {
    type: String,
    default: '',
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending',
  },
  passportNumber: {
    type: String,
  },
  aadharNumber: {
    type: String,
  },
  digitalId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  idValidUntil: {
    type: Date,
  },
  emergencyContacts: [emergencyContactSchema],
  deviceId: {
    type: String,
    required: false,
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
