const express = require('express');
const router = express.Router();
const { transcribeAndFileComplaint } = require('../controllers/voiceController');
const { optionalAuth } = require('../middlewares/authMiddleware');

router.post('/transcribe-and-file', optionalAuth, transcribeAndFileComplaint);

module.exports = router;
