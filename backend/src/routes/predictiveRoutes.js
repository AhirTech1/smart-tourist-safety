const express = require('express');
const router = express.Router();
const { getPredictedHighRiskZones } = require('../services/predictiveService');

router.post('/predict-zones', async (req, res) => {
  try {
    const { lat, lon } = req.body;
    if (!lat || !lon) {
      return res.status(400).send({ error: 'Latitude and longitude are required.' });
    }
    const zones = await getPredictedHighRiskZones(lat, lon);
    res.send(zones);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;