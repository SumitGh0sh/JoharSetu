const { generateEmbedding } = require('../../../config/ai');
const { getPineconeIndex } = require('../../../config/pinecone');

/**
 * Node 2: Pinecone Vector Embedding & Deduplication Node
 * Generates vector embedding and queries Pinecone to identify if a similar issue exists.
 */
const deduplicationNode = async (state) => {
  const { translatedDescription, district } = state;
  const embedding = await generateEmbedding(`${district || ''}: ${translatedDescription}`);

  let isDuplicate = false;
  let duplicateOfId = null;
  let similarityScore = 0;

  try {
    const index = getPineconeIndex();
    if (index) {
      // Query top 1 match in Pinecone
      const queryResponse = await index.query({
        vector: embedding,
        topK: 1,
        includeMetadata: true,
      });

      if (queryResponse.matches && queryResponse.matches.length > 0) {
        const topMatch = queryResponse.matches[0];
        // If cosine similarity is >= 0.85, consider it a semantic duplicate
        if (topMatch.score >= 0.85) {
          isDuplicate = true;
          duplicateOfId = topMatch.id;
          similarityScore = topMatch.score;
        }
      }
    }
  } catch (err) {
    console.warn('Pinecone deduplication check skipped/offline:', err.message);
  }

  return {
    vectorEmbedding: embedding,
    isDuplicate,
    duplicateOfId,
    similarityScore,
    steps: [
      `[Deduplication] Checked Pinecone. Duplicate: ${isDuplicate} (Score: ${similarityScore.toFixed(2)})`,
    ],
  };
};

module.exports = deduplicationNode;
