# Smart Tourist Safety - Backend

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure your MongoDB connection string
   - Add other required environment variables

3. Start the server:
   ```bash
   npm start
   ```

## High-Risk Zones Management

### Seeding Sample Data

To populate the database with sample high-risk zones for testing:

```bash
node seedHighRiskZones.js
```

This will:
- Clear existing high-risk zones
- Insert 5 sample zones with different risk types
- Show confirmation of successful seeding

### API Endpoints

- `GET /api/dashboard/high-risk-zones` - Fetch all high-risk zones
- Data structure includes:
  - `name`: Zone name
  - `location`: { latitude, longitude }
  - `radius`: Coverage radius in meters
  - `riskType`: 'High-Alert', 'Natural-Calamity-Prone', or 'Other'
  - `description`: Detailed description

### Integration with Frontend

The dashboard will automatically fetch and display high-risk zones from the database. If no zones exist, it falls back to sample data for demonstration.

## Features

- Real-time tourist location tracking
- Alert management system  
- High-risk zone visualization
- KYC verification system
- Emergency response coordination
