const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define User schema directly
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['tourist', 'admin', 'super_admin', 'moderator', 'viewer', 'emergency_contact'],
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

const createViewerUser = async () => {
  try {
    console.log('🌟 Connecting to MongoDB...');
    
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://test_db_user:TeamEvolvUsr101@test-cluster-phase1.0savtn1.mongodb.net/";
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB');

    // Check if viewer user already exists
    const existingViewer = await User.findOne({ 
      email: 'viewer@smarttouristsafety.com' 
    });
    
    if (existingViewer) {
      console.log('ℹ️  Viewer user already exists:', existingViewer.email);
      console.log('📧 Email:', existingViewer.email);
      console.log('👤 Name:', existingViewer.name);
      console.log('🔑 Role:', existingViewer.role);
      await mongoose.connection.close();
      return;
    }

    // Create viewer user
    const viewerEmail = 'viewer@smarttouristsafety.com';
    const viewerPassword = 'Viewer@2025'; // Simple password for testing
    
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(viewerPassword, salt);

    console.log('👤 Creating viewer user...');
    const viewerUser = new User({
      name: 'Test Viewer',
      email: viewerEmail,
      phone: '+1234567890',
      password: hashedPassword,
      role: 'viewer',
      permissions: [
        'view_dashboard',
        'view_analytics'
      ],
      isActive: true,
    });

    await viewerUser.save();

    console.log('🎉 Viewer user created successfully!');
    console.log('📧 Email:', viewerEmail);
    console.log('🔑 Password:', viewerPassword);
    console.log('👀 Role: Viewer (Read-only access)');
    console.log('🚀 Deployment URL: https://sih-2025-471306.el.r.appspot.com');
    console.log('🌐 Dashboard URL: https://smart-tourist-safety.vercel.app');
    console.log('');
    console.log('📝 Test the login with these credentials:');
    console.log('   Email: ' + viewerEmail);
    console.log('   Password: ' + viewerPassword);
    console.log('');
    console.log('🔍 Viewer Permissions:');
    console.log('   ✅ View Dashboard');
    console.log('   ✅ View Analytics');
    console.log('   ✅ View Live Map');
    console.log('   ✅ View Reports');
    console.log('   ✅ View Statistics');
    console.log('   ❌ Manage Alerts');
    console.log('   ❌ Manage Users');
    console.log('   ❌ System Settings');

  } catch (error) {
    console.error('❌ Error creating viewer user:', error.message);
    if (error.code === 11000) {
      console.log('ℹ️  Viewer user with this email already exists');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
createViewerUser();
