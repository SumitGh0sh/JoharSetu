const Certificate = require('../models/Certificate');
const Proposal = require('../models/Proposal');
const Challenge = require('../models/Challenge');

/**
 * Generate NEP 2020 Academic Credit Certificate for a completed proposal
 */
const generateCertificate = async (req, res, next) => {
  try {
    const { proposalId, nepCredits = 4 } = req.body;

    if (!proposalId) {
      return res.status(400).json({ error: 'proposalId is required' });
    }

    const proposal = await Proposal.findById(proposalId)
      .populate('teamLead', 'name email organization department')
      .populate('challengeId', 'title location');

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ proposalId });
    if (existingCert) {
      return res.status(200).json({
        success: true,
        message: 'Certificate already issued',
        certificate: existingCert,
      });
    }

    const certificate = await Certificate.create({
      studentId: proposal.teamLead ? proposal.teamLead._id : req.user._id,
      studentName: proposal.teamLead ? proposal.teamLead.name : 'Student Innovator',
      universityName: proposal.universityName || 'Ranchi University',
      department: proposal.department || 'Engineering',
      challengeId: proposal.challengeId._id,
      proposalId: proposal._id,
      challengeTitle: proposal.challengeId.title,
      nepCreditsAwarded: nepCredits,
      courseCategory: 'NEP 2020 Experiential Learning & Societal Problem Solving',
    });

    return res.status(201).json({
      success: true,
      message: 'NEP 2020 Academic Credit Certificate issued successfully',
      certificate,
      verificationUrl: `/api/certificates/verify/${certificate.certificateNumber}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public QR / Hash Certificate Verification Endpoint
 */
const verifyCertificate = async (req, res, next) => {
  try {
    const { certIdOrHash } = req.params;

    const certificate = await Certificate.findOne({
      $or: [{ certificateNumber: certIdOrHash }, { verificationHash: certIdOrHash }],
    })
      .populate('studentId', 'name email organization')
      .populate('challengeId', 'title category location');

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        error: 'Certificate not found or invalid QR/Hash.',
      });
    }

    return res.status(200).json({
      valid: true,
      message: '✅ Certificate authenticity verified via tamper-proof hash',
      certificate: {
        certificateNumber: certificate.certificateNumber,
        studentName: certificate.studentName,
        universityName: certificate.universityName,
        department: certificate.department,
        challengeTitle: certificate.challengeTitle,
        nepCreditsAwarded: certificate.nepCreditsAwarded,
        courseCategory: certificate.courseCategory,
        verificationHash: certificate.verificationHash,
        issueDate: certificate.issueDate,
        verifiedByGovt: certificate.verifiedByGovt,
        verifiedByFaculty: certificate.verifiedByFaculty,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateCertificate,
  verifyCertificate,
};
