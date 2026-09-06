/**
 * Centralized API & Service Configuration for JoharSetu
 * Manages endpoints for Next.js App Router, Python FastAPI AI Microservice,
 * and Express/Groq Multilingual Chat Microservice.
 */

export const API_CONFIG = {
  // Python FastAPI AI & Spatial Routing Microservice (Port 8000)
  aiServiceUrl:
    process.env.NEXT_PUBLIC_FASTAPI_URL ||
    process.env.FASTAPI_SERVICE_URL ||
    'http://localhost:8000',

  // Express / Groq Multilingual Chat Microservice (Port 5000)
  chatServiceUrl:
    process.env.NEXT_PUBLIC_CHAT_SERVICE_URL ||
    'http://localhost:5000',

  // Google Maps API Key
  googleMapsApiKey:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',

  // Internal Next.js App Router API Base
  internalApiUrl: '',
};

export const API_ENDPOINTS = {
  // FastAPI AI Endpoints
  aiTicketsProcess: `${API_CONFIG.aiServiceUrl}/api/v1/tickets/process`,
  aiVoiceTranscribe: `${API_CONFIG.aiServiceUrl}/api/v1/voice/transcribe`,
  aiHeisList: `${API_CONFIG.aiServiceUrl}/api/v1/heis`,
  aiLedgerRecord: `${API_CONFIG.aiServiceUrl}/api/v1/ledger/record`,
  aiLedgerHistory: `${API_CONFIG.aiServiceUrl}/api/v1/ledger/history`,
  aiGisDistricts: `${API_CONFIG.aiServiceUrl}/api/v1/gis/districts`,

  // Chat / Media Microservice Endpoints (Port 5000)
  chatMessage: `${API_CONFIG.chatServiceUrl}/api/chat/message`,
  chatChallenges: `${API_CONFIG.chatServiceUrl}/api/challenges`,
  chatVerifyImage: `${API_CONFIG.chatServiceUrl}/api/challenges/verify-image`,
  chatVoiceTranscribeAndFile: `${API_CONFIG.chatServiceUrl}/api/voice/transcribe-and-file`,

  // Internal Next.js Endpoints
  internalTicketsSubmit: '/api/tickets/submit',
  internalTicketsList: '/api/tickets',
  internalAuthLogin: '/api/auth/login',
  internalAuthRegister: '/api/auth/register',
  internalLocation: '/api/location',
  internalUpload: '/api/upload',
  internalGenerateIssueImage: '/api/ai/generate-issue-image',
};

export default API_CONFIG;
