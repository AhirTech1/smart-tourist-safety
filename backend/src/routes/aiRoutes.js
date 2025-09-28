const express = require('express');
const router = express.Router();
const { getChatbotResponse } = require('../services/aiService');

router.post('/chatbot', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await getChatbotResponse(prompt);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;