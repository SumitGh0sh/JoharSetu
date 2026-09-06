require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');

let pineconeClient = null;

const getPineconeClient = () => {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ PINECONE_API_KEY is not set in environment variables.');
      return null;
    }
    pineconeClient = new Pinecone({
      apiKey,
    });
  }
  return pineconeClient;
};

const getPineconeIndex = (indexName = process.env.PINECONE_INDEX) => {
  const pc = getPineconeClient();
  if (!pc || !indexName) {
    console.warn('⚠️ Pinecone client or PINECONE_INDEX is not configured.');
    return null;
  }
  return pc.index(indexName);
};

/**
 * Verify and log Pinecone & Index Connection on server startup
 */
const connectPinecone = async () => {
  try {
    const pc = getPineconeClient();
    if (!pc) return;

    console.log('🌲 Pinecone client connected');

    const indexName = process.env.PINECONE_INDEX;
    if (!indexName) {
      console.warn('⚠️ PINECONE_INDEX is not configured in .env');
      return;
    }

    const { indexes } = await pc.listIndexes();
    const indexExists = indexes && indexes.some((idx) => idx.name === indexName);

    if (indexExists) {
      console.log(`✅ Pinecone index "${indexName}" connected and ready`);
    } else {
      console.warn(`⚠️ Pinecone index "${indexName}" was not found in your account. Available indexes: ${indexes.map(i => i.name).join(', ')}`);
    }
  } catch (error) {
    console.warn('⚠️ Pinecone connection check failed:', error.message);
  }
};

module.exports = {
  getPineconeClient,
  getPineconeIndex,
  connectPinecone,
};
