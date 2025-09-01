// controllers/touristController.js

const Tourist = require('../models/tourist');
const Alert = require('../models/alert');

// Register a new tourist (This function is kept for reference but new registrations go through auth_controller)
exports.registerTourist = async (req, res) => {
  // ... this function remains the same, but is not used by the main registration flow anymore
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
    const { id } = req.params; // UPDATED: Changed from deviceId to id
    const { latitude, longitude } = req.body;

    // UPDATED: Changed query to find by _id and removed upsert to prevent creating new users
    const tourist = await Tourist.findByIdAndUpdate(
      id,
      {
        'location.latitude': latitude,
        'location.longitude': longitude,
        lastSeen: Date.now(),
      },
      { new: true } 
    );

    if (!tourist) {
        return res.status(404).json({ message: "Tourist not found for location update." });
    }

    res.status(200).json({ message: 'Location updated', tourist });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};

// Trigger a panic alert
exports.triggerPanic = async (req, res) => {
  try {
    const { id } = req.params; // UPDATED: Changed from deviceId to id
    const tourist = await Tourist.findById(id); // UPDATED: Changed to findById

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
