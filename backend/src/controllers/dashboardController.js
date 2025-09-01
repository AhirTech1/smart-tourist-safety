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
    // For now, we'll return a hardcoded list.
    // Later, this can be replaced with a database query.
    const zones = [
      { id: 1, name: "High Alert Zone A", location: { latitude: 21.175, longitude: 72.835 }, radius: 200, riskType: 'High-Alert' },
      { id: 2, name: "High Alert Zone B", location: { latitude: 21.165, longitude: 72.825 }, radius: 150, riskType: 'High-Alert' },
      { id: 3, name: "Flood Prone Area", location: { latitude: 21.180, longitude: 72.840 }, radius: 300, riskType: 'Natural-Calamity-Prone' },
    ];
    res.status(200).json(zones);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching high-risk zones', error: error.message });
  }
};