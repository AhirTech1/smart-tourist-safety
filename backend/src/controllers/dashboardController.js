// controllers/dashboardController.js

const Tourist = require('../models/tourist');
const Alert = require('../models/alert');
const HighRiskZone = require('../models/HighRiskZone');

// Get all registered tourists
exports.getAllTourists = async (req, res) => {
  try {
    const tourists = await Tourist.find().lean(); // Use lean() for better performance
    
    // Normalize digitalId format for frontend compatibility
    const normalizedTourists = tourists.map(tourist => {
      try {
        // Handle backward compatibility for digitalId
        if (tourist.digitalId) {
          // If digitalId is still a string (old format), convert to new format
          if (typeof tourist.digitalId === 'string') {
            tourist.digitalId = {
              issuedDate: tourist.createdAt || new Date(),
              expiryDate: tourist.idValidUntil,
              status: (tourist.idValidUntil && new Date() > new Date(tourist.idValidUntil)) ? 'expired' : 'active',
              idString: tourist.digitalId
            };
          }
        } else {
          // If digitalId is null/undefined, create a basic structure
          tourist.digitalId = {
            issuedDate: tourist.createdAt || new Date(),
            expiryDate: tourist.idValidUntil,
            status: (tourist.idValidUntil && new Date() > new Date(tourist.idValidUntil)) ? 'expired' : 'active',
            idString: null
          };
        }
        
        // Ensure required fields exist
        tourist.kycStatus = tourist.kycStatus || 'pending';
        tourist.emergencyContacts = tourist.emergencyContacts || [];
        tourist.idNumber = tourist.idNumber || '';
        
        return tourist;
      } catch (normalizationError) {
        console.error('Error normalizing tourist data:', normalizationError);
        // Return tourist with minimal safe data
        return {
          ...tourist,
          digitalId: null,
          kycStatus: 'pending',
          emergencyContacts: [],
          idNumber: ''
        };
      }
    });
    
    res.status(200).json(normalizedTourists);
  } catch (error) {
    console.error('Error fetching tourists:', error);
    res.status(500).json({ message: 'Error fetching tourists', error: error.message });
  }
};

// Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate('tourist');
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
};

// Get details for a specific tourist
exports.getTouristDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const tourist = await Tourist.findById(id);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        
        const alerts = await Alert.find({ tourist: id });
        
        // Normalize tourist data for frontend compatibility
        const touristObj = tourist.toObject();
        
        // Handle backward compatibility for digitalId
        if (touristObj.digitalId && typeof touristObj.digitalId === 'string') {
          touristObj.digitalId = {
            issuedDate: touristObj.createdAt || new Date(),
            expiryDate: touristObj.idValidUntil,
            status: new Date() > new Date(touristObj.idValidUntil) ? 'expired' : 'active',
            idString: touristObj.digitalId
          };
        }
        
        res.status(200).json({ tourist: touristObj, alerts });
    } catch (error) {
        console.error('Error fetching tourist details:', error);
        res.status(500).json({ message: 'Error fetching tourist details', error: error.message });
    }
};

exports.getHighRiskZones = async (req, res) => {
  try {
    const HighRiskZone = require('../models/HighRiskZone');
    const zones = await HighRiskZone.find({});
    
    if (zones.length === 0) {
      // If no zones in database, return sample data for demonstration
      const sampleZones = [
        { 
          _id: 'sample1',
          name: "Sample High Alert Zone A", 
          location: { latitude: 21.175, longitude: 72.835 }, 
          radius: 200, 
          riskType: 'High-Alert',
          description: 'Sample zone for demonstration'
        },
        { 
          _id: 'sample2',
          name: "Sample High Alert Zone B", 
          location: { latitude: 21.165, longitude: 72.825 }, 
          radius: 150, 
          riskType: 'High-Alert',
          description: 'Sample zone for demonstration'
        },
        { 
          _id: 'sample3',
          name: "Sample Flood Prone Area", 
          location: { latitude: 21.180, longitude: 72.840 }, 
          radius: 300, 
          riskType: 'Natural-Calamity-Prone',
          description: 'Sample natural disaster zone'
        },
      ];
      return res.status(200).json(sampleZones);
    }
    
    res.status(200).json(zones);
  } catch (error) {
    console.error('Error fetching high-risk zones:', error);
    res.status(500).json({ message: 'Error fetching high-risk zones', error: error.message });
  }
};

// Update alert status (resolve, acknowledge, false alarm, etc.)
exports.updateAlertStatus = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, notes } = req.body;
    const resolvedBy = req.user.id; // From JWT token

    const alertService = require('../services/alertService');
    const updatedAlert = await alertService.updateAlertStatus(alertId, status, resolvedBy, notes);

    if (!updatedAlert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.status(200).json({ 
      message: 'Alert status updated successfully', 
      alert: updatedAlert 
    });
  } catch (error) {
    console.error('Error updating alert status:', error);
    res.status(500).json({ message: 'Error updating alert status', error: error.message });
  }
};

// Dispatch emergency services for an alert
exports.dispatchEmergencyServices = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { serviceType, priority, dispatchNotes } = req.body;
    const dispatchedBy = req.user.id;

    // Find the alert
    const alert = await Alert.findById(alertId).populate('tourist');
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    // Create dispatch record
    const dispatchRecord = {
      serviceType: serviceType || 'police', // police, ambulance, fire, tourist_helpline
      priority: priority || 'high',
      dispatchedBy: dispatchedBy,
      dispatchedAt: new Date(),
      notes: dispatchNotes || `Emergency services dispatched for ${alert.type} alert`,
      location: alert.location,
      touristInfo: {
        name: alert.tourist.name,
        phone: alert.tourist.phoneNumber
      }
    };

    // Add dispatch record to alert
    if (!alert.emergencyDispatches) {
      alert.emergencyDispatches = [];
    }
    alert.emergencyDispatches.push(dispatchRecord);

    // Update alert status to acknowledged
    if (alert.status === 'Active') {
      alert.status = 'Acknowledged';
    }

    await alert.save();

    // Log the dispatch action
    console.log(`Emergency services (${serviceType}) dispatched for alert ${alertId} by user ${dispatchedBy}`);

    res.status(200).json({ 
      message: 'Emergency services dispatched successfully',
      alert: alert,
      dispatch: dispatchRecord
    });
  } catch (error) {
    console.error('Error dispatching emergency services:', error);
    res.status(500).json({ message: 'Error dispatching emergency services', error: error.message });
  }
};

// Update alert notes
exports.updateAlertNotes = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { notes } = req.body;
    const updatedBy = req.user.id;

    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { 
        notes: notes,
        notesUpdatedBy: updatedBy,
        notesUpdatedAt: new Date()
      },
      { new: true }
    ).populate('tourist');

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.status(200).json({ 
      message: 'Alert notes updated successfully', 
      alert: alert 
    });
  } catch (error) {
    console.error('Error updating alert notes:', error);
    res.status(500).json({ message: 'Error updating alert notes', error: error.message });
  }
};