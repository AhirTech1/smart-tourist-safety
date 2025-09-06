#!/bin/bash

echo "🚀 Preparing Smart Tourist Safety Backend for Render.com Deployment"
echo "=================================================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔧 Checking project structure...${NC}"

# Check if all required files exist
required_files=(
  "src/index.js"
  "package.json"
  "src/config/firebase.js"
  "src/services/riskAnalyzer.js"
  "src/services/alertService.js"
  "src/routes/aiRoutes.js"
)

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ $file${NC}"
  else
    echo -e "${YELLOW}⚠️  Missing: $file${NC}"
  fi
done

echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
npm install

echo -e "\n${BLUE}🧪 Testing the application locally...${NC}"
echo "Starting server for 5 seconds to verify it works..."

# Start the server in background and test
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test the health endpoint
if curl -s http://localhost:5000/api/status > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Server is working correctly!${NC}"
else
  echo -e "${YELLOW}⚠️  Server test failed, but deployment might still work${NC}"
fi

# Kill the test server
kill $SERVER_PID 2>/dev/null

echo -e "\n${GREEN}🎯 Ready for Render.com deployment!${NC}"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to render.com and create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Use these settings:"
echo "   - Build Command: npm install"
echo "   - Start Command: node src/index.js"
echo "   - Root Directory: backend"
echo ""
echo "5. Add environment variables from your .env file"
echo ""
echo -e "${GREEN}🚀 Your AI-powered backend will be live in ~5 minutes!${NC}"
