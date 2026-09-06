const Proposal = require('../models/Proposal');
const Challenge = require('../models/Challenge');
const { generateAIResponse } = require('../config/ai');

/**
 * Submit a solution proposal for a societal challenge
 */
const createProposal = async (req, res, next) => {
  try {
    const {
      challengeId,
      title,
      abstract,
      methodology,
      universityName,
      department,
      facultyMentor,
      teamMembers,
      estimatedBudget,
      timelineWeeks,
      githubRepo,
      demoUrl,
    } = req.body;

    if (!challengeId || !title || !abstract || !methodology) {
      return res.status(400).json({ error: 'challengeId, title, abstract, and methodology are required' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // AI Feasibility Evaluation
    let aiFeasibilityScore = 80;
    let aiReviewFeedback = '';
    try {
      const evaluationPrompt = `You are a technical hackathon / research jury evaluator.
Evaluate the following student proposal for the civic problem:
Problem: "${challenge.title}: ${challenge.translatedDescription || challenge.description}"
Solution Proposal: "${title}"
Abstract: "${abstract}"
Methodology: "${methodology}"

Provide:
1. "aiFeasibilityScore": integer (1-100)
2. "aiReviewFeedback": 2-sentence constructive technical evaluation.

Return ONLY a JSON object:
{ "aiFeasibilityScore": 85, "aiReviewFeedback": "..." }`;

      const aiReview = await generateAIResponse([
        { role: 'system', content: 'You evaluate engineering proposals.' },
        { role: 'user', content: evaluationPrompt },
      ], { jsonMode: true });

      const parsed = JSON.parse(aiReview);
      aiFeasibilityScore = parsed.aiFeasibilityScore || 80;
      aiReviewFeedback = parsed.aiReviewFeedback || '';
    } catch (e) {
      aiReviewFeedback = 'Proposal matches challenge domain requirements.';
    }

    const proposal = await Proposal.create({
      challengeId,
      title,
      abstract,
      methodology,
      teamLead: req.user ? req.user._id : null,
      universityName: universityName || (req.user && req.user.organization) || 'Ranchi University',
      department: department || (req.user && req.user.department) || 'Engineering',
      facultyMentor: facultyMentor || '',
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
      estimatedBudget: estimatedBudget || 0,
      timelineWeeks: timelineWeeks || 12,
      githubRepo: githubRepo || '',
      demoUrl: demoUrl || '',
      aiFeasibilityScore,
      aiReviewFeedback,
      status: 'Submitted',
    });

    // Update challenge status to Solution Proposed
    if (challenge.status === 'Reported' || challenge.status === 'Assigned') {
      challenge.status = 'Solution Proposed';
      await challenge.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Solution proposal submitted successfully',
      proposal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List proposals
 */
const getProposals = async (req, res, next) => {
  try {
    const { challengeId, status } = req.query;
    const filter = {};
    if (challengeId) filter.challengeId = challengeId;
    if (status) filter.status = status;

    const proposals = await Proposal.find(filter)
      .populate('challengeId', 'title category severity location')
      .populate('teamLead', 'name email organization')
      .sort({ aiFeasibilityScore: -1, createdAt: -1 });

    return res.status(200).json({ success: true, count: proposals.length, proposals });
  } catch (error) {
    next(error);
  }
};

/**
 * Update project milestone status
 */
const updateMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { milestoneIndex, status, proofUrl } = req.body;

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (milestoneIndex === undefined || !proposal.milestones[milestoneIndex]) {
      return res.status(400).json({ error: 'Invalid milestoneIndex' });
    }

    if (status) proposal.milestones[milestoneIndex].status = status;
    if (proofUrl) proposal.milestones[milestoneIndex].proofUrl = proofUrl;
    if (status === 'completed' || status === 'verified') {
      proposal.milestones[milestoneIndex].verifiedAt = new Date();
    }

    // Check if all milestones are completed
    const allCompleted = proposal.milestones.every((m) => m.status === 'completed' || m.status === 'verified');
    if (allCompleted) {
      proposal.status = 'Completed';
    } else {
      proposal.status = 'In-Progress';
    }

    await proposal.save();
    return res.status(200).json({ success: true, message: 'Milestone updated', proposal });
  } catch (error) {
    next(error);
  }
};

/**
 * Industry CSR Partner Milestone Fund Release
 */
const disburseCsrMilestoneGrant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { milestoneIndex, amount, note, sponsorName } = req.body;

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid grant amount is required' });
    }

    // Update CSR escrow
    if (!proposal.csrEscrow) {
      proposal.csrEscrow = { totalCommitted: amount, disbursedAmount: 0, disbursementHistory: [] };
    }

    proposal.csrEscrow.sponsorName = sponsorName || (req.user && req.user.organization) || 'CSR Partner';
    proposal.csrEscrow.disbursedAmount = (proposal.csrEscrow.disbursedAmount || 0) + Number(amount);
    proposal.csrEscrow.escrowStatus = proposal.csrEscrow.disbursedAmount >= proposal.csrEscrow.totalCommitted ? 'Fully Disbursed' : 'In Escrow';

    const transactionRef = `TXN-CSR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    proposal.csrEscrow.disbursementHistory.push({
      milestoneIndex: milestoneIndex ?? 0,
      amount: Number(amount),
      releasedAt: new Date(),
      transactionRef,
      note: note || `Milestone ${milestoneIndex + 1} Grant Release`,
    });

    await proposal.save();

    return res.status(200).json({
      success: true,
      message: `CSR Grant tranche of ₹${amount} disbursed successfully to student team`,
      transactionRef,
      csrEscrow: proposal.csrEscrow,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProposal,
  getProposals,
  updateMilestone,
  disburseCsrMilestoneGrant,
};

