const { generateAIResponse } = require('../../../config/ai');

/**
 * Node 3: Domain Categorization & AI Urgency Scoring Node
 */
const categorizationNode = async (state) => {
  const { cleanTitle, translatedDescription } = state;

  const validCategories = [
    'Water & Sanitation',
    'Healthcare & Nutrition',
    'Agriculture & Rural Economy',
    'Roads & Infrastructure',
    'Education & Literacy',
    'Clean Energy & Environment',
    'Public Services & Governance',
    'Other',
  ];

  const systemPrompt = `You are an AI civic analyst evaluating societal challenges in Jharkhand.
Categories available: ${JSON.stringify(validCategories)}

Analyze the problem description and provide:
1. "category": Must be one of the exact categories above.
2. "severity": "Low" | "Medium" | "High" | "Critical".
3. "aiUrgencyScore": integer between 1 and 100 representing civic hazard/impact level.
4. "technicalComplexity": integer between 1 and 10.
5. "keyKeywords": array of 3-5 tags.
6. "suggestedSolutionApproach": 1-2 sentence brief engineering/social approach.

Return ONLY a JSON object:
{
  "category": "...",
  "severity": "...",
  "aiUrgencyScore": 85,
  "technicalComplexity": 7,
  "keyKeywords": ["water", "filtration", "fluoride"],
  "suggestedSolutionApproach": "..."
}`;

  try {
    const response = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Title: ${cleanTitle}\nDescription: ${translatedDescription}` },
    ], { jsonMode: true });

    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      parsed = {
        category: 'Water & Sanitation',
        severity: 'Medium',
        aiUrgencyScore: 60,
        technicalComplexity: 5,
        keyKeywords: ['civic', 'issue'],
        suggestedSolutionApproach: 'Multi-disciplinary community intervention.',
      };
    }

    return {
      category: validCategories.includes(parsed.category) ? parsed.category : 'Other',
      severity: parsed.severity || 'Medium',
      aiUrgencyScore: parsed.aiUrgencyScore || 50,
      technicalComplexity: parsed.technicalComplexity || 5,
      keyKeywords: parsed.keyKeywords || [],
      suggestedSolutionApproach: parsed.suggestedSolutionApproach || '',
      steps: [
        `[Categorization] Category: "${parsed.category}", Severity: "${parsed.severity}" (Score: ${parsed.aiUrgencyScore})`,
      ],
    };
  } catch (err) {
    console.warn('Categorization node fallback:', err.message);
    return {
      category: 'Other',
      severity: 'Medium',
      aiUrgencyScore: 50,
      technicalComplexity: 5,
      keyKeywords: [],
      suggestedSolutionApproach: '',
      steps: [`[Categorization] Fallback default applied`],
    };
  }
};

module.exports = categorizationNode;
