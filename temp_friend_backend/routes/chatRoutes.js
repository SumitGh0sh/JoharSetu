const express = require('express');
const router = express.Router();
const { handleChatMessage, getChatHistory, resetChatSession } = require('../controllers/chatController');
const { optionalAuth } = require('../middlewares/authMiddleware');

router.post('/message', optionalAuth, handleChatMessage);
router.get('/history/:sessionId', getChatHistory);
router.delete('/session/:sessionId', resetChatSession);

module.exports = router;
