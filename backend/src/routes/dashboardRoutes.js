// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route to get all tourists for the dashboard
router.get('/tourists', dashboardController.getAllTourists);

// Route to get all alerts
router.get('/alerts', dashboardController.getAllAlerts);

// Route to get details for a specific tourist
router.get('/tourist/:id', dashboardController.getTouristDetails);


module.exports = router;
