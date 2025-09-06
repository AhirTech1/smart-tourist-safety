#!/bin/bash

echo "🚀 Setting up Smart Tourist Safety AI System for Testing..."

# Install dependencies if needed
echo "📦 Checking dependencies..."
npm list firebase-admin > /dev/null 2>&1 || npm install firebase-admin axios @huggingface/inference

# Seed crime data
echo "🗄️  Seeding crime data..."
node seedCrimeData.js

# Run the comprehensive test
echo "🧪 Running AI system tests..."
node testAI.js

echo "✅ Setup and testing complete!"
