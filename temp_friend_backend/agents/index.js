/**
 * Central Export for all LangGraph Multi-Agent Workflows
 */

const { challengePipeline, processChallengeAI } = require('./pipeline/challengePipeline');
const { sahayakChatbot, talkToSahayak } = require('./chatbot/sahayakChatbot');

module.exports = {
  // Challenge Ingestion, Translation, Deduplication & Routing Agent
  challengePipeline,
  processChallengeAI,

  // Sahayak AI Multilingual Conversational Chatbot Agent
  sahayakChatbot,
  talkToSahayak,
};
