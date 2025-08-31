// routes/touristRoutes.js

const express = require('express');
const router = express.Router();
const touristController = require('../controllers/touristController');

// Route to register a new tourist
router.post('/register', touristController.registerTourist);

// Route to update a tourist's location
router.post('/location/:deviceId', touristController.updateLocation);

// Route to trigger a panic alert
router.post('/panic/:deviceId', touristController.triggerPanic);

module.exports = router;
