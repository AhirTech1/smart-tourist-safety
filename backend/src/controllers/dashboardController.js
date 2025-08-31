// controllers/dashboardController.js

const Tourist = require('../models/tourist');
const Alert = require('../models/alert');

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
