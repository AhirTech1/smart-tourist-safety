Smart Tourist Safety Monitoring & Incident Response System

This is a monorepo containing the mobile app (Flutter), web dashboard (React), and backend (Node.js) for a next-generation tourist safety platform.

Key Features:

Digital Tourist ID with secure verification (blockchain-ready).

Mobile App for Tourists with geofencing alerts, panic button, and safety score.

Real-Time Dashboard for police and tourism authorities to monitor tourist clusters, view alerts, and generate automated E-FIRs.

AI-Powered Anomaly Detection to flag missing, silent, or distress situations.

End-to-End Encryption & Privacy Controls ensuring compliance with DPDP Act 2023.


Tech Stack:

Backend: Node.js, Express, MongoDB (or PostgreSQL)

Dashboard: React, Leaflet.js/Mapbox for maps

Mobile App: Flutter with geofencing and SOS APIs

AI Module (planned): Unsupervised anomaly detection

Security: JWT auth, HTTPS, E2E encryption, blockchain-ready ID management

How to Run Locally:

# Backend
cd backend
npm install
npm run dev

# Dashboard
cd ../dashboard
npm install
npm run dev

# Mobile app
cd ../mobile-app
flutter pub get
flutter run

