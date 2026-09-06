const express = require('express');
const router = express.Router();
const { generateCertificate, verifyCertificate } = require('../controllers/certificateController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/generate', protect, authorize('faculty', 'admin'), generateCertificate);
router.get('/verify/:certIdOrHash', verifyCertificate);

module.exports = router;
