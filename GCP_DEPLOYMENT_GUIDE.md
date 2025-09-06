# 🚀 Deploy Smart Tourist Safety Backend to Google Cloud Platform

## ✅ Why GCP is Better Than Render

### Render Free Tier Issues:
- ❌ Services hibernate after 15 minutes
- ❌ 1-2 minute cold start times
- ❌ Limited to 512MB RAM
- ❌ No persistent storage
- ❌ Unreliable for production

### GCP Advantages:
- ✅ **$300 free credits** (90 days) - way more than needed
- ✅ **No hibernation** - always-on services
- ✅ **Fast performance** - Google's infrastructure
- ✅ **Scalable** - handle real traffic
- ✅ **Multiple deployment options** (App Engine, Cloud Run, Compute Engine)

## 🎯 Best GCP Options for Your Backend

### Option 1: **App Engine** (Recommended)
- **Cost**: ~$5-10/month with your credits
- **Benefits**: Automatic scaling, zero maintenance, built for Node.js
- **Perfect for**: Your Express.js backend

### Option 2: **Cloud Run** (Serverless)
- **Cost**: ~$2-5/month with your credits
- **Benefits**: Containerized, pay-per-request, very fast
- **Perfect for**: Microservices architecture

### Option 3: **Compute Engine** (VM)
- **Cost**: ~$10-20/month with your credits
- **Benefits**: Full control, traditional server setup
- **Perfect for**: If you want complete control

## 🚀 Quick Deployment Guide - App Engine (Easiest)

### Step 1: Install Google Cloud CLI
```bash
# Download and install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### Step 2: Prepare Your Backend
```bash
cd backend/
```

### Step 3: Create `app.yaml` (App Engine config)
```yaml
runtime: nodejs18

env_variables:
  MONGO_URI: "mongodb+srv://test_db_user:TeamEvolvUsr101@test-cluster-phase1.0savtn1.mongodb.net/"
  HUGGINGFACE_API_KEY: "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"
  RISK_THRESHOLD: "0.7"
  ANOMALY_DETECTION_RADIUS: "1000"

automatic_scaling:
  min_instances: 1
  max_instances: 10
```

### Step 4: Deploy
```bash
gcloud app deploy
```

### Step 5: Get Your URL
```bash
gcloud app browse
```

Your backend will be available at: `https://PROJECT_ID.appspot.com`

## 🐳 Alternative: Cloud Run Deployment

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["node", "src/index.js"]
```

### Step 2: Deploy to Cloud Run
```bash
gcloud run deploy smart-tourist-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGO_URI="mongodb+srv://test_db_user:TeamEvolvUsr101@test-cluster-phase1.0savtn1.mongodb.net/" \
  --set-env-vars HUGGINGFACE_API_KEY="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"
```

## 📱 Update Mobile App & Dashboard

Once deployed, update the URLs:

### Mobile App (`api_service.dart`):
```dart
static const String _baseUrl = 'https://YOUR_PROJECT_ID.appspot.com/api';
```

### Dashboard (`apiService.js`):
```javascript
const API_URL = 'https://YOUR_PROJECT_ID.appspot.com/api';
```

## 💰 Cost Estimation with $300 Credits

### App Engine:
- **Monthly cost**: $5-15
- **Your credits last**: 20-60 months
- **Performance**: Excellent, no cold starts

### Cloud Run:
- **Monthly cost**: $2-8
- **Your credits last**: 37-150 months
- **Performance**: Very good, minimal cold starts

### Free Tier Included:
- App Engine: 28 instance hours/day free
- Cloud Run: 2 million requests/month free
- **Your backend will likely run FREE within quotas**

## 🎯 Recommended Next Steps

1. **Choose App Engine** (easiest, most reliable)
2. **Set up Google Cloud Project** (if not done)
3. **Deploy backend** (5-10 minutes)
4. **Update frontend URLs**
5. **Test thoroughly** (much faster than Render!)

## 🔧 Prerequisites

1. **Google Account** with GCP access
2. **$300 credits** activated
3. **Project created** in Google Cloud Console

Would you like me to create the deployment files and guide you through the specific deployment process? GCP will be **much more reliable** than Render!
