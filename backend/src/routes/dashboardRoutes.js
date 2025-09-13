// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Route to get all tourists for the dashboard
router.get('/tourists', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator', 'viewer'), dashboardController.getAllTourists);

// Route to get all alerts
router.get('/alerts', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator', 'viewer'), dashboardController.getAllAlerts);

// Route to get details for a specific tourist
router.get('/tourist/:id', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator', 'viewer'), dashboardController.getTouristDetails);

// Route to get all high-risk zones
router.get('/high-risk-zones', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator', 'viewer'), dashboardController.getHighRiskZones);

// Route to update alert status (resolve, acknowledge, etc.)
router.put('/alerts/:alertId/status', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator'), dashboardController.updateAlertStatus);

// Route to dispatch emergency services for an alert
router.post('/alerts/:alertId/dispatch', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator'), dashboardController.dispatchEmergencyServices);

// Route to add notes to an alert
router.put('/alerts/:alertId/notes', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator'), dashboardController.updateAlertNotes);

module.exports = router;
