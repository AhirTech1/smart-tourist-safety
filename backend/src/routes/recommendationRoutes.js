const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../services/recommendationService');

router.post('/recommendations', (req, res) => {
  const userPreferences = req.body;
  const recommendations = getRecommendations(userPreferences);
  res.json(recommendations);
});

module.exports = router;