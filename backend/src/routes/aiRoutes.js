const express = require('express');
const router = express.Router();
const riskAnalyzer = require('../services/riskAnalyzer');
const alertService = require('../services/alertService');
const Location = require('../models/Location');
const Tourist = require('../models/tourist');

/**
 * POST /api/ai/analyze
 * Analyze risk for a tourist at current location
 */
router.post('/analyze', async (req, res) => {
  try {
    const { userId, location, message } = req.body;

    // Validate required fields
    if (!userId || !location || !location.lat || !location.lng) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, location.lat, location.lng'
      });
    }

    // Verify tourist exists
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({
        success: false,
        message: 'Tourist not found'
      });
    }

    // Save current location
    const locationDoc = new Location({
      userId,
      coordinates: {
        lat: location.lat,
        lng: location.lng
      },
      address: location.address,
      accuracy: location.accuracy,
      speed: location.speed,
      batteryLevel: location.batteryLevel,
      timestamp: new Date()
    });
    await locationDoc.save();

    // Perform risk analysis
    const riskAnalysis = await riskAnalyzer.analyzeRisk(userId, location);
    
    let alertResponse = null;

    // If risk is high, send smart alert
    if (riskAnalysis.isHighRisk) {
      const alertData = {
        userId,
        location,
        type: 'HighRisk',
        message: message || `High risk detected - Score: ${(riskAnalysis.score * 100).toFixed(1)}%`,
        riskScore: riskAnalysis.score,
        anomalies: riskAnalysis.anomalies
      };

      alertResponse = await alertService.sendSmartAlert(alertData);
    }

    // Analyze sentiment if message provided
    let sentimentAnalysis = null;
    if (message) {
      sentimentAnalysis = await riskAnalyzer.analyzeTextSentiment(message);
    }

    res.json({
      success: true,
      data: {
        riskAnalysis,
        alertTriggered: riskAnalysis.isHighRisk,
        alert: alertResponse,
        sentimentAnalysis,
        locationSaved: true
      }
    });

  } catch (error) {
    console.error('Error in risk analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Risk analysis failed',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/emergency-alert
 * Manually trigger emergency alert
 */
router.post('/emergency-alert', async (req, res) => {
  try {
    const { userId, location, type, message, severity } = req.body;

    if (!userId || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, location'
      });
    }

    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({
        success: false,
        message: 'Tourist not found'
      });
    }

    const alertData = {
      userId,
      location,
      type: type || 'Panic',
      message: message || 'Emergency alert triggered manually',
      riskScore: severity === 'critical' ? 1.0 : severity === 'high' ? 0.8 : 0.6,
      anomalies: [{
        type: 'manual_trigger',
        description: 'Emergency alert triggered by user',
        severity: 10
      }]
    };

    const alertResponse = await alertService.sendSmartAlert(alertData);

    res.json({
      success: true,
      message: 'Emergency alert sent successfully',
      data: alertResponse
    });

  } catch (error) {
    console.error('Error sending emergency alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emergency alert',
      error: error.message
    });
  }
});

/**
 * GET /api/ai/location-history/:userId
 * Get location history for a tourist
 */
router.get('/location-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { hours = 24, limit = 100 } = req.query;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const locations = await Location.find({
      userId,
      timestamp: { $gte: since }
    }).sort({ timestamp: -1 }).limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        locations,
        count: locations.length,
        timeRange: `${hours} hours`,
      }
    });

  } catch (error) {
    console.error('Error fetching location history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location history',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/batch-analyze
 * Analyze risk for multiple tourists (for dashboard)
 */
router.post('/batch-analyze', async (req, res) => {
  try {
    const { tourists } = req.body; // Array of { userId, location }

    if (!Array.isArray(tourists) || tourists.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tourists array'
      });
    }

    const results = [];

    for (const tourist of tourists) {
      try {
        const riskAnalysis = await riskAnalyzer.analyzeRisk(tourist.userId, tourist.location);
        results.push({
          userId: tourist.userId,
          riskAnalysis,
          success: true
        });
      } catch (error) {
        results.push({
          userId: tourist.userId,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: {
        results,
        processed: results.length,
        highRiskCount: results.filter(r => r.success && r.riskAnalysis?.isHighRisk).length
      }
    });

  } catch (error) {
    console.error('Error in batch analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Batch analysis failed',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/sentiment-analysis
 * Analyze sentiment of text (for panic messages, reports, etc.)
 */
router.post('/sentiment-analysis', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for sentiment analysis'
      });
    }

    const sentimentResult = await riskAnalyzer.analyzeTextSentiment(text);

    res.json({
      success: true,
      data: {
        sentiment: sentimentResult,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        analyzedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Sentiment analysis failed',
      error: error.message
    });
  }
});

/**
 * GET /api/ai/risk-zones
 * Get risk analysis for geographical zones
 */
router.get('/risk-zones', async (req, res) => {
  try {
    const { bounds } = req.query; // Format: "lat1,lng1,lat2,lng2"
    
    if (!bounds) {
      return res.status(400).json({
        success: false,
        message: 'Bounds parameter required (lat1,lng1,lat2,lng2)'
      });
    }

    const [lat1, lng1, lat2, lng2] = bounds.split(',').map(Number);
    
    // Simple grid-based risk analysis
    const gridSize = 0.01; // ~1km grid
    const riskZones = [];

    for (let lat = lat1; lat <= lat2; lat += gridSize) {
      for (let lng = lng1; lng <= lng2; lng += gridSize) {
        try {
          const centerPoint = { lat, lng };
          const riskData = await riskAnalyzer.analyzeNearbyRisks(centerPoint);
          
          if (riskData.score > 0.3) { // Only include zones with significant risk
            riskZones.push({
              center: centerPoint,
              bounds: {
                north: lat + gridSize/2,
                south: lat - gridSize/2,
                east: lng + gridSize/2,
                west: lng - gridSize/2
              },
              riskScore: riskData.score,
              crimeCount: riskData.nearbyCrimes,
              highRiskZones: riskData.nearbyHighRiskZones
            });
          }
        } catch (error) {
          // Skip this zone if analysis fails
          continue;
        }
      }
    }

    res.json({
      success: true,
      data: {
        riskZones,
        gridSize,
        analyzedArea: { bounds: [lat1, lng1, lat2, lng2] },
        totalZones: riskZones.length
      }
    });

  } catch (error) {
    console.error('Error analyzing risk zones:', error);
    res.status(500).json({
      success: false,
      message: 'Risk zone analysis failed',
      error: error.message
    });
  }
});

module.exports = router;
