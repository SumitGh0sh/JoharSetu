const { generateAIResponse } = require('../../../config/ai');

/**
 * Node 1: Multilingual Ingestion & Translation Node
 * Detects language (Hindi, Santhali, Mundari, English) and normalizes into structured problem statement.
 */
const translationNode = async (state) => {
  const { rawText, district } = state;

  const systemPrompt = `You are a multilingual AI assistant specialized in parsing citizen complaints in Jharkhand, India.
Given a citizen complaint text (which could be in Hindi, Hinglish, Santhali/Mundari transliterated, or English), your job is to:
1. Detect language.
2. Translate/normalize the text into concise, professional English.
3. Extract a clean title.

Return ONLY a valid JSON object in this format:
{
  "languageDetected": "hi" | "en" | "regional",
  "cleanTitle": "Short descriptive title (max 10 words)",
  "translatedDescription": "Detailed standardized description in English",
  "keyEntities": ["List", "of", "important", "locations", "or", "issues"]
}`;

  try {
    const response = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Citizen Complaint: "${rawText}"\nDistrict: ${district || 'Jharkhand'}` },
    ], { jsonMode: true });

    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      // Fallback in case response isn't strict JSON
      parsed = {
        languageDetected: 'auto',
        cleanTitle: rawText.slice(0, 50),
        translatedDescription: rawText,
        keyEntities: [district || 'Jharkhand'],
      };
    }

    return {
      languageDetected: parsed.languageDetected || 'en',
      cleanTitle: parsed.cleanTitle || rawText.slice(0, 50),
      translatedDescription: parsed.translatedDescription || rawText,
      keyEntities: parsed.keyEntities || [],
      steps: [`[Translation] Processed complaint in language: ${parsed.languageDetected || 'en'}`],
    };
  } catch (err) {
    console.warn('Translation node fallback:', err.message);
    return {
      languageDetected: 'en',
      cleanTitle: rawText.slice(0, 50),
      translatedDescription: rawText,
      keyEntities: [],
      steps: [`[Translation] Fallback applied due to API error`],
    };
  }
};

module.exports = translationNode;
