#!/bin/bash

echo "🔥 Firebase Deployment Script for Smart Tourist Safety Backend"
echo "============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found!${NC}"
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

echo -e "${GREEN}✅ Firebase CLI found${NC}"

# Check if logged in to Firebase
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Firebase${NC}"
    echo "Please login with: firebase login"
    exit 1
fi

echo -e "${GREEN}✅ Firebase authentication successful${NC}"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set Firebase configuration
echo "⚙️  Setting up Firebase configuration..."

# Set environment variables for Firebase Functions
firebase functions:config:set \
  app.mongo_uri="$MONGO_URI" \
  app.huggingface_api_key="$HUGGINGFACE_API_KEY" \
  app.risk_threshold="0.7" \
  app.anomaly_detection_radius="1000"

echo -e "${GREEN}✅ Firebase configuration set${NC}"

# Test locally first (optional)
read -p "🧪 Do you want to test locally first? (y/n): " test_local
if [[ $test_local == "y" || $test_local == "Y" ]]; then
    echo "🚀 Starting local emulators..."
    firebase emulators:start --only functions,hosting &
    EMULATOR_PID=$!
    
    echo "📱 Local testing available at:"
    echo "   Functions: http://localhost:5001/sih-2025-e45f5/asia-south1/api"
    echo "   Hosting: http://localhost:5000"
    echo ""
    read -p "Press Enter when ready to deploy to production..."
    
    # Kill emulator
    kill $EMULATOR_PID 2>/dev/null
fi

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy --only functions,hosting

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo ""
    echo "📱 Your API is now live at:"
    echo "   🌐 https://sih-2025-e45f5.web.app"
    echo "   🔗 https://asia-south1-sih-2025-e45f5.cloudfunctions.net/api"
    echo ""
    echo "📊 Available endpoints:"
    echo "   POST /api/ai/analyze"
    echo "   POST /api/ai/emergency-alert"
    echo "   GET  /api/ai/location-history/:userId"
    echo "   POST /api/ai/sentiment-analysis"
    echo "   GET  /api/status"
    echo ""
    echo "🔧 Monitor logs with: firebase functions:log"
    echo ""
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi
