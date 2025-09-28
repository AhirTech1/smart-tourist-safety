// controllers/incidentController.js

const Incident = require('../models/Incident');
const User = require('../models/User');

const natural = require('natural');
const classifier = new natural.BayesClassifier();

// You would train this with your own data
classifier.addDocument('My wallet was stolen', 'theft');
classifier.addDocument('Someone grabbed my bag', 'theft');
classifier.addDocument('I was pushed and my phone was taken', 'robbery');
classifier.addDocument('I feel unsafe, someone is following me', 'harassment');
classifier.addDocument('I need a doctor, I fell down', 'medical');
classifier.train();

exports.createIncident = async (req, res) => {
    try {
        const { description, location } = req.body;
        const incidentType = classifier.classify(description);

        const newIncident = new Incident({
            description,
            location,
            incidentType, // The auto-classified type
            // ... other incident fields
        });

        await newIncident.save();
        res.status(201).json(newIncident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Report a new incident
exports.reportIncident = async (req, res) => {
  try {
    const {
      type,
      description,
      priority,
      location,
      isAnonymous,
      reportedBy,
      mediaUrls,
      contactInfo,
      tags
    } = req.body;

    // Validate required fields
    if (!type || !description || !priority) {
      return res.status(400).json({
        message: 'Missing required fields: type, description, and priority are required'
      });
    }

    // Prepare incident data
    const incidentData = {
      type,
      description: description.trim(),
      priority,
      isAnonymous: isAnonymous || false,
      status: 'reported',
      verificationStatus: 'pending',
      publiclyVisible: true,
      metadata: {
        reportingMethod: 'mobile_app',
        deviceInfo: req.get('User-Agent') || 'Unknown',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    };

    // Add reporter information if not anonymous
    if (!isAnonymous && reportedBy) {
      // Verify the user exists
      const user = await User.findById(reportedBy);
      if (user) {
        incidentData.reportedBy = reportedBy;
      }
    }

    // Add location if provided
    if (location && location.latitude && location.longitude) {
      incidentData.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude], // GeoJSON format: [lng, lat]
        accuracy: location.accuracy || null
      };
    }

    // Add media URLs if provided
    if (mediaUrls && Array.isArray(mediaUrls)) {
      incidentData.mediaUrls = mediaUrls.filter(url => typeof url === 'string' && url.trim());
    }

    // Add contact info if provided
    if (contactInfo) {
      incidentData.contactInfo = {
        phone: contactInfo.phone || '',
        email: contactInfo.email || '',
        preferredContactMethod: contactInfo.preferredContactMethod || 'app'
      };
    }

    // Add tags if provided
    if (tags && Array.isArray(tags)) {
      incidentData.tags = tags.filter(tag => typeof tag === 'string' && tag.trim());
    }

    // Set follow-up requirement based on priority
    if (priority === 'critical' || priority === 'high') {
      incidentData.followUpRequired = true;
    }

    // Create the incident
    const newIncident = new Incident(incidentData);
    await newIncident.save();

    // Populate reporter info if not anonymous
    if (!isAnonymous && newIncident.reportedBy) {
      await newIncident.populate('reportedBy', 'name email');
    }

    // TODO: Implement real-time notifications to authorities
    // TODO: Send confirmation email/SMS if contact info provided
    // TODO: Trigger appropriate emergency response for critical incidents

    res.status(201).json({
      message: 'Incident reported successfully',
      incident: {
        id: newIncident._id,
        type: newIncident.type,
        priority: newIncident.priority,
        status: newIncident.status,
        createdAt: newIncident.createdAt,
        location: newIncident.location,
        isAnonymous: newIncident.isAnonymous
      }
    });

  } catch (error) {
    console.error('Error reporting incident:', error);
    res.status(500).json({
      message: 'Error reporting incident',
      error: error.message
    });
  }
};

// Get incidents with filtering and pagination
exports.getIncidents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      priority,
      status,
      reportedBy,
      startDate,
      endDate,
      lat,
      lng,
      radius = 1000 // Default 1km radius
    } = req.query;

    // Build query
    const query = {};
    
    // Only show publicly visible incidents unless user is admin
    // TODO: Add admin role checking
    query.publiclyVisible = true;

    if (type) query.type = type;
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (reportedBy) query.reportedBy = reportedBy;

    // Date range filtering
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Location-based filtering
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const incidents = await Incident.find(query)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Incident.countDocuments(query);

    res.status(200).json({
      incidents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalIncidents: total,
        hasNextPage: skip + incidents.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error getting incidents:', error);
    res.status(500).json({
      message: 'Error retrieving incidents',
      error: error.message
    });
  }
};

// Get a specific incident by ID
exports.getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('relatedIncidents', 'type priority status createdAt');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Check if user has permission to view this incident
    // TODO: Implement proper authorization logic
    if (!incident.publiclyVisible) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ incident });

  } catch (error) {
    console.error('Error getting incident:', error);
    res.status(500).json({
      message: 'Error retrieving incident',
      error: error.message
    });
  }
};

// Update incident status (for authorities/admin)
exports.updateIncidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, assignedTo } = req.body;

    // TODO: Add proper authentication and authorization
    // Only admin/authority users should be able to update status

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Update status
    if (status) {
      incident.status = status;
      
      // Set response time if moving to investigating
      if (status === 'investigating' && !incident.responseTime) {
        incident.responseTime = new Date();
      }
      
      // Set resolution time if resolving
      if ((status === 'resolved' || status === 'closed') && !incident.resolutionTime) {
        incident.resolutionTime = new Date();
      }
    }

    // Assign to user if provided
    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (assignee) {
        incident.assignedTo = assignedTo;
      }
    }

    // Add note if provided
    if (note && note.trim()) {
      incident.notes.push({
        author: null, // TODO: Get from authenticated user
        content: note.trim(),
        isPublic: false,
        timestamp: new Date()
      });
    }

    await incident.save();

    // TODO: Send notifications to reporter if contact info available

    res.status(200).json({
      message: 'Incident updated successfully',
      incident: {
        id: incident._id,
        status: incident.status,
        updatedAt: incident.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({
      message: 'Error updating incident',
      error: error.message
    });
  }
};

// Get incidents near a location
exports.getIncidentsByLocation = async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { radius = 1000, limit = 50, type, priority } = req.query;

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: 'Invalid coordinates provided' });
    }

    // Build query
    const query = {
      publiclyVisible: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: parseInt(radius)
        }
      }
    };

    // Add filters
    if (type) query.type = type;
    if (priority) query.priority = priority;

    const incidents = await Incident.find(query)
      .select('type priority status location createdAt description')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      incidents,
      location: {
        latitude,
        longitude,
        radius: parseInt(radius)
      },
      count: incidents.length
    });

  } catch (error) {
    console.error('Error getting incidents by location:', error);
    res.status(500).json({
      message: 'Error retrieving incidents by location',
      error: error.message
    });
  }
};
