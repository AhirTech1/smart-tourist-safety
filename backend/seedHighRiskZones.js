// Script to seed sample high-risk zones into the database
// Run this with: node seedHighRiskZones.js

const mongoose = require('mongoose');
require('dotenv').config();

// Import the HighRiskZone model
const HighRiskZone = require('./src/models/HighRiskZone');

const sampleZones = [
  {
    name: "Downtown High Crime Area",
    location: { latitude: 21.175, longitude: 72.835 },
    radius: 200,
    riskType: 'High-Alert',
    description: 'Area with reported incidents of theft and harassment'
  },
  {
    name: "Tourist Trap Scam Zone",
    location: { latitude: 21.165, longitude: 72.825 },
    radius: 150,
    riskType: 'High-Alert',
    description: 'Known for tourist scams and overcharging'
  },
  {
    name: "Flood Prone Riverside",
    location: { latitude: 21.180, longitude: 72.840 },
    radius: 300,
    riskType: 'Natural-Calamity-Prone',
    description: 'Area prone to flooding during monsoon season'
  },
  {
    name: "Construction Zone Danger",
    location: { latitude: 21.170, longitude: 72.820 },
    radius: 100,
    riskType: 'Other',
    description: 'Active construction area with safety hazards'
  },
  {
    name: "Landslide Risk Area",
    location: { latitude: 21.185, longitude: 72.845 },
    radius: 250,
    riskType: 'Natural-Calamity-Prone',
    description: 'Hillside area with landslide risk during heavy rains'
  }
];

async function seedHighRiskZones() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-tourist-safety');
    console.log('Connected to MongoDB');

    // Clear existing high-risk zones
    await HighRiskZone.deleteMany({});
    console.log('Cleared existing high-risk zones');

    // Insert sample zones
    const result = await HighRiskZone.insertMany(sampleZones);
    console.log(`Inserted ${result.length} high-risk zones:`);
    
    result.forEach((zone, index) => {
      console.log(`${index + 1}. ${zone.name} (${zone.riskType})`);
    });

    console.log('\nHigh-risk zones seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding high-risk zones:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedHighRiskZones();
