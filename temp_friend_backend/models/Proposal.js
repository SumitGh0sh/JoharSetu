const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  targetWeeks: { type: Number, default: 4 },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'verified'],
    default: 'pending',
  },
  proofUrl: { type: String, default: '' },
  verifiedAt: { type: Date, default: null },
});

const proposalSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    abstract: {
      type: String,
      required: true,
    },
    methodology: {
      type: String,
      required: true,
    },
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    universityName: {
      type: String,
      required: true,
      default: 'Ranchi University',
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
    },
    facultyMentor: {
      type: String,
      default: '',
    },
    teamMembers: {
      type: [String],
      default: [],
    },
    estimatedBudget: {
      type: Number,
      default: 0,
    },
    timelineWeeks: {
      type: Number,
      default: 12,
    },
    milestones: {
      type: [milestoneSchema],
      default: [
        { title: 'Requirement Analysis & Ground Verification', targetWeeks: 2, status: 'pending' },
        { title: 'Prototype Development & Lab Testing', targetWeeks: 6, status: 'pending' },
        { title: 'Pilot Field Deployment & Feedback', targetWeeks: 10, status: 'pending' },
        { title: 'Final Handover & Impact Report', targetWeeks: 12, status: 'pending' },
      ],
    },
    industryMentor: {
      type: String,
      default: '',
    },
    industryGrantAmount: {
      type: Number,
      default: 0,
    },
    csrEscrow: {
      sponsorName: { type: String, default: '' },
      totalCommitted: { type: Number, default: 0 },
      disbursedAmount: { type: Number, default: 0 },
      escrowStatus: {
        type: String,
        enum: ['None', 'Pledged', 'In Escrow', 'Fully Disbursed'],
        default: 'None',
      },
      disbursementHistory: [
        {
          milestoneIndex: Number,
          amount: Number,
          releasedAt: { type: Date, default: Date.now },
          transactionRef: String,
          note: String,
        },
      ],
    },

    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Approved', 'In-Progress', 'Completed', 'Rejected'],
      default: 'Submitted',
    },
    githubRepo: {
      type: String,
      default: '',
    },
    demoUrl: {
      type: String,
      default: '',
    },
    aiFeasibilityScore: {
      type: Number,
      default: 75, // 1-100
    },
    aiReviewFeedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Proposal', proposalSchema);
