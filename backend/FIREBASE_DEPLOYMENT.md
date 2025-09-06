# Smart Tourist Safety Backend - Firebase Deployment Guide

## 🚀 Quick Setup Commands

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Environment Variables for Firebase Functions
```bash
# Set your environment variables
export MONGO_URI="mongodb+srv://test_db_user:TeamEvolvUsr101@test-cluster-phase1.0savtn1.mongodb.net/"
export HUGGINGFACE_API_KEY="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"

# Configure Firebase Functions
firebase functions:config:set \
  app.mongo_uri="$MONGO_URI" \
  app.huggingface_api_key="$HUGGINGFACE_API_KEY" \
  app.risk_threshold="0.7" \
  app.anomaly_detection_radius="1000"
```

### 5. Test Locally (Optional)
```bash
npm run serve
# Opens at http://localhost:5000
```

### 6. Deploy to Firebase
```bash
npm run deploy
# OR
firebase deploy
```

### 7. Quick Deploy Script
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🌐 Your Deployed URLs

After deployment, your API will be available at:

- **Website**: https://sih-2025-e45f5.web.app
- **API Base**: https://asia-south1-sih-2025-e45f5.cloudfunctions.net/api
- **Health Check**: https://asia-south1-sih-2025-e45f5.cloudfunctions.net/api/status

## 📊 API Endpoints

All endpoints will be prefixed with your Firebase Functions URL:

```
POST   /api/ai/analyze
POST   /api/ai/emergency-alert  
GET    /api/ai/location-history/:userId
POST   /api/ai/sentiment-analysis
POST   /api/ai/batch-analyze
GET    /api/ai/risk-zones
POST   /api/tourist/register
POST   /api/auth/login
GET    /api/dashboard/stats
GET    /api/status
```

## 🔧 Firebase Functions Configuration

The backend uses these Firebase Functions:

1. **Main API Function**: `api` - Handles all HTTP requests
2. **Risk Analysis Function**: `analyzeRisk` - Dedicated risk analysis
3. **Alert Function**: `sendAlert` - Handles emergency alerts

## 📱 Testing Your Deployed API

### Test Health Check
```bash
curl https://asia-south1-sih-2025-e45f5.cloudfunctions.net/api/status
```

### Test Risk Analysis
```bash
curl -X POST https://asia-south1-sih-2025-e45f5.cloudfunctions.net/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-test-user-id",
    "location": {
      "lat": 28.6506,
      "lng": 77.2303
    },
    "message": "Testing from deployed API"
  }'
```

## 🔄 Updating Your Deployment

To update your deployed API:

```bash
# Make your changes, then redeploy
firebase deploy --only functions

# For hosting updates only
firebase deploy --only hosting

# For complete redeployment
firebase deploy
```

## 📊 Monitoring

- **View Logs**: `firebase functions:log`
- **Firebase Console**: https://console.firebase.google.com/project/sih-2025-e45f5
- **Function Metrics**: Available in Firebase Console under Functions

## 🚨 Important Notes

1. **Cold Starts**: Firebase Functions may have cold start delays (1-3 seconds)
2. **Timeout**: Functions are configured with 540 seconds timeout
3. **Memory**: Set to 1GB for the main API function
4. **Region**: Deployed to `asia-south1` for optimal Indian performance
5. **Billing**: Monitor usage in Firebase Console

## 🔑 Environment Variables Setup

Your Firebase Functions will automatically use:

- MongoDB connection from `app.mongo_uri`
- Hugging Face API key from `app.huggingface_api_key`
- Risk threshold and other settings from function config

## 🎯 Production Optimizations

The Firebase deployment includes:

- ✅ CORS enabled for web access
- ✅ Database connection pooling
- ✅ Error handling and logging
- ✅ Health monitoring endpoints
- ✅ Optimized memory allocation
- ✅ Regional deployment for low latency

Your Smart Tourist Safety API is now ready for production use! 🚀
