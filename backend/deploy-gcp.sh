#!/bin/bash

# 🚀 Google Cloud Platform Deployment Script
# Smart Tourist Safety Backend

echo "🌟 Starting GCP deployment..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Please install it first:"
    echo "curl https://sdk.cloud.google.com | bash"
    echo "exec -l \$SHELL"
    echo "gcloud init"
    exit 1
fi

# Check if we're in the backend directory
if [ ! -f "app.yaml" ]; then
    echo "❌ app.yaml not found. Please run this script from the backend directory."
    exit 1
fi

echo "✅ Found app.yaml configuration"

# Check if project is set
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No GCP project set. Please run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📍 Deploying to project: $PROJECT_ID"

# Deploy to App Engine
echo "🚀 Deploying to Google App Engine..."
gcloud app deploy --quiet

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    
    # Get the URL
    URL=$(gcloud app browse --no-launch-browser 2>&1 | grep -o 'https://[^[:space:]]*')
    if [ -n "$URL" ]; then
        echo "🌐 Your backend is now live at: $URL"
        echo "📱 Update your mobile app and dashboard with this URL:"
        echo "   Mobile: $URL/api"
        echo "   Dashboard: $URL/api"
        echo ""
        echo "🧪 Test your API:"
        echo "   curl $URL/api/status"
    else
        echo "🌐 Your app is deployed! Run 'gcloud app browse' to get the URL"
    fi
    
    echo ""
    echo "💰 Check your usage and costs:"
    echo "   https://console.cloud.google.com/billing"
    echo ""
    echo "📊 Monitor your app:"
    echo "   https://console.cloud.google.com/appengine"
    
else
    echo "❌ Deployment failed!"
    echo "💡 Common issues:"
    echo "   1. Make sure billing is enabled for your project"
    echo "   2. Enable App Engine API: gcloud services enable appengine.googleapis.com"
    echo "   3. Check app.yaml configuration"
    exit 1
fi
