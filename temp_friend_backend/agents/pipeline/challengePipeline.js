const { StateGraph, Annotation, START, END } = require('@langchain/langgraph');
const translationNode = require('./nodes/translationNode');
const deduplicationNode = require('./nodes/deduplicationNode');
const categorizationNode = require('./nodes/categorizationNode');
const routingNode = require('./nodes/routingNode');

/**
 * Pipeline State Schema
 */
const ChallengeState = Annotation.Root({
  rawText: Annotation({ default: () => '' }),
  district: Annotation({ default: () => 'Ranchi' }),
  languageDetected: Annotation({ default: () => 'en' }),
  cleanTitle: Annotation({ default: () => '' }),
  translatedDescription: Annotation({ default: () => '' }),
  keyEntities: Annotation({ default: () => [] }),
  vectorEmbedding: Annotation({ default: () => [] }),
  isDuplicate: Annotation({ default: () => false }),
  duplicateOfId: Annotation({ default: () => null }),
  similarityScore: Annotation({ default: () => 0 }),
  category: Annotation({ default: () => 'Other' }),
  severity: Annotation({ default: () => 'Medium' }),
  aiUrgencyScore: Annotation({ default: () => 50 }),
  technicalComplexity: Annotation({ default: () => 5 }),
  keyKeywords: Annotation({ default: () => [] }),
  suggestedSolutionApproach: Annotation({ default: () => '' }),
  assignedDepartment: Annotation({ default: () => '' }),
  recommendedUniversity: Annotation({ default: () => '' }),
  steps: Annotation({
    reducer: (curr, update) => (update ? curr.concat(update) : curr),
    default: () => [],
  }),
});

/**
 * Build & Compile Challenge Ingestion StateGraph
 */
const buildChallengePipeline = () => {
  const workflow = new StateGraph(ChallengeState)
    .addNode('translate', translationNode)
    .addNode('deduplicate', deduplicationNode)
    .addNode('categorize', categorizationNode)
    .addNode('route', routingNode)
    .addEdge(START, 'translate')
    .addEdge('translate', 'deduplicate')
    .addEdge('deduplicate', 'categorize')
    .addEdge('categorize', 'route')
    .addEdge('route', END);

  return workflow.compile();
};

const challengePipeline = buildChallengePipeline();

/**
 * Run the Challenge Processing Multi-Agent Pipeline
 * @param {string} rawText
 * @param {string} district
 */
const processChallengeAI = async (rawText, district = 'Ranchi') => {
  const result = await challengePipeline.invoke({
    rawText,
    district,
    steps: [],
  });
  return result;
};

module.exports = {
  challengePipeline,
  processChallengeAI,
};
