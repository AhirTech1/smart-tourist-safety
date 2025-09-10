const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define User schema directly (since we might not have models loaded in GCP environment)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['tourist', 'admin', 'super_admin', 'moderator', 'emergency_contact'],
    default: 'tourist',
  },
  permissions: [{
    type: String,
    enum: [
      'view_dashboard', 'manage_users', 'manage_alerts', 'manage_zones',
      'view_analytics', 'system_settings', 'user_management', 'emergency_response'
    ]
  }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

const createGCPSuperAdmin = async () => {
  try {
    console.log('🌟 Connecting to MongoDB for GCP deployment...');
    
    // Use environment variable or fallback
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://test_db_user:TeamEvolvUsr101@test-cluster-phase1.0savtn1.mongodb.net/";
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('ℹ️  Super admin already exists:', existingSuperAdmin.email);
      console.log('📧 Email:', existingSuperAdmin.email);
      console.log('👤 Name:', existingSuperAdmin.name);
      console.log('🔄 Last Login:', existingSuperAdmin.lastLogin);
      await mongoose.connection.close();
      return;
    }

    // Create super admin with strong credentials
    const adminEmail = 'admin@smarttouristsafety.com';
    const adminPassword = 'SuperAdmin@2025!GCP'; // Stronger password for production
    
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(12); // Stronger salt for production
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    console.log('👤 Creating super admin user...');
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

    console.log('🎉 Super Admin created successfully on GCP!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🚀 Deployment URL: https://sih-2025-471306.el.r.appspot.com');
    console.log('🌐 Dashboard URL: https://smarttouristsafety.vercel.app');
    console.log('⚠️  Please change the password after first login');
    console.log('');
    console.log('📝 Test the login with these credentials:');
    console.log('   POST https://sih-2025-471306.el.r.appspot.com/api/admin/login');
    console.log('   Body: { "email": "' + adminEmail + '", "password": "' + adminPassword + '" }');

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    if (error.code === 11000) {
      console.log('ℹ️  Super admin with this email already exists');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
createGCPSuperAdmin();
