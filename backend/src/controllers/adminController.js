const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

// Define role permissions
const ROLE_PERMISSIONS = {
  super_admin: [
    'view_dashboard',
    'manage_users', 
    'manage_alerts',
    'manage_zones',
    'view_analytics',
    'system_settings',
    'user_management',
    'emergency_response'
  ],
  admin: [
    'view_dashboard',
    'manage_alerts',
    'manage_zones', 
    'view_analytics',
    'emergency_response'
  ],
  moderator: [
    'view_dashboard',
    'manage_alerts',
    'view_analytics'
  ],
  viewer: [
    'view_dashboard',
    'view_analytics'
  ]
};

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email and check if they have admin privileges
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      role: { $in: ['admin', 'super_admin', 'moderator', 'viewer'] },
      isActive: true
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or insufficient privileges' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Get user permissions based on role
    const permissions = ROLE_PERMISSIONS[user.role] || [];

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Create admin user (for initial setup)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role = 'admin' } = req.body;

    // Check if requester is super_admin (except for initial setup)
    const existingAdmins = await User.countDocuments({ 
      role: { $in: ['admin', 'super_admin'] } 
    });

    if (existingAdmins > 0 && (!req.user || req.user.role !== 'super_admin')) {
      return res.status(403).json({ message: 'Only super administrators can create admin users' });
    }

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (!['admin', 'super_admin', 'moderator', 'viewer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const adminUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: req.body.phone || 'N/A',
      permissions: ROLE_PERMISSIONS[role] || [],
      isActive: true
    });

    await adminUser.save();

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        permissions: adminUser.permissions
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error during admin creation' });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const permissions = ROLE_PERMISSIONS[user.role] || [];

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List all admin users (super_admin only)
exports.listAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: ['admin', 'super_admin', 'moderator', 'viewer'] }
    }).select('-password').sort({ createdAt: -1 });

    const adminsWithPermissions = admins.map(admin => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: ROLE_PERMISSIONS[admin.role] || [],
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt
    }));

    res.json({ admins: adminsWithPermissions });
  } catch (error) {
    console.error('List admins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  adminLogin: exports.adminLogin,
  createAdmin: exports.createAdmin,
  getProfile: exports.getProfile,
  listAdmins: exports.listAdmins,
  ROLE_PERMISSIONS
};
