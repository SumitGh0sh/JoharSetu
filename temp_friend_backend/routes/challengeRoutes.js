const express = require('express');
const router = express.Router();
const {
  createChallenge,
  getChallenges,
  getChallengeById,
  upvoteChallenge,
  verifyImage,
} = require('../controllers/challengeController');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');
const { validateMediaUrls } = require('../middlewares/uploadMiddleware');

router.get('/', getChallenges);
router.post('/verify-image', verifyImage);
router.post('/', optionalAuth, validateMediaUrls, createChallenge);
router.get('/:id', getChallengeById);
router.post('/:id/upvote', optionalAuth, upvoteChallenge);

module.exports = router;
