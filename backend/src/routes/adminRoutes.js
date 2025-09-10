const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Handle preflight OPTIONS requests
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', adminController.adminLogin);

// @route   POST /api/admin/create
// @desc    Create new admin user (super_admin only, or initial setup)
// @access  Private (super_admin)
router.post('/create', adminController.createAdmin);

// @route   GET /api/admin/profile
// @desc    Get current admin profile
// @access  Private (admin+)
router.get('/profile', authenticateToken, authorizeRoles('admin', 'super_admin', 'moderator', 'viewer'), adminController.getProfile);

// @route   GET /api/admin/list
// @desc    List all admin users
// @access  Private (super_admin only)
router.get('/list', authenticateToken, authorizeRoles('super_admin'), adminController.listAdmins);

module.exports = router;
