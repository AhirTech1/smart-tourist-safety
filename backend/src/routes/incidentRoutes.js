// routes/incidentRoutes.js

const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

// Route to report a new incident
router.post('/report', incidentController.reportIncident);

// Route to get incident reports
router.get('/', incidentController.getIncidents);

// Route to get a specific incident by ID
router.get('/:id', incidentController.getIncidentById);

// Route to update incident status (for admin/authorities)
router.patch('/:id/status', incidentController.updateIncidentStatus);

// Route to get incidents by location (within radius)
router.get('/location/:lat/:lng', incidentController.getIncidentsByLocation);

module.exports = router;
