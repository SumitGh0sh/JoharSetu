const { talkToSahayak } = require('../agents');
const { redisClient } = require('../config/redis');
const Challenge = require('../models/Challenge');

/**
 * Helper to get session chat history from Redis
 */
const getSessionHistory = async (sessionId) => {
  if (!redisClient || !redisClient.isOpen) return [];
  try {
    const raw = await redisClient.get(`chat_sess_${sessionId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

/**
 * Helper to save session chat history to Redis (1-hour TTL)
 */
const saveSessionHistory = async (sessionId, history) => {
  if (!redisClient || !redisClient.isOpen) return;
  try {
    // Keep max 10 recent messages
    const trimmed = history.slice(-10);
    await redisClient.set(`chat_sess_${sessionId}`, JSON.stringify(trimmed), { EX: 3600 });
  } catch (err) {
    console.warn('Could not save chat history to Redis:', err.message);
  }
};

/**
 * Handle incoming message to Sahayak AI Chatbot
 */
const handleChatMessage = async (req, res, next) => {
  try {
    const { message, sessionId = 'default_session', district = 'Ranchi', language = 'hinglish' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // 1. Fetch conversation history from Redis
    const history = await getSessionHistory(sessionId);

    // 2. Invoke LangGraph Sahayak Chatbot
    const botResult = await talkToSahayak(message, history, district, language);

    // 3. Update history in Redis
    const updatedHistory = [
      ...history,
      { role: 'user', content: message },
      { role: 'assistant', content: botResult.botReply },
    ];
    await saveSessionHistory(sessionId, updatedHistory);

    // 4. If chatbot extracted a complete complaint, auto-create a draft Challenge ticket
    let autoCreatedChallenge = null;
    if (botResult.complaintData && botResult.complaintData.isComplaintReady) {
      try {
        const { extractedTitle, extractedDescription, extractedDistrict } = botResult.complaintData;
        autoCreatedChallenge = await Challenge.create({
          title: extractedTitle || message.slice(0, 50),
          description: extractedDescription || message,
          location: {
            state: 'Jharkhand',
            district: extractedDistrict || district || 'Ranchi',
          },
          submittedBy: req.user ? req.user._id : null,
          status: 'Reported',
        });
      } catch (createErr) {
        console.warn('Auto-ticket creation note:', createErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      sessionId,
      reply: botResult.botReply,
      intent: botResult.intent,
      autoCreatedChallenge: autoCreatedChallenge ? {
        id: autoCreatedChallenge._id,
        title: autoCreatedChallenge.title,
        status: autoCreatedChallenge.status,
      } : null,
      steps: botResult.steps,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Session Chat History
 */
const getChatHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const history = await getSessionHistory(sessionId);
    return res.status(200).json({ success: true, sessionId, history });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear/Reset Session Chat History
 */
const resetChatSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    if (redisClient && redisClient.isOpen) {
      await redisClient.del(`chat_sess_${sessionId}`);
    }
    return res.status(200).json({ success: true, message: 'Chat session reset successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleChatMessage,
  getChatHistory,
  resetChatSession,
};
