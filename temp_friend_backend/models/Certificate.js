const mongoose = require('mongoose');
const crypto = require('crypto');

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      unique: true,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    universityName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: '',
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
    },
    challengeTitle: {
      type: String,
      required: true,
    },
    nepCreditsAwarded: {
      type: Number,
      default: 4, // NEP 2020 Experiential Learning Credits (2 to 4 credits)
    },
    courseCategory: {
      type: String,
      default: 'NEP 2020 Experiential & Community Learning',
    },
    verificationHash: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    verifiedByFaculty: {
      type: String,
      default: 'Department Head & Faculty Mentor',
    },
    verifiedByGovt: {
      type: String,
      default: 'Department of Higher & Technical Education, Govt. of Jharkhand',
    },
  },
  {
    timestamps: true,
  }
);

// Generate hash before saving
certificateSchema.pre('validate', function (next) {
  if (!this.certificateNumber) {
    this.certificateNumber = `JH-NEP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  if (!this.verificationHash) {
    const rawString = `${this.certificateNumber}-${this.studentId}-${this.challengeId}-${this.nepCreditsAwarded}`;
    this.verificationHash = crypto.createHash('sha256').update(rawString).digest('hex');
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
