# Smart Tourist Safety Backend - Render.com Deployment Guide

## 🚀 Quick Render.com Deployment (100% FREE)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment with full AI integration"
git push origin main
```

### Step 2: Deploy on Render.com
1. Go to [render.com](https://render.com) and sign up (FREE)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your repository: `smart-tourist-safety`
5. Configure deployment settings:

### Step 3: Render Configuration
```yaml
Name: smart-tourist-safety-api
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node src/index.js
Instance Type: Free
```

### Step 4: Environment Variables
Add these in Render dashboard under "Environment":

```bash
MONGO_URI=mongodb+srv://test_db_user:TeamEvolvUsr101@test-cluster-phase1.0savtn1.mongodb.net/
HUGGINGFACE_API_KEY=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
FIREBASE_PROJECT_ID=sih-2025-e45f5
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDARwxBbf3rQ5/V
w+l6G8dC0HNl4po90X8ve5PMX7Y1wcVdjeHxif+lDO3OM4hVXcFCRwXKXrgbER6m
mf1urRoC2mMNXkYALDUuC4a6iuFn1rMmPJpPYRbn1TWI6cX0m3Yci3XfMP76Qlmn
vzdE00xbR1YGdWkqNcrr4O0Q70WZFPkgT61uvhCdHNn/Q2Xoaqa4CHEhE1bEipEX
Kve9kokY/w8S8n+Krk8KPBGsa2p3XlyByq2Gqn0iK5i6mzT56Fq5mZvUsRFZkYwi
sdjJqBV/j+1T2ThHDeTpv7uRx45NfcoZWMnr9aaiJXJ8HO0SLD8m/5tcvuhfAtt/
vsvoxZvRAgMBAAECggEADe84MqezfrDMbRQBICHSO4Pa0RfugKtlkb3ddLK9BEFS
Odj19mi/V6lLtKVkbHdacaCvCT77Da8cbwt64+H0oB9OjWH3Jb0Ob5NTRMKa2kkj
e5JpxnXtUIjRk+YJPBRmJ2Rt+upUmDNlxvPjIABGKNlPITGyGOaEGbsXwyHsA89y
n1UKfjY2GmKI43ZsjcM2YdEhhegj/phpEuZfMTRuV4wb6co+AT7cDV1EMESEHN+T
eHg+vBWILBf1Iw8ppNgEyLciK6zdyYvTnFfRPUhb7JTUeinHUNeM8EoJTYzM4FYZ
f36YidKePKvaGC+HMxHJGgF1TLhVZMLi/IZvR/xVJwKBgQDloS0a0kO7BqZzL8dF
WtzfghnYWtdarkseX5psAf2sKqcfaTddLqaondBKeVB8ak5RQiQP+XZRAkbZrJrZ
z5WubBFsvUJ1A6KFxiM6xyPCwBsqNd+Vx6x7Cr9UPitZjKMipEuxlvHtx8wFNfHK
xvGZBtwLeMr8Vg+hivVVu0tSfwKBgQDWW8R/u4N0Fxah/kfQ4Mnlcn0JiC+ll0ph
eqj8FYH36MtdtMWuzDQ1rcIR4Hb/jDQcmiNUeMnCVphwFvWsQhWR7tVZOZpaVt7t
V7W+llVdZXuM66wZo0/2Lri88VgbW998tYm2Baop0AXJOeZISdQYG/VaW5Pdh9fw
fqQ6FT5JrwKBgE6wTr6UMzWR79QlGUpA+tN0x9qGNqoSdBdyd35vqDgpXZ+79Ibw
B5hcjBYZQGWCIFhkK+t1dwAHobPSHDZrlkVxLv9uU6m5lyX0YfowZ6bDIgvy7i1r
gUWgxzPdIgnL0dN7LZ0rtrfe8aEPfU4Zoozn9tvPhu+1piGbdrrsNcGNAoGAB0SJ
PwNui4sU210xtiVI8xyUnLQfWW/tt6xe+l0IUQ11h7HPWgPWaVOA1vZTUorAYY/g
TsbhoFMrS/GbVsHO1WnRlfrb/uAfItDseo/CSS5dqAN9jEj7Nw+Sd+V+5T6SLzpA
dwluIYjKCW6LHjxSkpawFOYx9zrZ2W+Rxd5ehEUCgYEAsFUB6qTwor7rh1nqRzlz
SoWhf0juyHlF+aNXQA8qGgoGahYiJPnDyrGz4GLW1rQ0pEpFEvHaxi2WHDH1LgE3
cVp7mT/CeeS4hieH1+pTmM2HasCPsfr+lszGTQxe+ElRocCJXPzoUUrl4X6lEcBT
vALb8M9vG9c+XvoV4bVjfKM=
-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@sih-2025-e45f5.iam.gserviceaccount.com
RISK_THRESHOLD=0.7
ANOMALY_DETECTION_RADIUS=1000
NODE_ENV=production
```

## 🎯 Your Deployed API Will Have:

### 🧠 Full AI Integration:
- ✅ **Risk Analysis**: Real-time threat assessment
- ✅ **Sentiment Analysis**: Panic message understanding
- ✅ **Crime Pattern Detection**: Historical data analysis
- ✅ **Movement Anomaly Detection**: GPS tracking analysis
- ✅ **Smart Recommendations**: AI-generated safety advice

### 🚨 Emergency Features:
- ✅ **Firebase Push Notifications**: Instant alerts
- ✅ **Emergency Contact Alerts**: SMS/Email notifications
- ✅ **Location Tracking**: Real-time GPS monitoring
- ✅ **Panic Button**: One-tap emergency alerts

### 📊 Dashboard APIs:
- ✅ **Tourist Management**: Registration & profiles
- ✅ **Real-time Monitoring**: Live tourist tracking
- ✅ **Analytics**: Risk reports and statistics
- ✅ **Crime Data Management**: Database of incidents

## 🌐 Your Live URLs:
After deployment (takes ~5 minutes):
- **API Base**: `https://your-app-name.onrender.com`
- **Health Check**: `https://your-app-name.onrender.com/api/status`
- **Risk Analysis**: `https://your-app-name.onrender.com/api/ai/analyze`

## 🧪 Test Your Deployed AI:
```bash
# Test risk analysis with AI
curl -X POST https://your-app-name.onrender.com/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "location": {"lat": 28.6506, "lng": 77.2303},
    "message": "I feel unsafe here"
  }'

# Test sentiment analysis
curl -X POST https://your-app-name.onrender.com/api/ai/sentiment-analysis \
  -H "Content-Type: application/json" \
  -d '{"text": "Help me please, I am scared"}'
```

## 🚀 Render.com Benefits:
- ✅ **100% FREE** (750 hours/month)
- ✅ **Auto-deploys** from GitHub
- ✅ **HTTPS included**
- ✅ **Custom domains** available
- ✅ **Zero configuration** needed
- ✅ **Scales automatically**
- ✅ **Built-in monitoring**

## 📱 Perfect for SIH Demo:
- ✅ **Professional URLs**
- ✅ **Reliable uptime**
- ✅ **Fast response times**
- ✅ **All AI features working**
- ✅ **Real-time capabilities**

Your Smart Tourist Safety backend with **FULL AI integration** will be **100% functional** on Render.com! 🚀🧠
