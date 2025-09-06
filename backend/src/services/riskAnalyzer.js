const { HfInference } = require('@huggingface/inference');
const Location = require('../models/Location');
const CrimeData = require('../models/CrimeData');
const HighRiskZone = require('../models/HighRiskZone');

class RiskAnalyzer {
  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    this.riskThreshold = parseFloat(process.env.RISK_THRESHOLD) || 0.7;
    this.anomalyRadius = parseInt(process.env.ANOMALY_DETECTION_RADIUS) || 1000;
  }

  /**
   * Main risk analysis function
   * @param {string} userId - Tourist ID
   * @param {object} currentLocation - { lat, lng }
   * @returns {object} { score, anomalies, riskFactors }
   */
  async analyzeRisk(userId, currentLocation) {
    try {
      const [
        locationHistory,
        nearbyRisks,
        timeBasedRisk,
        movementAnomalies
      ] = await Promise.all([
        this.getUserLocationHistory(userId),
        this.analyzeNearbyRisks(currentLocation),
        this.calculateTimeBasedRisk(),
        this.detectMovementAnomalies(userId, currentLocation)
      ]);

      const riskFactors = {
        locationRisk: nearbyRisks.score,
        timeRisk: timeBasedRisk,
        movementRisk: movementAnomalies.score,
        historicalRisk: this.calculateHistoricalRisk(locationHistory),
      };

      // Calculate weighted risk score
      const score = this.calculateWeightedRiskScore(riskFactors);

      const anomalies = [
        ...movementAnomalies.anomalies,
        ...nearbyRisks.anomalies
      ];

      return {
        score,
        anomalies,
        riskFactors,
        recommendations: this.generateRecommendations(score, anomalies),
        isHighRisk: score > this.riskThreshold
      };

    } catch (error) {
      console.error('Error in risk analysis:', error);
      throw new Error('Risk analysis failed');
    }
  }

  /**
   * Get user's location history for analysis
   */
  async getUserLocationHistory(userId, hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await Location.find({
      userId,
      timestamp: { $gte: since }
    }).sort({ timestamp: -1 }).limit(100);
  }

  /**
   * Analyze nearby risks (crime data, high-risk zones)
   */
  async analyzeNearbyRisks(currentLocation) {
    const { lat, lng } = currentLocation;
    const radiusInMeters = this.anomalyRadius;

    console.log(`Analyzing risks near ${lat}, ${lng} within ${radiusInMeters}m`);

    // Find nearby crime data using GeoJSON format
    const nearbyCrimes = await CrimeData.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat] // [longitude, latitude]
          },
          $maxDistance: radiusInMeters
        }
      },
      timestamp: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    });

    console.log(`Found ${nearbyCrimes.length} nearby crimes`);

    // Find nearby high-risk zones (keeping existing format)
    const nearbyHighRiskZones = await HighRiskZone.find({
      coordinates: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInMeters / 6371000] // Convert to radians
        }
      },
      isActive: true
    });

    console.log(`Found ${nearbyHighRiskZones.length} nearby high-risk zones`);

    let score = 0;
    const anomalies = [];

    // Calculate crime-based risk
    if (nearbyCrimes.length > 0) {
      const crimeScore = Math.min(nearbyCrimes.length * 0.15, 0.8);
      score += crimeScore;
      
      const recentCrimes = nearbyCrimes.filter(crime => 
        new Date(crime.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      if (recentCrimes.length > 0) {
        anomalies.push({
          type: 'high_crime_area',
          description: `${recentCrimes.length} recent crimes reported in this area`,
          severity: Math.min(recentCrimes.length * 2, 10)
        });
      }

      // Add specific crime type warnings
      const crimeTypes = [...new Set(nearbyCrimes.map(c => c.crimeType))];
      if (crimeTypes.length > 0) {
        anomalies.push({
          type: 'crime_pattern',
          description: `Common crimes in area: ${crimeTypes.join(', ')}`,
          severity: 5
        });
      }
    }

    // Calculate high-risk zone score
    if (nearbyHighRiskZones.length > 0) {
      const zoneRisk = nearbyHighRiskZones.reduce((max, zone) => 
        Math.max(max, zone.riskLevel / 10), 0
      );
      score += zoneRisk * 0.6;
      
      anomalies.push({
        type: 'high_risk_zone',
        description: `Entering high-risk zone: ${nearbyHighRiskZones[0].name}`,
        severity: nearbyHighRiskZones[0].riskLevel
      });
    }

    return {
      score: Math.min(score, 1),
      anomalies,
      nearbyCrimes: nearbyCrimes.length,
      nearbyHighRiskZones: nearbyHighRiskZones.length,
      crimeDetails: nearbyCrimes.map(c => ({
        type: c.crimeType,
        severity: c.severity,
        area: c.area,
        distance: this.calculateDistance(currentLocation, {
          lat: c.coordinates.coordinates[1],
          lng: c.coordinates.coordinates[0]
        })
      }))
    };
  }

  /**
   * Calculate time-based risk (night time, rush hours, etc.)
   */
  calculateTimeBasedRisk() {
    const now = new Date();
    const hour = now.getHours();
    
    // Higher risk during night hours (10 PM - 6 AM)
    if (hour >= 22 || hour <= 6) {
      return 0.4;
    }
    
    // Medium risk during early morning and late evening
    if (hour <= 8 || hour >= 20) {
      return 0.2;
    }
    
    // Lower risk during day time
    return 0.1;
  }

  /**
   * Detect movement anomalies
   */
  async detectMovementAnomalies(userId, currentLocation) {
    const recentLocations = await this.getUserLocationHistory(userId, 2); // Last 2 hours
    
    if (recentLocations.length < 2) {
      return { score: 0, anomalies: [] };
    }

    const anomalies = [];
    let score = 0;

    // Check for sudden location jumps
    const lastLocation = recentLocations[0];
    if (lastLocation) {
      const distance = this.calculateDistance(
        currentLocation,
        { lat: lastLocation.coordinates.lat, lng: lastLocation.coordinates.lng }
      );
      
      const timeDiff = (Date.now() - new Date(lastLocation.timestamp)) / (1000 * 60); // minutes
      const speed = distance / (timeDiff / 60); // km/h
      
      // Flag unusually high speeds (>200 km/h suggests GPS error or emergency)
      if (speed > 200) {
        anomalies.push({
          type: 'location_jump',
          description: `Unusual location change: ${speed.toFixed(1)} km/h`,
          severity: 8
        });
        score += 0.6;
      }
    }

    // Check for staying in same location for too long (potential distress)
    const stationaryTime = this.calculateStationaryTime(recentLocations);
    if (stationaryTime > 180) { // 3 hours in same location
      anomalies.push({
        type: 'prolonged_stationary',
        description: `No movement detected for ${Math.round(stationaryTime/60)} hours`,
        severity: 6
      });
      score += 0.3;
    }

    return { score: Math.min(score, 1), anomalies };
  }

  /**
   * Calculate historical risk based on past locations
   */
  calculateHistoricalRisk(locationHistory) {
    if (locationHistory.length === 0) return 0;
    
    // Check if user frequently visits high-risk areas
    const riskPatternScore = locationHistory.filter(loc => 
      loc.isEmergency || loc.batteryLevel < 20
    ).length / locationHistory.length;
    
    return Math.min(riskPatternScore * 0.5, 0.3);
  }

  /**
   * Calculate weighted risk score from multiple factors
   */
  calculateWeightedRiskScore(factors) {
    const weights = {
      locationRisk: 0.4,
      timeRisk: 0.2,
      movementRisk: 0.3,
      historicalRisk: 0.1
    };

    return Object.keys(weights).reduce((total, factor) => {
      return total + (factors[factor] * weights[factor]);
    }, 0);
  }

  /**
   * Generate safety recommendations based on risk analysis
   */
  generateRecommendations(score, anomalies) {
    const recommendations = [];

    if (score > 0.8) {
      recommendations.push('IMMEDIATE ACTION: Move to a safer location immediately');
      recommendations.push('Contact emergency services if needed');
    } else if (score > 0.6) {
      recommendations.push('HIGH ALERT: Consider moving to a well-lit, populated area');
      recommendations.push('Stay alert and avoid isolated areas');
    } else if (score > 0.4) {
      recommendations.push('CAUTION: Be aware of your surroundings');
      recommendations.push('Keep emergency contacts ready');
    }

    // Specific recommendations based on anomalies
    anomalies.forEach(anomaly => {
      switch (anomaly.type) {
        case 'high_crime_area':
          recommendations.push('Avoid carrying valuables openly');
          break;
        case 'high_risk_zone':
          recommendations.push('Consider alternative routes');
          break;
        case 'location_jump':
          recommendations.push('Verify your location and check device connectivity');
          break;
      }
    });

    return recommendations;
  }

  /**
   * Use NLP to analyze text input (for panic messages, reports, etc.)
   */
  async analyzeTextSentiment(text) {
    try {
      if (!text || text.trim().length === 0) {
        return { label: 'NEUTRAL', score: 0 };
      }

      if (!process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY === 'your-huggingface-api-key') {
        console.log('Hugging Face API key not configured, using fallback sentiment analysis');
        return this.fallbackSentimentAnalysis(text);
      }

      const result = await this.hf.textClassification({
        model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
        inputs: text
      });

      return result[0] || { label: 'NEUTRAL', score: 0 };
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      // Use fallback analysis if API fails
      return this.fallbackSentimentAnalysis(text);
    }
  }

  /**
   * Fallback sentiment analysis using keyword matching
   */
  fallbackSentimentAnalysis(text) {
    const textLower = text.toLowerCase();
    
    const negativeWords = ['help', 'scared', 'unsafe', 'danger', 'emergency', 'panic', 'afraid', 'threat', 'attack', 'robbery', 'lost', 'trapped'];
    const positiveWords = ['fine', 'good', 'great', 'safe', 'okay', 'wonderful', 'amazing', 'beautiful', 'enjoy', 'love'];
    
    let negativeScore = 0;
    let positiveScore = 0;
    
    negativeWords.forEach(word => {
      if (textLower.includes(word)) negativeScore++;
    });
    
    positiveWords.forEach(word => {
      if (textLower.includes(word)) positiveScore++;
    });
    
    if (negativeScore > positiveScore) {
      return { label: 'NEGATIVE', score: Math.min(negativeScore * 0.3, 0.9) };
    } else if (positiveScore > negativeScore) {
      return { label: 'POSITIVE', score: Math.min(positiveScore * 0.3, 0.9) };
    } else {
      return { label: 'NEUTRAL', score: 0.1 };
    }
  }

  /**
   * Utility function to calculate distance between two coordinates
   */
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLon = this.toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Calculate how long user has been stationary
   */
  calculateStationaryTime(locations) {
    if (locations.length < 2) return 0;
    
    const stationaryRadius = 50; // 50 meters
    let stationaryStart = null;
    
    for (let i = 0; i < locations.length - 1; i++) {
      const distance = this.calculateDistance(
        { lat: locations[i].coordinates.lat, lng: locations[i].coordinates.lng },
        { lat: locations[i+1].coordinates.lat, lng: locations[i+1].coordinates.lng }
      ) * 1000; // Convert to meters
      
      if (distance <= stationaryRadius) {
        if (!stationaryStart) {
          stationaryStart = new Date(locations[i].timestamp);
        }
      } else {
        stationaryStart = null;
      }
    }
    
    if (stationaryStart) {
      return (Date.now() - stationaryStart.getTime()) / (1000 * 60); // minutes
    }
    
    return 0;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

module.exports = new RiskAnalyzer();
