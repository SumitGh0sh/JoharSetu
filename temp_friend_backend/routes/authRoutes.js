const express = require('express');
const router = express.Router();
const { signup, signin, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/login', signin);
router.post('/logout', protect, logout);

module.exports = router;
