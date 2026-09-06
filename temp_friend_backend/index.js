const path = require('path');
// Load unified root .env first, fallback to local .env if present
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Configs
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const { connectPinecone } = require('./config/pinecone');

// Routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const docsRoutes = require('./routes/docsRoutes');

// Middlewares
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ── 1. Database & Cloud Connections ──────────────────────────────────────────
connectDB();
connectRedis();
connectPinecone();

// ── 2. Global Middleware ─────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ── 3. Interactive Swagger Documentation ────────────────────────────────────
app.use('/api-docs', docsRoutes);

// ── 4. Health Check & Root ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🏛️ SIH26043 Collaborative Problem Solving API is running',
    version: '1.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      docs: '/api-docs',
      auth: '/api/auth',
      chat: '/api/chat',
      challenges: '/api/challenges',
      upload: '/api/upload',
      voice: '/api/voice',
      proposals: '/api/proposals',
      certificates: '/api/certificates',
      analytics: '/api/analytics',
    },
  });
});

// ── 5. Feature Routes ────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/analytics', analyticsRoutes);



// ── 6. Error & 404 Handlers ─────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── 7. Start Server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Swagger API Docs available at http://localhost:${PORT}/api-docs`);
});
