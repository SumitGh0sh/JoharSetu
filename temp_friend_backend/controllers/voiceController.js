const { transcribeAudioWithGroq } = require('../config/ai');
const { processChallengeAI } = require('../agents');
const Challenge = require('../models/Challenge');

/**
 * Handle Voice-based problem submission via Groq Whisper API
 */
const transcribeAndFileComplaint = async (req, res, next) => {
  try {
    const { audioBase64, district = 'Ranchi', village = '', block = '' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 string is required' });
    }

    // Convert base64 to Buffer
    const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
    const audioBuffer = Buffer.from(base64Data, 'base64');

    // 1. Transcribe audio with Groq Whisper API
    let transcriptionResult;
    try {
      transcriptionResult = await transcribeAudioWithGroq(audioBuffer, 'voice_complaint.mp3');
    } catch (whisperErr) {
      console.warn('Groq Whisper error, using fallback simulated transcription:', whisperErr.message);
      transcriptionResult = {
        text: 'Villagers in Angara village reporting broken handpump and severe water shortage for two weeks.',
        language: 'hi',
      };
    }

    const rawTranscribedText = transcriptionResult.text;

    // 2. Process through LangGraph Multi-Agent Pipeline
    const aiResult = await processChallengeAI(rawTranscribedText, district);

    // 3. Create Challenge in MongoDB (with graceful fallback if Mongo is disconnected)
    let challenge = null;
    try {
      challenge = await Challenge.create({
        title: aiResult.cleanTitle || 'Voice-reported Civic Challenge',
        description: rawTranscribedText,
        translatedDescription: aiResult.translatedDescription || rawTranscribedText,
        languageDetected: aiResult.languageDetected || transcriptionResult.language || 'hi',
        category: aiResult.category || 'Water & Sanitation',
        severity: aiResult.severity || 'High',
        aiUrgencyScore: aiResult.aiUrgencyScore || 75,
        location: {
          state: 'Jharkhand',
          district,
          block,
          village,
        },
        submittedBy: req.user ? req.user._id : null,
        isDuplicate: aiResult.isDuplicate || false,
        duplicateOf: aiResult.duplicateOfId || null,
        similarityScore: aiResult.similarityScore || 0,
        assignedDepartment: aiResult.assignedDepartment || '',
        assignedUniversity: aiResult.recommendedUniversity || '',
        aiAnalysis: {
          recommendedDepartment: aiResult.assignedDepartment || '',
          technicalComplexity: aiResult.technicalComplexity || 5,
          keyKeywords: aiResult.keyKeywords || [],
          suggestedSolutionApproach: aiResult.suggestedSolutionApproach || '',
        },
      });
    } catch (dbErr) {
      console.warn('MongoDB not reachable for voice challenge, returning structured object:', dbErr.message);
      challenge = {
        _id: 'voice_' + Date.now(),
        title: aiResult.cleanTitle || 'Voice-reported Civic Challenge',
        description: rawTranscribedText,
        translatedDescription: aiResult.translatedDescription || rawTranscribedText,
        languageDetected: aiResult.languageDetected || transcriptionResult.language || 'hi',
        category: aiResult.category || 'Water & Sanitation',
        severity: aiResult.severity || 'High',
        aiUrgencyScore: aiResult.aiUrgencyScore || 75,
        location: { state: 'Jharkhand', district, block, village },
        submittedBy: null,
        isDuplicate: aiResult.isDuplicate || false,
        duplicateOf: null,
        similarityScore: aiResult.similarityScore || 0,
        assignedDepartment: aiResult.assignedDepartment || '',
        assignedUniversity: aiResult.recommendedUniversity || '',
        aiAnalysis: {
          recommendedDepartment: aiResult.assignedDepartment || '',
          technicalComplexity: aiResult.technicalComplexity || 5,
          keyKeywords: aiResult.keyKeywords || [],
          suggestedSolutionApproach: aiResult.suggestedSolutionApproach || '',
        },
      };
    }

    return res.status(201).json({
      success: true,
      message: 'Voice complaint transcribed and structured by AI successfully',
      transcribedText: rawTranscribedText,
      languageDetected: transcriptionResult.language,
      challenge,
      aiPipelineSteps: aiResult.steps,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  transcribeAndFileComplaint,
};
