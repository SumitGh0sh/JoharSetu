const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    translatedDescription: {
      type: String,
      default: '',
    },
    languageDetected: {
      type: String,
      default: 'en',
    },
    category: {
      type: String,
      enum: [
        'Water & Sanitation',
        'Healthcare & Nutrition',
        'Agriculture & Rural Economy',
        'Roads & Infrastructure',
        'Education & Literacy',
        'Clean Energy & Environment',
        'Public Services & Governance',
        'Other',
      ],
      default: 'Other',
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    aiUrgencyScore: {
      type: Number,
      default: 50, // 1 - 100
    },
    location: {
      state: { type: String, default: 'Jharkhand' },
      district: { type: String, required: true, default: 'Ranchi' },
      block: { type: String, default: '' },
      village: { type: String, default: '' },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    mediaUrls: {
      type: [String],
      default: [],
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['Reported', 'Validated', 'Assigned', 'In-Progress', 'Solution Proposed', 'Resolved'],
      default: 'Reported',
    },
    upvotes: {
      type: Number,
      default: 1,
    },
    upvotedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      default: null,
    },
    similarityScore: {
      type: Number,
      default: 0,
    },
    assignedUniversity: {
      type: String,
      default: '',
    },
    assignedDepartment: {
      type: String,
      default: '',
    },
    industrySponsor: {
      type: String,
      default: '',
    },
    aiAnalysis: {
      recommendedDepartment: { type: String, default: '' },
      technicalComplexity: { type: Number, default: 5 }, // 1-10
      keyKeywords: { type: [String], default: [] },
      suggestedSolutionApproach: { type: String, default: '' },
      isImageVerified: { type: Boolean, default: false },
      imageAuthenticityScore: { type: Number, default: 0 },
      visualFindings: { type: String, default: '' },
    },
    isHotspotCluster: {
      type: Boolean,
      default: false,
    },
    vectorId: {
      type: String,
      default: '',
    },

  },
  {
    timestamps: true,
  }
);

// Full-text search index
challengeSchema.index({ title: 'text', description: 'text', 'location.district': 'text' });

module.exports = mongoose.model('Challenge', challengeSchema);
