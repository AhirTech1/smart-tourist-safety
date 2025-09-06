# Connect Frontend Apps to Deployed Backend

## 🚀 Backend Deployment Complete!

Your backend is now deployed on Render. Follow these steps to connect your frontend applications:

## Step 1: Get Your Render Backend URL

1. Go to your Render dashboard
2. Find your deployed backend service
3. Copy the URL (should look like: `https://your-app-name.onrender.com`)

## Step 2: Update Dashboard Configuration

**File: `dashboard/src/services/apiService.js`**

Replace `YOUR_RENDER_URL` with your actual Render URL:

```javascript
const API_URL = 'https://your-actual-app-name.onrender.com/api';
```

## Step 3: Update Mobile App Configuration

**File: `mobile-app/lib/services/api_service.dart`**

Replace `YOUR_RENDER_URL` with your actual Render URL:

```dart
static const String _baseUrl = 'https://your-actual-app-name.onrender.com/api';
```

## Step 4: Test the Connections

### Dashboard Testing:
```bash
cd dashboard
npm run dev
```
- Open browser to `http://localhost:5173`
- Try logging in (any email/password works for demo)
- Check if data loads from your deployed backend

### Mobile App Testing:
```bash
cd mobile-app
flutter run
```
- Test login/registration functionality
- Verify location tracking connects to backend
- Check if AI risk analysis works

## 🔧 API Endpoints Available

Your deployed backend provides these endpoints:

### Authentication
- `POST /api/auth/register` - Register new tourist
- `POST /api/auth/login` - Login tourist

### Tourist Operations
- `GET /api/tourists` - Get all tourists
- `POST /api/tourists` - Create tourist
- `PUT /api/tourists/:id/location` - Update location

### AI Features
- `POST /api/ai/analyze` - AI risk analysis
- `POST /api/ai/emergency-alert` - Send emergency alert
- `POST /api/ai/sentiment-analysis` - Analyze sentiment

### Dashboard
- `GET /api/dashboard/tourists` - Get tourists for dashboard
- `GET /api/dashboard/alerts` - Get all alerts
- `GET /api/dashboard/high-risk-zones` - Get risk zones

### Health Check
- `GET /` - API status
- `GET /api/status` - Detailed service status

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Backend is configured to allow all origins for development
2. **404 Errors**: Make sure your Render URL is correct and includes `/api`
3. **Timeout**: First request to Render might be slow (free tier spins down)

### Check Backend Status:
Visit: `https://your-render-url.onrender.com/api/status`

Should return:
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "services": {
    "ai": true,
    "mongodb": true
  }
}
```

## 🎯 Quick Replacement Commands

If your Render URL is `https://smart-tourist-backend.onrender.com`, run:

```bash
# Update Dashboard
sed -i 's/YOUR_RENDER_URL/smart-tourist-backend/g' dashboard/src/services/apiService.js

# Update Mobile App
sed -i 's/YOUR_RENDER_URL/smart-tourist-backend/g' mobile-app/lib/services/api_service.dart
```

## ✅ Features Working After Connection

- 🧠 **AI Risk Analysis** - Real-time safety scoring
- 📱 **Mobile App** - Location tracking and alerts
- 📊 **Dashboard** - Tourist monitoring and analytics
- 🚨 **Emergency Alerts** - Automated safety notifications
- 🗺️ **Crime Data Analysis** - Location-based risk assessment
- 💬 **Sentiment Analysis** - Tourist feedback processing

Your Smart Tourist Safety System is now fully operational! 🎉
