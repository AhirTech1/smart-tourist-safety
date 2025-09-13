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
        'location.timestamp': new Date(),
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
    const { location: liveLocation } = req.body; // Get live location from request if available
    const tourist = await Tourist.findById(id); // UPDATED: Changed to findById

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Use live location if provided, otherwise fall back to stored location
    let alertLocation = tourist.location;
    let locationSource = 'stored';
    
    if (liveLocation && liveLocation.latitude && liveLocation.longitude) {
      alertLocation = {
        latitude: liveLocation.latitude,
        longitude: liveLocation.longitude,
        timestamp: liveLocation.timestamp || new Date(),
        accuracy: liveLocation.accuracy || null
      };
      locationSource = 'live_gps';
      
      // Also update the tourist's stored location with the latest coordinates
      tourist.location = alertLocation;
      tourist.lastSeen = Date.now();
      await tourist.save();
    }

    const newAlert = new Alert({
      tourist: tourist._id,
      location: alertLocation,
      type: 'Panic',
      message: `Emergency SOS alert triggered by user (Location: ${locationSource})`,
      severity: 'critical',
      metadata: {
        locationSource: locationSource,
        timestamp: new Date(),
        accuracy: alertLocation.accuracy || 'unknown'
      }
    });

    await newAlert.save();

    // Here you would add logic to notify authorities, etc.

    res.status(200).json({ 
      message: 'Panic alert triggered successfully', 
      alert: newAlert,
      locationSource: locationSource 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error triggering panic alert', error: error.message });
  }
};
