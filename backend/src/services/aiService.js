const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBXg73KaiV_Dgr33WSGhCvnG7C1sceWbgc");

async function getChatbotResponse(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

module.exports = { getChatbotResponse };