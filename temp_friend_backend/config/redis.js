const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.warn('⚠️ Redis reconnection limit reached. Proceeding without active Redis cache.');
        return false;
      }
      return Math.min(retries * 500, 3000);
    },
  },
});

redisClient.on('connect', () => {
  console.log('⚡ Redis client connected');
});

redisClient.on('ready', () => {
  console.log('✅ Redis client ready for commands');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err.message);
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.warn('⚠️ Could not connect to Redis server on startup:', error.message);
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
