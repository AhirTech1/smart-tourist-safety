// models/Incident.js

const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'theft',
      'harassment', 
      'fraud',
      'assault',
      'vandalism',
      'pickpocketing',
      'suspicious',
      'lost',
      'other'
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false
    },
    accuracy: {
      type: Number, // GPS accuracy in meters
      required: false
    },
    address: {
      type: String,
      required: false
    }
  },
  status: {
    type: String,
    enum: ['reported', 'investigating', 'resolved', 'closed', 'rejected'],
    default: 'reported',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Can be null for anonymous reports
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  mediaUrls: [{
    type: String, // URLs to uploaded images/videos
  }],
  tags: [{
    type: String, // For categorization and searching
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'unverified', 'disputed'],
    default: 'pending',
  },
  responseTime: {
    type: Date, // When authorities first responded
    required: false,
  },
  resolutionTime: {
    type: Date, // When incident was resolved
    required: false,
  },
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isPublic: {
      type: Boolean,
      default: false, // Only visible to authorities by default
    }
  }],
  relatedIncidents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
  }],
  contactInfo: {
    phone: String,
    email: String,
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email', 'app'],
      default: 'app'
    }
  },
  followUpRequired: {
    type: Boolean,
    default: false,
  },
  publiclyVisible: {
    type: Boolean,
    default: true, // Whether incident shows up in public safety data
  },
  metadata: {
    deviceInfo: String,
    appVersion: String,
    reportingMethod: {
      type: String,
      enum: ['mobile_app', 'web', 'phone', 'in_person'],
      default: 'mobile_app'
    },
    ipAddress: String,
    userAgent: String,
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for better performance
incidentSchema.index({ location: '2dsphere' }); // For geospatial queries
incidentSchema.index({ type: 1, status: 1 });
incidentSchema.index({ priority: 1, createdAt: -1 });
incidentSchema.index({ reportedBy: 1, createdAt: -1 });
incidentSchema.index({ createdAt: -1 }); // For sorting by newest first

// Virtual for incident age
incidentSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Virtual for response time calculation
incidentSchema.virtual('timeToResponse').get(function() {
  if (!this.responseTime) return null;
  return this.responseTime - this.createdAt;
});

// Virtual for resolution time calculation
incidentSchema.virtual('timeToResolution').get(function() {
  if (!this.resolutionTime) return null;
  return this.resolutionTime - this.createdAt;
});

// Method to check if incident is urgent
incidentSchema.methods.isUrgent = function() {
  return this.priority === 'critical' || this.priority === 'high';
};

// Method to add a note
incidentSchema.methods.addNote = function(author, content, isPublic = false) {
  this.notes.push({
    author,
    content,
    isPublic,
    timestamp: new Date()
  });
  return this.save();
};

// Static method to find incidents near a location
incidentSchema.statics.findNearLocation = function(longitude, latitude, maxDistance = 1000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    }
  });
};

// Static method to get incidents by priority
incidentSchema.statics.findByPriority = function(priority, limit = 50) {
  return this.find({ priority })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Pre-save middleware to set location if coordinates are provided
incidentSchema.pre('save', function(next) {
  if (this.location && this.location.coordinates && this.location.coordinates.length === 2) {
    this.location.type = 'Point';
  }
  next();
});

module.exports = mongoose.model('Incident', incidentSchema);
