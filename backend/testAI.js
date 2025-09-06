const axios = require('axios');
const { createTestTourist } = require('./createTestData');

// Configuration
const BASE_URL = 'http://localhost:5000';
let TEST_USER_ID = null; // Will be set dynamically

// Test scenarios
const testScenarios = [
  {
    name: 'Low Risk Location',
    location: { lat: 28.7041, lng: 77.1025 }, // Delhi - relatively safe area
    expectedRisk: 'low'
  },
  {
    name: 'High Crime Area',
    location: { lat: 28.6506, lng: 77.2303 }, // Chandni Chowk - has crime data
    expectedRisk: 'high'
  },
  {
    name: 'Night Time Risk',
    location: { lat: 28.6304, lng: 77.2177 }, // Connaught Place at night
    expectedRisk: 'medium'
  }
];

async function setupTestData() {
  console.log('🔧 Setting up test data...\n');
  
  try {
    const testData = await createTestTourist();
    TEST_USER_ID = testData.touristId;
    console.log(`✅ Test tourist created with ID: ${TEST_USER_ID}\n`);
    return true;
  } catch (error) {
    console.error('❌ Failed to create test data:', error.message);
    return false;
  }
}

async function testRiskAnalysis() {
  console.log('🚨 Testing Smart Tourist Safety AI System 🚨\n');

  for (const scenario of testScenarios) {
    console.log(`\n📍 Testing: ${scenario.name}`);
    console.log(`Location: ${scenario.location.lat}, ${scenario.location.lng}`);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/ai/analyze`, {
        userId: TEST_USER_ID,
        location: scenario.location,
        message: `Testing from ${scenario.name}`
      });

      if (response.data.success) {
        const { riskAnalysis, alertTriggered } = response.data.data;
        
        console.log(`✅ Risk Score: ${(riskAnalysis.score * 100).toFixed(1)}%`);
        console.log(`🚨 Alert Triggered: ${alertTriggered ? 'YES' : 'NO'}`);
        console.log(`📊 Risk Factors:`, riskAnalysis.riskFactors);
        
        if (riskAnalysis.anomalies.length > 0) {
          console.log(`⚠️  Anomalies Detected:`);
          riskAnalysis.anomalies.forEach(anomaly => {
            console.log(`   - ${anomaly.type}: ${anomaly.description}`);
          });
        }
        
        if (riskAnalysis.recommendations.length > 0) {
          console.log(`💡 Recommendations:`);
          riskAnalysis.recommendations.forEach(rec => {
            console.log(`   - ${rec}`);
          });
        }
      } else {
        console.log(`❌ Test failed: ${response.data.message}`);
      }
      
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
      if (error.response?.data) {
        console.log(`   Error details:`, error.response.data);
      }
    }
    
    console.log('─'.repeat(50));
  }
}

async function testEmergencyAlert() {
  console.log('\n🚨 Testing Emergency Alert System\n');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/ai/emergency-alert`, {
      userId: TEST_USER_ID,
      location: { lat: 28.6139, lng: 77.2090 }, // India Gate, Delhi
      type: 'Panic',
      message: 'Test emergency alert - please ignore',
      severity: 'high'
    });

    if (response.data.success) {
      console.log('✅ Emergency alert sent successfully');
      console.log(`📧 Notifications sent: ${response.data.data.notificationsSent}`);
      console.log(`🏥 Nearest services found: ${response.data.data.nearestServices}`);
    } else {
      console.log(`❌ Emergency alert failed: ${response.data.message}`);
    }
    
  } catch (error) {
    console.log(`❌ Emergency alert request failed: ${error.message}`);
  }
}

async function testSentimentAnalysis() {
  console.log('\n🧠 Testing Sentiment Analysis\n');
  
  const testMessages = [
    'I am feeling scared and unsafe here',
    'Help me please, something is wrong',
    'Everything is fine, having a great time',
    'This place seems dangerous'
  ];

  for (const message of testMessages) {
    try {
      const response = await axios.post(`${BASE_URL}/api/ai/sentiment-analysis`, {
        text: message
      });

      if (response.data.success) {
        const sentiment = response.data.data.sentiment;
        console.log(`📝 "${message}"`);
        console.log(`   Sentiment: ${sentiment.label} (${(sentiment.score * 100).toFixed(1)}%)`);
      }
      
    } catch (error) {
      console.log(`❌ Sentiment analysis failed for: "${message}"`);
    }
  }
}

async function runAllTests() {
  try {
    // Test if server is running
    await axios.get(`${BASE_URL}/`);
    console.log('✅ Server is running');
    
    // Setup test data first
    const setupSuccess = await setupTestData();
    if (!setupSuccess) {
      console.log('❌ Cannot proceed without test data');
      return;
    }
    
    await testRiskAnalysis();
    await testEmergencyAlert();
    await testSentimentAnalysis();
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('- Risk analysis tests check location-based threats');
    console.log('- Emergency alert tests notification system');
    console.log('- Sentiment analysis tests AI text understanding');
    console.log('\n⚠️  Note: Some features require API keys to be configured');
    
  } catch (error) {
    console.log('❌ Server is not running or unreachable');
    console.log('Make sure to start the server with: npm run dev');
    console.log('Error:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testRiskAnalysis,
  testEmergencyAlert,
  testSentimentAnalysis,
  runAllTests
};
