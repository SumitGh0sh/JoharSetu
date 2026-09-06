const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const { optionalAuth } = require('../middlewares/authMiddleware');

// POST /api/upload/image
router.post('/image', optionalAuth, uploadImage);

module.exports = router;
