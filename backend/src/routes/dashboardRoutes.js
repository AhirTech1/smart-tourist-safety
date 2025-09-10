// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Route to get all tourists for the dashboard
router.get('/tourists', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator'), dashboardController.getAllTourists);

// Route to get all alerts
router.get('/alerts', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator'), dashboardController.getAllAlerts);

// Route to get details for a specific tourist
router.get('/tourist/:id', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator'), dashboardController.getTouristDetails);

// Route to get all high-risk zones
router.get('/high-risk-zones', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator'), dashboardController.getHighRiskZones);

module.exports = router;
