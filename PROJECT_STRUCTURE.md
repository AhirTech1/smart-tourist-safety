# 🏗️ Smart Tourist Safety System - Project Structure

This document provides a comprehensive overview of the project structure, explaining the purpose and functionality of each file and directory in the Smart Tourist Safety System.

---

## 📂 Root Directory Structure

```
smart-tourist-safety/
├── 📁 backend/                    # Node.js API Server
├── 📁 dashboard/                  # React Admin Dashboard
├── 📁 mobile-app/                 # Flutter Mobile Application
├── 📄 README.md                   # Main project documentation
├── 📄 PROJECT_STRUCTURE.md        # This file - detailed structure guide
├── 📄 CONNECT_TO_BACKEND.md       # Backend connection guide
├── 📄 GCP_DEPLOYMENT_GUIDE.md     # Google Cloud deployment instructions
├── 📄 INCIDENT_REPORTING_FEATURES.md # Incident reporting system documentation
├── 📄 SOS_CONFIRMATION_FEATURE.md # SOS feature implementation guide
└── 📄 SOS_UX_IMPROVEMENTS.md      # SOS UX enhancement documentation
```

---

## 🖥️ Backend Directory (`/backend`)

The Node.js backend server providing RESTful APIs, authentication, and business logic.

### Root Files
```
backend/
├── 📄 package.json                # Dependencies and scripts
├── 📄 app.yaml                    # Google App Engine configuration
├── 📄 Dockerfile                  # Docker containerization config
├── 📄 deploy-gcp.sh              # GCP deployment script
├── 📄 README.md                   # Backend-specific documentation
├── 📄 createSuperAdmin.js         # Super admin user creation script
├── 📄 createViewerUser.js         # Viewer user creation script
├── 📄 seedCrimeData.js           # Sample crime data seeding script
├── 📄 seedHighRiskZones.js       # High-risk zones data seeding
└── 📄 setupGCPAdmin.js           # GCP admin setup automation
```

### Source Code (`/backend/src`)
```
src/
├── 📄 index.js                    # Main server entry point with optimizations
├── 📁 config/                     # Configuration files
├── 📁 controllers/                # Business logic controllers
│   ├── 📄 adminController.js      # Admin management operations
│   ├── 📄 auth_controller.js      # Authentication logic
│   ├── 📄 dashboardController.js  # Dashboard data operations
│   ├── 📄 incidentController.js   # Incident reporting logic
│   └── 📄 touristController.js    # Tourist management operations
├── 📁 middleware/                 # Express middleware
│   └── 📄 auth.js                 # JWT authentication & authorization
├── 📁 models/                     # MongoDB data models
│   ├── 📄 User.js                 # Admin/user schema
│   ├── 📄 tourist.js              # Tourist profile schema
│   ├── 📄 alert.js                # Emergency alert schema
│   ├── 📄 HighRiskZone.js         # Risk zone definition schema
│   ├── 📄 Location.js             # Location tracking schema
│   └── 📄 Incident.js             # Incident report schema
├── 📁 routes/                     # API route definitions
│   ├── 📄 adminRoutes.js          # Admin management endpoints
│   ├── 📄 aiRoutes.js             # AI/ML integration endpoints
│   ├── 📄 auth_routes.js          # Authentication endpoints
│   ├── 📄 dashboardRoutes.js      # Dashboard data endpoints
│   ├── 📄 incidentRoutes.js       # Incident reporting endpoints
│   └── 📄 touristRoutes.js        # Tourist management endpoints
└── 📁 services/                   # Business services
    ├── 📄 alertService.js         # Alert notification service
    └── 📄 riskAnalyzer.js         # AI risk analysis service
```

### Public Directory (`/backend/public`)
```
public/
└── 📄 index.html                  # API documentation landing page
```

---

## 📊 Dashboard Directory (`/dashboard`)

React-based admin dashboard for monitoring and managing tourist safety operations.

### Root Files
```
dashboard/
├── 📄 package.json                # Dependencies and build scripts
├── 📄 postcss.config.js          # PostCSS configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 vite.config.js             # Vite build tool configuration
├── 📄 vercel.json                # Vercel deployment settings
└── 📄 README.md                   # Dashboard documentation
```

