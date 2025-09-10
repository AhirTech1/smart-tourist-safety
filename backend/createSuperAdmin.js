const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User');

// Load environment variables
dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.email);
      process.exit(0);
    }

    // Create super admin
    const adminEmail = 'admin@smarttouristsafety.com';
    const adminPassword = 'SuperAdmin@2025'; // Change this to a secure password
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const superAdmin = new User({
      name: 'Super Administrator',
      email: adminEmail,
      phone: '+1234567890',
      password: hashedPassword,
      role: 'super_admin',
      permissions: [
        'view_dashboard',
        'manage_users', 
        'manage_alerts',
        'manage_zones',
        'view_analytics',
        'system_settings',
        'user_management',
        'emergency_response'
      ],
      isActive: true,
    });

    await superAdmin.save();

    console.log('✅ Super Admin created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('⚠️  Please change the password after first login');

  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createSuperAdmin();
