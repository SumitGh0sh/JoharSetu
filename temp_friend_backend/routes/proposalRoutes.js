const express = require('express');
const router = express.Router();
const {
  createProposal,
  getProposals,
  updateMilestone,
  disburseCsrMilestoneGrant,
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', getProposals);
router.post('/', protect, authorize('student', 'faculty', 'admin'), createProposal);
router.put('/:id/milestones', protect, authorize('student', 'faculty', 'admin', 'industry'), updateMilestone);
router.post('/:id/disburse-grant', protect, authorize('industry', 'admin'), disburseCsrMilestoneGrant);

module.exports = router;

