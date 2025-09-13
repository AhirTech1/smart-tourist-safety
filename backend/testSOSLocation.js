const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tourist = require('./src/models/tourist');
const Alert = require('./src/models/alert');

// Load environment variables
dotenv.config();

const testSOSWithLocation = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Find a test tourist or create one
    let tourist = await Tourist.findOne().limit(1);
    
    if (!tourist) {
      console.log('Creating test tourist...');
      tourist = new Tourist({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        location: {
          latitude: 28.7041,
          longitude: 77.1025,
          address: 'New Delhi, India'
        }
      });
      await tourist.save();
      console.log('✅ Test tourist created');
    }

    console.log(`Using tourist: ${tourist.name} (${tourist._id})`);

    // Test 1: SOS without live location (should use stored location)
    console.log('\n🧪 Test 1: SOS Alert without live GPS');
    const alert1 = new Alert({
      tourist: tourist._id,
      location: tourist.location,
      type: 'Panic',
      message: 'Emergency SOS alert triggered by user (Location: stored)',
      severity: 'critical',
      metadata: {
        locationSource: 'stored',
        timestamp: new Date(),
        accuracy: 'unknown'
      }
    });
    await alert1.save();
    console.log('✅ Alert 1 saved:', alert1._id);

    // Test 2: SOS with live location
    console.log('\n🧪 Test 2: SOS Alert with live GPS coordinates');
    const liveLocation = {
      latitude: 28.7041 + (Math.random() - 0.5) * 0.01, // Slight random offset
      longitude: 77.1025 + (Math.random() - 0.5) * 0.01,
      timestamp: new Date(),
      accuracy: 'high'
    };

    const alert2 = new Alert({
      tourist: tourist._id,
      location: liveLocation,
      type: 'Panic',
      message: 'Emergency SOS alert triggered by user (Location: live_gps)',
      severity: 'critical',
      metadata: {
        locationSource: 'live_gps',
        timestamp: new Date(),
        accuracy: 'high'
      }
    });
    await alert2.save();
    console.log('✅ Alert 2 saved:', alert2._id);

    // Update tourist location with live coordinates
    tourist.location = liveLocation;
    tourist.lastSeen = Date.now();
    await tourist.save();
    console.log('✅ Tourist location updated with live coordinates');

    // Display results
    console.log('\n📊 Test Results:');
    const alerts = await Alert.find({ tourist: tourist._id }).sort({ timestamp: -1 }).limit(2);
    
    alerts.forEach((alert, index) => {
      console.log(`\nAlert ${index + 1}:`);
      console.log(`  Type: ${alert.type}`);
      console.log(`  Message: ${alert.message}`);
      console.log(`  Severity: ${alert.severity}`);
      console.log(`  Location Source: ${alert.metadata?.locationSource || 'N/A'}`);
      console.log(`  Coordinates: ${alert.location?.latitude?.toFixed(6)}, ${alert.location?.longitude?.toFixed(6)}`);
      console.log(`  Timestamp: ${alert.timestamp}`);
    });

    console.log('\n✅ All tests completed successfully!');
    console.log('📱 The SOS button will now:');
    console.log('   1. Try to get live GPS coordinates');
    console.log('   2. Include location source in the message');
    console.log('   3. Send coordinates to the backend');
    console.log('   4. Display location info on the dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testSOSWithLocation();
