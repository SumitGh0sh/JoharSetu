const { generateAIResponse } = require('../../../config/ai');

/**
 * Chatbot Node 1: Intent Classification
 */
const intentNode = async (state) => {
  const { userMessage, history } = state;

  const systemPrompt = `You are an AI intent classifier for 'Sahayak AI' (Govt. of Jharkhand Civic Assistance Chatbot).
Classify the user's intent into exactly ONE of these:
- "FILE_COMPLAINT": User is reporting a problem (water, electricity, roads, hospital, school, garbage, etc.).
- "CHECK_STATUS": User is asking about the status of a past ticket/complaint.
- "ASK_GUIDELINES": User is asking about SIH, university student schemes, NEP 2020 credits, or platform rules.
- "GENERAL_CHAT": Greetings, general queries, thank you, help.

Return ONLY a JSON object:
{
  "intent": "FILE_COMPLAINT" | "CHECK_STATUS" | "ASK_GUIDELINES" | "GENERAL_CHAT",
  "confidence": 0.95
}`;

  try {
    const response = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ], { jsonMode: true });

    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      parsed = { intent: 'GENERAL_CHAT', confidence: 0.8 };
    }

    return {
      intent: parsed.intent || 'GENERAL_CHAT',
      steps: [`[Chatbot Intent] Classified as: ${parsed.intent}`],
    };
  } catch (err) {
    return {
      intent: 'GENERAL_CHAT',
      steps: [`[Chatbot Intent] Fallback applied`],
    };
  }
};

module.exports = intentNode;
