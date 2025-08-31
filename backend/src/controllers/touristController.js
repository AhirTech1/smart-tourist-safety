// controllers/touristController.js

const Tourist = require('../models/tourist');
const Alert = require('../models/alert');

// Register a new tourist
exports.registerTourist = async (req, res) => {
  try {
    const { name, deviceId, contactInfo } = req.body;
    const newTourist = new Tourist({
      name,
      deviceId,
      contactInfo,
    });
    await newTourist.save();
    res.status(201).json({ message: 'Tourist registered successfully', tourist: newTourist });
  } catch (error) {
    res.status(500).json({ message: 'Error registering tourist', error: error.message });
  }
};

// Update tourist's location
exports.updateLocation = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { latitude, longitude } = req.body;

    const tourist = await Tourist.findOneAndUpdate(
      { deviceId },
      {
        'location.latitude': latitude,
        'location.longitude': longitude,
        lastSeen: Date.now(),
      },
      { new: true, upsert: true } // Creates a new document if one doesn't exist
    );

    res.status(200).json({ message: 'Location updated', tourist });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};

// Trigger a panic alert
exports.triggerPanic = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const tourist = await Tourist.findOne({ deviceId });

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const newAlert = new Alert({
      tourist: tourist._id,
      location: tourist.location,
      type: 'Panic',
    });

    await newAlert.save();

    // Here you would add logic to notify authorities, etc.

    res.status(200).json({ message: 'Panic alert triggered successfully', alert: newAlert });
  } catch (error) {
    res.status(500).json({ message: 'Error triggering panic alert', error: error.message });
  }
};
