require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI format:', process.env.MONGO_URI ? 'loaded' : 'missing');

// Hide password but show structure
const maskedUri = process.env.MONGO_URI?.replace(/:([^:@]+)@/, ':***@');
console.log('🔍 Masked URI:', maskedUri);

// Test connection with detailed logging
async function debugConnection() {
    try {
        console.log('\n🚀 Attempting MongoDB connection...');
        
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // 5 second timeout
        });
        
        console.log('✅ SUCCESS: Connected to MongoDB!');
        console.log('Database name:', connection.connection.db.databaseName);
        console.log('Connection state:', connection.connection.readyState);
        
        await mongoose.disconnect();
        console.log('✅ Disconnected successfully');
        
    } catch (error) {
        console.log('❌ CONNECTION FAILED:');
        console.log('Error type:', error.constructor.name);
        console.log('Error message:', error.message);
        console.log('Error code:', error.code);
        console.log('Error codeName:', error.codeName);
        
        if (error.reason) {
            console.log('Detailed reason:', error.reason);
        }
    }
}

debugConnection();