### Source Code (`/dashboard/src`)
```
src/
├── 📄 App.jsx                     # Main application component
├── 📄 main.jsx                    # React application entry point
├── 📄 index.css                   # Global styles and Tailwind imports
├── 📁 components/                 # Reusable UI components
│   ├── 📄 Sidebar.jsx             # Navigation sidebar with role-based access
│   ├── 📄 DashboardHome.jsx       # Main dashboard overview
│   ├── 📄 TouristMap.jsx          # Interactive map with tourist locations
│   ├── 📄 Alerts.jsx              # Emergency alerts management
│   ├── 📄 Reports.jsx             # Incident reports interface
│   ├── 📄 Statistics.jsx          # Analytics and statistics
│   ├── 📄 LoadingSpinner.jsx      # Loading indicator component
│   └── 📄 ErrorBoundary.jsx       # Error handling component
├── 📁 contexts/                   # React context providers
│   ├── 📄 AuthContext.jsx         # Authentication state management
│   ├── 📄 AlertContext.jsx        # Alert notifications context
│   └── 📄 IncidentContext.jsx     # Incident reporting context
├── 📁 hooks/                      # Custom React hooks
├── 📁 services/                   # API integration services
│   └── 📄 apiService.js           # Backend API communication
├── 📁 utils/                      # Utility functions
│   └── 📄 debugger.js             # Development debugging utilities
├── 📁 views/                      # Page-level components
│   ├── 📄 DashboardView.jsx       # Main dashboard layout
│   └── 📄 LoginView.jsx           # Admin login interface
└── 📁 styles/                     # Additional styling files
```

### Public Assets (`/dashboard/public`)
```
public/
├── 📄 _headers                    # HTTP headers configuration
├── 📄 favicon.ico                 # Website favicon
└── 🖼️ Logo.png                   # Application logo
```

---

## 📱 Mobile App Directory (`/mobile-app`)

Flutter cross-platform mobile application for tourists.

### Root Files
```
mobile-app/
├── 📄 pubspec.yaml                # Flutter dependencies and configuration
├── 📄 pubspec.lock                # Dependency lock file
├── 📄 analysis_options.yaml       # Code analysis configuration
├── 📄 l10n.yaml                   # Localization configuration
├── 📄 README.md                   # Mobile app documentation
├── 📄 HIBERNATION_FIX.md          # App hibernation issue solutions
└── 📄 MOBILE_CONNECTION_FIX.md    # Mobile connectivity troubleshooting
```

### Source Code (`/mobile-app/lib`)
```
lib/
├── 📄 main.dart                   # Flutter application entry point
├── 📁 l10n/                      # Internationalization files
├── 📁 screens/                    # UI screens and pages
│   ├── 📄 splash_screen.dart      # App startup screen
│   ├── 📄 login_screen.dart       # User authentication screen
│   ├── 📄 home_screen.dart        # Main dashboard with navigation
│   ├── 📄 maps_screen.dart        # Interactive maps with safety zones
│   ├── 📄 profile_screen.dart     # User profile management
│   ├── 📄 alerts_screen.dart      # Safety alerts and notifications
│   ├── 📄 contacts_screen.dart    # Emergency contacts management
│   ├── 📄 safety_tips_screen.dart # Safety guidelines and tips
│   ├── 📄 report_incident_screen.dart # Incident reporting interface
│   ├── 📄 sos_confirmation_screen.dart # Emergency SOS confirmation
│   └── 📄 kyc_prompt_screen.dart  # KYC verification interface
├── 📁 services/                   # Backend integration services
│   └── 📄 api_service.dart        # HTTP API communication service
└── 📁 theme/                      # App theming and styling
    └── 📄 theme_notifier.dart     # Theme management provider
```

### Platform-Specific Code
```
mobile-app/
├── 📁 android/                    # Android-specific configurations
│   ├── 📄 build.gradle.kts        # Android build configuration
│   ├── 📄 gradle.properties       # Gradle build properties
│   ├── 📄 gradlew                 # Gradle wrapper script
│   ├── 📄 local.properties        # Local development settings
│   ├── 📄 settings.gradle.kts     # Gradle settings
│   ├── 📁 app/                    # Android app module
│   └── 📁 gradle/                 # Gradle wrapper files
├── 📁 ios/                        # iOS-specific configurations
│   ├── 📁 Flutter/                # Flutter iOS integration
│   ├── 📁 Runner/                 # iOS app target
│   ├── 📁 Runner.xcodeproj/       # Xcode project files
│   ├── 📁 Runner.xcworkspace/     # Xcode workspace
│   └── 📁 RunnerTests/            # iOS unit tests
├── 📁 linux/                      # Linux desktop support
│   ├── 📄 CMakeLists.txt          # CMake build configuration
│   ├── 📁 flutter/                # Flutter Linux integration
│   └── 📁 runner/                 # Linux app executable
│       ├── 📄 main.cc             # C++ application entry point
│       └── 📄 my_application.cc   # Application lifecycle management
├── 📁 macos/                      # macOS desktop support
├── 📁 web/                        # Web platform support
│   ├── 📄 index.html              # Web app HTML template
│   ├── 📄 manifest.json           # Progressive Web App manifest
│   ├── 📄 favicon.png             # Web app favicon
│   └── 📁 icons/                  # Web app icons
└── 📁 windows/                    # Windows desktop support
```

