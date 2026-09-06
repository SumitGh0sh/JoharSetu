const { generateEmbedding } = require('../../../config/ai');
const { getPineconeIndex } = require('../../../config/pinecone');

/**
 * Chatbot Node 2: Pinecone Knowledge Base RAG Search
 */
const ragSearchNode = async (state) => {
  const { userMessage, intent } = state;
  let retrievedContext = '';

  if (intent === 'ASK_GUIDELINES' || intent === 'FILE_COMPLAINT') {
    try {
      const index = getPineconeIndex();
      if (index) {
        const queryVector = await generateEmbedding(userMessage);
        const queryResponse = await index.query({
          vector: queryVector,
          topK: 2,
          includeMetadata: true,
        });

        if (queryResponse.matches && queryResponse.matches.length > 0) {
          retrievedContext = queryResponse.matches
            .map((m) => m.metadata?.text || m.metadata?.title || '')
            .filter(Boolean)
            .join('\n');
        }
      }
    } catch (err) {
      console.warn('RAG search skipped/offline:', err.message);
    }
  }

  return {
    retrievedContext,
    steps: [`[Chatbot RAG] Retrieved ${retrievedContext ? 'relevant' : 'no'} knowledge context`],
  };
};

module.exports = ragSearchNode;
