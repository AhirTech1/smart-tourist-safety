# 🛡️ Smart Tourist Safety System

<div align="center">

![Smart Tourist Safety Logo](mobile-app/assets/Logo.png)

**A comprehensive safety platform for tourists with real-time tracking, emergency alerts, and risk zone management**

[![Flutter](https://img.shields.io/badge/Flutter-3.4.1-blue.svg)](https://flutter.dev/)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [💻 Detailed Setup Instructions](#-detailed-setup-instructions)
- [🔧 Configuration](#-configuration)
- [📚 API Documentation](#-api-documentation)
- [🛠️ Development Scripts](#️-development-scripts)
- [🚨 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)

---

## 🌟 Features

### 📱 **Mobile App (Flutter)**
- **🏠 Home Dashboard**: Quick access to emergency features and safety tools
- **🗺️ Interactive Maps**: Real-time location tracking with high-risk zone visualization
- **👤 Profile Management**: User settings, KYC verification, and theme customization
- **🚨 SOS Emergency**: One-tap panic button for immediate help
- **📍 Location Sharing**: Send current location to emergency contacts
- **⚠️ Safety Alerts**: Receive and manage safety notifications
- **☎️ Emergency Contacts**: Quick access to emergency services and personal contacts
- **📝 Incident Reporting**: Report safety incidents and suspicious activities
- **💡 Safety Tips**: Comprehensive safety guidelines for tourists

### 🖥️ **Admin Dashboard (React)**
- **📊 Real-time Analytics**: Monitor tourist activities and safety metrics
- **🗺️ Live Tourist Map**: Track all registered tourists in real-time
- **🔴 High-Risk Zone Management**: Define and manage dangerous areas
- **🚨 Alert Management**: Handle and respond to emergency alerts
- **📈 Statistics & Reports**: Detailed insights into safety trends
- **👥 Tourist Management**: View and manage registered tourists

### 🔧 **Backend API (Node.js)**
- **🔐 Authentication System**: Secure login/registration for tourists
- **📍 Location Tracking**: Real-time location updates and storage
- **🚨 Emergency Response**: Panic alert handling and notification system
- **🗄️ Database Management**: MongoDB integration for data persistence
- **📡 RESTful APIs**: Well-documented API endpoints
- **🛡️ Security Features**: Data validation, error handling, and logging

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│  Flutter Mobile │    │   React Admin   │    │   Node.js API   │
│      App        │◄──►│    Dashboard    │◄──►│     Server      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────┬───────┘
                                                        │
                                              ┌─────────▼───────┐
                                              │                 │
                                              │  MongoDB Atlas  │
                                              │    Database     │
                                              │                 │
                                              └─────────────────┘
```

---

## 🚀 Quick Start Guide

> **For Experienced Developers**: If you're familiar with Flutter, React, and Node.js, follow these quick steps:

```bash
# 1. Clone the repository
git clone https://github.com/AhirTech1/smart-tourist-safety.git
cd smart-tourist-safety

# 2. Setup Backend
cd backend
npm install
cp .env.example .env  # Configure your environment
npm start

# 3. Setup Dashboard
cd ../dashboard
npm install
npm run dev

# 4. Setup Mobile App
cd ../mobile-app
flutter pub get
flutter run
```

---

## 💻 Detailed Setup Instructions

### 📋 Prerequisites

Before you begin, make sure you have the following installed on your computer:

#### **For Complete Beginners:**

1. **Node.js** (for backend and dashboard)
   - Visit [nodejs.org](https://nodejs.org/)
   - Download and install the LTS version (recommended)
   - Verify installation: Open terminal/command prompt and type `node --version`

2. **Flutter SDK** (for mobile app)
   - Visit [flutter.dev](https://docs.flutter.dev/get-started/install)
   - Follow the installation guide for your operating system
   - Verify installation: Type `flutter doctor` in terminal

3. **MongoDB Atlas** (database)
   - Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a new cluster (free tier available)
   - Get your connection string

4. **Code Editor** (recommended)
   - [Visual Studio Code](https://code.visualstudio.com/) with Flutter and ES7 extensions
   - Or [Android Studio](https://developer.android.com/studio) for mobile development

---

### 🔧 Step-by-Step Setup

#### **Step 1: Clone the Repository**

```bash
# Open terminal/command prompt and run:
git clone https://github.com/AhirTech1/smart-tourist-safety.git
cd smart-tourist-safety
```

#### **Step 2: Backend Setup** 🔧

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# PORT=5000

# (Optional) Seed sample high-risk zones
node seedHighRiskZones.js

# Start the backend server
npm start
```

**✅ Backend should now be running on `http://localhost:5000`**

#### **Step 3: Admin Dashboard Setup** 🖥️

```bash
# Open a new terminal and navigate to dashboard
cd dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

**✅ Dashboard should now be running on `http://localhost:3000`**

#### **Step 4: Mobile App Setup** 📱

```bash
# Open a new terminal and navigate to mobile-app
cd mobile-app

# Get Flutter dependencies
flutter pub get

# Check if everything is set up correctly
flutter doctor

# Connect your Android device or start an emulator
# Then run the app
flutter run
```

**✅ Mobile app should now be running on your device/emulator**

---

## 🔧 Configuration

### Backend Configuration (`.env`)

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-tourist-safety

# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-here

# API Keys (if needed)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Mobile App Configuration

1. **Google Maps API Key**: 
   - Get a key from [Google Cloud Console](https://console.cloud.google.com/)
   - Add it to `android/app/src/main/AndroidManifest.xml`

2. **Backend URL**:
   - Update `_baseUrl` in `lib/services/api_service.dart`
   - Use `10.0.2.2:5000` for Android Emulator
   - Use your actual IP address for physical devices

### Dashboard Configuration

Update the API URL in `src/services/apiService.js`:

```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register
POST /api/auth/login
```

### Tourist Endpoints

```http
POST /api/tourist/location/:id
POST /api/tourist/panic/:id
```

### Dashboard Endpoints

```http
GET /api/dashboard/tourists
GET /api/dashboard/alerts
GET /api/dashboard/high-risk-zones
```

### Example API Calls

**Register a Tourist:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phoneNumber": "+1234567890",
  "tripDuration": 7,
  "emergencyContacts": [
    {
      "name": "Emergency Contact",
      "phone": "+1234567890",
      "relationship": "Family"
    }
  ]
}
```

---

## 🛠️ Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
node seedHighRiskZones.js  # Seed sample high-risk zones
```

### Dashboard
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Mobile App
```bash
flutter run           # Run in debug mode
flutter run --release # Run in release mode
flutter build apk     # Build APK for Android
flutter clean         # Clean build files
```

---

## 🚨 Troubleshooting

### Common Issues and Solutions

**1. Backend won't start**
- Check if MongoDB is running and connection string is correct
- Ensure port 5000 is not already in use
- Verify all environment variables are set

**2. Mobile app location issues**
- Enable location permissions on your device
- Check Google Play Services are installed
- Verify Google Maps API key is configured

**3. Dashboard can't connect to backend**
- Ensure backend server is running on localhost:5000
- Check for CORS issues in browser console
- Verify API endpoints are correct

**4. Flutter build errors**
- Run `flutter clean && flutter pub get`
- Update Flutter SDK: `flutter upgrade`
- Check `flutter doctor` for missing dependencies

**5. Google Play Services error on Android**
- Ensure you added the required meta-data tags in AndroidManifest.xml
- Check that Google Play Services dependencies are included in build.gradle

---

## 🌟 Features in Detail

### 🔐 **Security Features**
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure location data handling

### 📍 **Location Services**
- Real-time GPS tracking
- High-accuracy location updates
- Offline location caching
- Privacy-focused data handling

### 🚨 **Emergency System**
- One-tap SOS button
- Automatic location sharing
- Emergency contact notifications
- Integration with local authorities

### 🗺️ **Mapping Features**
- Interactive Google Maps integration
- High-risk zone visualization
- Emergency service locations
- Route planning and navigation

---

## 🤝 Contributing

We welcome contributions to make this project even better! Here's how you can help:

1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Your Changes**: Follow our coding standards
4. **Test Your Changes**: Ensure everything works correctly
5. **Commit Your Changes**: `git commit -m 'Add amazing feature'`
6. **Push to Branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**: Describe your changes and improvements

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 🎯 Future Enhancements

- [ ] **AI-Powered Risk Assessment**: Machine learning for better risk prediction
- [ ] **Multi-language Support**: Internationalization for global tourists
- [ ] **Offline Mode**: Core features working without internet
- [ ] **Wearable Integration**: Smartwatch support for quick alerts
- [ ] **Voice Commands**: Hands-free emergency activation
- [ ] **Social Features**: Connect with other tourists safely
- [ ] **Government Integration**: Direct connection with local authorities
- [ ] **Blockchain Integration**: Secure digital identity verification

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/AhirTech1/smart-tourist-safety/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AhirTech1/smart-tourist-safety/discussions)
- **Developer**: AhirTech1

---

<div align="center">

**Made with ❤️ for Tourist Safety**

⭐ **Star this project if it helped you!** ⭐

</div>

