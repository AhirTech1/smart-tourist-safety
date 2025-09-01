const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

// @route   POST api/auth/register
// @desc    Register a new tourist
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate tourist & get token
// @access  Public
router.post('/login', authController.login);

module.exports = router;
