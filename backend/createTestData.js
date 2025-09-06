const mongoose = require('mongoose');
require('dotenv').config();

const Tourist = require('./src/models/tourist');
const User = require('./src/models/User');

async function createTestTourist() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB for creating test data...');

    // Clear any existing test tourists
    await Tourist.deleteMany({ email: 'test@tourist.com' });
    await User.deleteMany({ email: 'test@tourist.com' });
    
    console.log('Cleared existing test data');

    // Create a test tourist
    const testTourist = new Tourist({
      name: 'Test Tourist',
      email: 'test@tourist.com',
      password: 'hashedpassword123', // In real app, this would be hashed
      phoneNumber: '+91-9876543210',
      tripDuration: 7,
      tripItinerary: 'Delhi -> Agra -> Jaipur',
      kycStatus: 'verified',
      passportNumber: 'A12345678',
      emergencyContacts: [
        {
          name: 'Emergency Contact 1',
          relationship: 'Parent',
          phoneNumber: '+91-9876543211'
        },
        {
          name: 'Emergency Contact 2', 
          relationship: 'Spouse',
          phoneNumber: '+91-9876543212'
        }
      ],
      deviceId: 'test_device_token_123',
      location: {
        latitude: 28.7041,
        longitude: 77.1025
      },
      lastSeen: new Date(),
      registeredAt: new Date()
    });

    const savedTourist = await testTourist.save();
    
    // Also create a User record for completeness
    const testUser = new User({
      name: 'Test Tourist',
      email: 'test@tourist.com',
      phone: '+91-9876543210',
      password: 'hashedpassword123',
      role: 'tourist',
      emergencyContacts: [
        {
          name: 'Emergency Contact 1',
          relationship: 'Parent',
          phone: '+91-9876543211',
          email: 'emergency1@example.com',
          isPrimary: true
        },
        {
          name: 'Emergency Contact 2',
          relationship: 'Spouse', 
          phone: '+91-9876543212',
          email: 'emergency2@example.com',
          isPrimary: false
        }
      ],
      deviceTokens: [{
        token: 'test_device_token_123',
        platform: 'android',
        lastUsed: new Date()
      }],
      preferences: {
        notifications: {
          push: true,
          sms: true,
          email: true
        },
        privacy: {
          shareLocation: true,
          shareWithEmergencyContacts: true
        }
      }
    });

    const savedUser = await testUser.save();
    
    console.log('✅ Test tourist created successfully!');
    console.log(`Tourist ID: ${savedTourist._id}`);
    console.log(`User ID: ${savedUser._id}`);
    console.log(`Name: ${savedTourist.name}`);
    console.log(`Email: ${savedTourist.email}`);
    console.log(`Phone: ${savedTourist.phoneNumber}`);
    console.log(`Emergency Contacts: ${savedTourist.emergencyContacts.length}`);
    
    // Return the ID for use in tests
    return {
      touristId: savedTourist._id.toString(),
      userId: savedUser._id.toString()
    };
    
  } catch (error) {
    console.error('Error creating test tourist:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  createTestTourist()
    .then(ids => {
      console.log('\n📝 Copy this Tourist ID for testing:');
      console.log(`TOURIST_ID=${ids.touristId}`);
      console.log('\n🔧 Update testAI.js with this ID');
    })
    .catch(console.error);
}

module.exports = { createTestTourist };
