// controllers/dashboardController.js

const Tourist = require('../models/tourist');
const Alert = require('../models/alert');
const HighRiskZone = require('../models/HighRiskZone');

// Get all registered tourists
exports.getAllTourists = async (req, res) => {
  try {
    const tourists = await Tourist.find();
    res.status(200).json(tourists);
  } catch (error) {
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
        res.status(200).json({ tourist, alerts });
    } catch (error) {
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