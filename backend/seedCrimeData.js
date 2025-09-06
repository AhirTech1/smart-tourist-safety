const mongoose = require('mongoose');
require('dotenv').config();

const CrimeData = require('./src/models/CrimeData');
const Location = require('./src/models/Location');

async function seedCrimeData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB for seeding...');

    // Clear existing crime data
    await CrimeData.deleteMany({});
    console.log('Cleared existing crime data');

    // Sample crime data for major Indian tourist cities
    const crimeData = [
      // Delhi
      {
        area: 'Connaught Place, Delhi',
        coordinates: {
          type: 'Point',
          coordinates: [77.2177, 28.6304] // [longitude, latitude]
        },
        crimeType: 'pickpocketing',
        severity: 6,
        description: 'Tourist reported wallet theft near metro station',
        reportedBy: 'tourist',
        verificationStatus: 'verified',
        timeOfIncident: new Date('2024-01-15T18:30:00Z'),
        affectedRadius: 200
      },
      {
        area: 'Chandni Chowk, Delhi',
        coordinates: {
          type: 'Point',
          coordinates: [77.2303, 28.6506] // [longitude, latitude]
        },
        crimeType: 'scam',
        severity: 4,
        description: 'Fake gemstone selling scam targeting tourists',
        reportedBy: 'police',
        verificationStatus: 'verified',
        timeOfIncident: new Date('2024-01-20T14:15:00Z'),
        affectedRadius: 300
      },
      
      // Mumbai
      {
        area: 'Gateway of India, Mumbai',
        coordinates: {
          type: 'Point',
          coordinates: [72.8347, 18.9220] // [longitude, latitude]
        },
        crimeType: 'harassment',
        severity: 5,
        description: 'Tourist harassment by unauthorized guides',
        reportedBy: 'tourist',
        verificationStatus: 'verified',
        timeOfIncident: new Date('2024-01-25T16:45:00Z'),
        affectedRadius: 250
      },
      {
        area: 'Colaba, Mumbai',
        coordinates: {
          type: 'Point',
          coordinates: [72.8147, 18.9067] // [longitude, latitude]
        },
        crimeType: 'theft',
        severity: 7,
        description: 'Camera theft from tourist at busy market',
        reportedBy: 'police',
        verificationStatus: 'verified',
        timeOfIncident: new Date('2024-02-01T20:30:00Z'),
        affectedRadius: 400
      },

      // Goa
      {
        area: 'Baga Beach, Goa',
        coordinates: {
          type: 'Point',
          coordinates: [73.7516, 15.5557]
        },
        crimeType: 'theft',
        severity: 5,
        description: 'Beach belongings theft while swimming',
        reportedBy: 'tourist',
        verificationStatus: 'verified',
        timeOfIncident: new Date('2024-02-05T12:00:00Z'),
        affectedRadius: 150
      },
      {
        area: 'Anjuna Beach, Goa',
        coordinates: {
          type: 'Point',
          coordinates: [73.7361, 15.5733]
        },
        crimeType: 'fraud',
        severity: 6,
        description: 'Overcharging at beach shacks',
        reportedBy: 'tourist',
        verificationStatus: 'pending',
        timeOfIncident: new Date('2024-02-08T19:15:00Z'),
        affectedRadius: 200
      },

      // Jaipur
      {
        area: 'Hawa Mahal, Jaipur',
        coordinates: {
          type: 'Point',
          coordinates: [75.8267, 26.9239]
        },
        crimeType: 'scam',
        severity: 4,
        description: 'Fake palace entry tickets sold to tourists',
        reportedBy: 'admin',
        verificationStatus: 'verified',
        timeOfIncident: new Date('2024-02-10T11:30:00Z'),
        affectedRadius: 300
      },

      // Agra
      {
        area: 'Taj Mahal, Agra',
        coordinates: {
          type: 'Point',
          coordinates: [78.0421, 27.1751]
        },
        crimeType: 'harassment',
        severity: 3,
        description: 'Persistent vendor harassment near monument',
        reportedBy: 'tourist',
        verificationStatus: 'verified',
        timeOfIncident: new Date('2024-02-12T09:45:00Z'),
        affectedRadius: 500
      },

      // Varanasi
      {
        area: 'Dashashwamedh Ghat, Varanasi',
        coordinates: {
          type: 'Point',
          coordinates: [83.0108, 25.3069]
        },
        crimeType: 'pickpocketing',
        severity: 5,
        description: 'Phone theft during evening aarti',
        reportedBy: 'police',
        verificationStatus: 'verified',
        timeOfIncident: new Date('2024-02-15T18:00:00Z'),
        affectedRadius: 200
      },

      // Recent incidents for testing real-time alerts
      {
        area: 'Khan Market, Delhi',
        coordinates: {
          type: 'Point',
          coordinates: [77.2295, 28.5983] // [longitude, latitude]
        },
        crimeType: 'robbery',
        severity: 8,
        description: 'Armed robbery near market entrance',
        reportedBy: 'police',
        verificationStatus: 'verified',
        timeOfIncident: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        affectedRadius: 400
      },
      {
        area: 'Marina Beach, Chennai',
        coordinates: {
          type: 'Point',
          coordinates: [80.2785, 13.0487] // [longitude, latitude]
        },
        crimeType: 'assault',
        severity: 9,
        description: 'Tourist assault reported on beach',
        reportedBy: 'tourist',
        verificationStatus: 'pending',
        timeOfIncident: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        affectedRadius: 300
      }
    ];

    // Insert crime data
    const insertedCrimes = await CrimeData.insertMany(crimeData);
    console.log(`Inserted ${insertedCrimes.length} crime records`);

    console.log('Crime data seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding crime data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

// Create sample location data for testing (optional)
async function seedSampleLocations() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // This is just sample data - in real app, this comes from mobile devices
    console.log('Sample location seeding would go here...');
    
  } catch (error) {
    console.error('Error seeding locations:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedCrimeData();
}

module.exports = {
  seedCrimeData,
  seedSampleLocations
};