### Assets and Resources
```
assets/
├── 🖼️ Logo.png                   # Application logo
├── 🖼️ 2.png                      # Additional image assets
└── 🖼️ logo.svg                   # Vector logo format
```

### Testing
```
test/
└── 📄 widget_test.dart            # Flutter widget unit tests
```

---

## 🔧 Key File Purposes

### Backend Core Files

**`/backend/src/index.js`**
- Main server entry point with Express.js setup
- Database connection with retry logic and connection pooling
- Middleware configuration for CORS, body parsing, and security
- Route registration and error handling
- Graceful shutdown mechanisms
- Performance optimizations and logging

**`/backend/src/middleware/auth.js`**
- JWT token authentication and validation
- Role-based authorization system
- User caching for performance optimization
- Security middleware for protected routes

**`/backend/src/routes/aiRoutes.js`**
- AI-powered risk analysis endpoints
- Emergency alert processing with AI enhancement
- Sentiment analysis for tourist feedback
- Location-based threat assessment
- Batch processing for multiple tourists

### Dashboard Core Files

**`/dashboard/src/App.jsx`**
- Main React application component
- Route configuration with authentication guards
- Context providers for global state management
- Error boundary implementation

**`/dashboard/src/components/Sidebar.jsx`**
- Navigation sidebar with role-based menu items
- User authentication status display
- Real-time alert and incident counters
- Responsive design for mobile devices

**`/dashboard/src/services/apiService.js`**
- Centralized API communication service
- HTTP request/response handling
- Authentication token management
- Error handling and retry logic

### Mobile App Core Files

**`/mobile-app/lib/main.dart`**
- Flutter application initialization
- Theme configuration and provider setup
- Platform-specific optimizations
- Authentication wrapper component

**`/mobile-app/lib/screens/home_screen.dart`**
- Main navigation hub for the mobile app
- Bottom navigation with multiple tabs
- Real-time location tracking integration
- Emergency SOS button access

**`/mobile-app/lib/services/api_service.dart`**
- HTTP client for backend communication
- API endpoint definitions and request methods
- Authentication token handling
- Error handling and network status management

---

## 🗄️ Database Schema Overview

### Collections and Models

**Users (Admin/Staff)**
- Authentication and authorization data
- Role-based permissions (super_admin, admin, moderator, viewer)
- Profile information and activity logs

**Tourists**
- Registration and profile information
- KYC verification status and documents
- Emergency contact information
- Trip itinerary and duration details

**Locations**
- Real-time location tracking data
- Geospatial indexing for efficient queries
- Location history and movement patterns

**Alerts**
- Emergency alerts and SOS requests
- Alert status tracking and response management
- Severity levels and automated escalation

**High Risk Zones**
- Geofenced dangerous or restricted areas
- Risk level assessments and historical data
- Dynamic zone updates based on real-time conditions

**Incidents**
- User-reported safety incidents
- Incident categorization and severity assessment
- Investigation status and resolution tracking

---

## 🚀 Performance Optimizations

### Backend Optimizations
- **Connection Pooling**: MongoDB connection pooling for better resource management
- **User Caching**: In-memory caching of frequently accessed user data
- **Query Optimization**: Lean queries and proper indexing strategies
- **Graceful Shutdown**: Proper cleanup of resources and connections
- **Error Handling**: Structured error logging and monitoring

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for reduced bundle sizes
- **Lazy Loading**: On-demand loading of components and routes
- **Memoization**: React.memo and useMemo for preventing unnecessary re-renders
- **Optimized Images**: Compressed and properly sized image assets

### Mobile App Optimizations
- **Platform Channels**: Native platform integration for better performance
- **State Management**: Efficient state management with Provider pattern
- **Network Optimization**: Caching and offline capability implementation
- **Battery Optimization**: Location tracking with power-efficient intervals

---

## 🔒 Security Implementations

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC) system
- Password hashing with bcrypt
- Session management and timeout handling

### Data Protection
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with content security policies
- Rate limiting to prevent abuse

### API Security
- CORS configuration for cross-origin requests
- Request size limiting to prevent DoS attacks
- Secure headers implementation
- API versioning for backward compatibility

---

This project structure document provides a comprehensive guide to understanding the Smart Tourist Safety System codebase. Each component is designed with scalability, maintainability, and performance in mind, following industry best practices and modern development patterns.
