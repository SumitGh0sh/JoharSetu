/**
 * OpenAPI 3.0 Specification for SIH26043 Platform API
 */

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'SIH26043 — Societal Challenge & Collaborative Problem Solving API',
    version: '1.0.0',
    description: `
**Jharkhand Higher & Technical Education Collaborative Innovation Platform**
Empowering citizens, higher education institutions (students & faculty), industry/CSR sponsors, and government departments to crowdsource, AI-route, and collaboratively solve societal challenges.

### Key Capabilities:
- 🔐 **Multi-Role JWT Auth**: Citizen, Student, Faculty, Industry Partner, Admin.
- 💬 **Sahayak AI Chatbot**: Conversational complaint filing and real-time status tracker.
- 🤖 **LangGraph AI Pipeline**: Multilingual translation, Pinecone vector deduplication, automated domain categorization, and university skill matrix matching.
- 🏆 **Collaborative Hub**: Student proposal submission, milestone tracking, and CSR sponsorships.
- 📊 **GIS & Analytics**: Real-time district-level problem distribution and resolution metrics.
    `,
    contact: {
      name: 'SIH26043 Development Team',
      email: 'shatrixx6@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide JWT token in format: Bearer <token>',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Invalid credentials or validation error' },
        },
      },
      UserSignupRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          name: { type: 'string', example: 'Rohan Sharma' },
          email: { type: 'string', format: 'email', example: 'rohan@example.com' },
          password: { type: 'string', minLength: 6, example: 'secret123' },
          role: {
            type: 'string',
            enum: ['citizen', 'student', 'faculty', 'industry', 'admin'],
            default: 'citizen',
            example: 'citizen',
          },
          organization: { type: 'string', example: 'Ranchi University' },
          phone: { type: 'string', example: '+91 9876543210' },
          district: { type: 'string', example: 'Ranchi' },
        },
      },
      UserSigninRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'rohan@example.com' },
          password: { type: 'string', example: 'secret123' },
        },
      },
      ChatMessageRequest: {
        type: 'object',
        required: ['message'],
        properties: {
          sessionId: { type: 'string', example: 'sess_12345' },
          message: { type: 'string', example: 'Hamare gaon me 3 hafte se drinking water supply band hai' },
          district: { type: 'string', example: 'Dhanbad' },
        },
      },
      ChallengeCreateRequest: {
        type: 'object',
        required: ['title', 'description'],
        properties: {
          title: { type: 'string', example: 'Contaminated Groundwater and Handpump Failure' },
          description: {
            type: 'string',
            example: 'Over 200 families in Village Angara, Ranchi are suffering from fluorosis and rusty water from 4 broken borewells.',
          },
          district: { type: 'string', example: 'Ranchi' },
          block: { type: 'string', example: 'Angara' },
          latitude: { type: 'number', example: 23.3441 },
          longitude: { type: 'number', example: 85.3096 },
          mediaUrls: {
            type: 'array',
            items: { type: 'string' },
            example: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
          },
        },
      },
      ProposalCreateRequest: {
        type: 'object',
        required: ['challengeId', 'title', 'abstract', 'methodology'],
        properties: {
          challengeId: { type: 'string', example: '66e0123456789abcdef01234' },
          title: { type: 'string', example: 'IoT-enabled Low-Cost Solar Desalination & Fluoride Filter Unit' },
          abstract: { type: 'string', example: 'Developing a multi-stage bio-sand and activated alumina gravity filter.' },
          methodology: { type: 'string', example: 'Field sampling, fabrication in university lab, pilot deployment.' },
          estimatedBudget: { type: 'number', example: 45000 },
          timelineWeeks: { type: 'number', example: 12 },
          teamMembers: {
            type: 'array',
            items: { type: 'string' },
            example: ['Amit Kumar (Lead)', 'Priya Singh (Hardware)'],
          },
        },
      },
    },
  },
  paths: {
    '/api/auth/signup': {
      post: {
        summary: 'Register a new user (Citizen, Student, Faculty, Industry, Admin)',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UserSignupRequest' } } },
        },
        responses: {
          201: { description: 'User registered successfully with JWT token' },
          400: { description: 'Validation error' },
          409: { description: 'Email already registered' },
        },
      },
    },
    '/api/auth/signin': {
      post: {
        summary: 'Authenticate user and return JWT token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UserSigninRequest' } } },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid email or password' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        summary: 'Logout user and invalidate JWT in Redis blocklist',
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
    '/api/chat/message': {
      post: {
        summary: 'Send conversational message to Sahayak AI Chatbot',
        tags: ['Sahayak AI Chatbot'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChatMessageRequest' } } },
        },
        responses: {
          200: { description: 'Chatbot response with session history & intent classification' },
        },
      },
    },
    '/api/chat/history/{sessionId}': {
      get: {
        summary: 'Get multi-turn conversation history from Redis',
        tags: ['Sahayak AI Chatbot'],
        parameters: [{ name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Session conversation logs' },
        },
      },
    },
    '/api/upload/image': {
      post: {
        summary: 'Upload evidence photo/image to Cloudinary and return secure URL',
        tags: ['Cloudinary Media Upload'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: { type: 'string', example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...' },
                  folder: { type: 'string', example: 'sih26043_evidence' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Image uploaded to Cloudinary' },
        },
      },
    },
    '/api/challenges': {

      get: {
        summary: 'List all crowdsourced challenges with filters (district, category, severity, status)',
        tags: ['Challenges & AI Pipeline'],
        parameters: [
          { name: 'district', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'severity', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of challenge tickets' },
        },
      },
      post: {
        summary: 'Submit a new challenge (Triggers LangGraph multi-agent pipeline: translation, deduplication, categorization, university routing)',
        tags: ['Challenges & AI Pipeline'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeCreateRequest' } } },
        },
        responses: {
          201: { description: 'Challenge created and analyzed by AI' },
        },
      },
    },
    '/api/challenges/{id}': {
      get: {
        summary: 'Get single challenge details with AI analysis and linked proposals',
        tags: ['Challenges & AI Pipeline'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Challenge details' },
          404: { description: 'Challenge not found' },
        },
      },
    },
    '/api/challenges/{id}/upvote': {
      post: {
        summary: 'Upvote a community challenge',
        tags: ['Challenges & AI Pipeline'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Upvote recorded' },
        },
      },
    },
    '/api/proposals': {
      get: {
        summary: 'List solution proposals by university teams',
        tags: ['University Collaboration & Proposals'],
        parameters: [
          { name: 'challengeId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of proposals' },
        },
      },
      post: {
        summary: 'Submit a solution proposal for a challenge',
        tags: ['University Collaboration & Proposals'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProposalCreateRequest' } } },
        },
        responses: {
          201: { description: 'Proposal submitted' },
        },
      },
    },
    '/api/proposals/{id}/milestones': {
      put: {
        summary: 'Update milestone progress for a student project',
        tags: ['University Collaboration & Proposals'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  milestoneIndex: { type: 'integer', example: 0 },
                  status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], example: 'completed' },
                  proofUrl: { type: 'string', example: 'https://github.com/team/sol-repo' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Milestone updated' },
        },
      },
    },
    '/api/voice/transcribe-and-file': {
      post: {
        summary: 'Submit voice audio note (Groq Whisper API transcribes multilingual audio & auto-files challenge via AI pipeline)',
        tags: ['Voice & Multilingual AI Ingestion'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['audioBase64'],
                properties: {
                  audioBase64: { type: 'string', example: 'data:audio/mp3;base64,...' },
                  district: { type: 'string', example: 'Ranchi' },
                  block: { type: 'string', example: 'Angara' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Voice transcribed and structured challenge created' },
        },
      },
    },
    '/api/certificates/generate': {
      post: {
        summary: 'Issue NEP 2020 Experiential Learning Academic Credit Certificate to verified student teams',
        tags: ['NEP 2020 Academic Credits & Certificates'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['proposalId'],
                properties: {
                  proposalId: { type: 'string', example: '66e0123456789abcdef01234' },
                  nepCredits: { type: 'integer', example: 4 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Certificate generated with verification hash' },
        },
      },
    },
    '/api/certificates/verify/{certIdOrHash}': {
      get: {
        summary: 'Public tamper-proof QR / Hash Certificate authenticity verification endpoint',
        tags: ['NEP 2020 Academic Credits & Certificates'],
        parameters: [{ name: 'certIdOrHash', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Certificate verified' },
          404: { description: 'Invalid certificate' },
        },
      },
    },
    '/api/proposals/{id}/disburse-grant': {
      post: {
        summary: 'Industry CSR Partner milestone-based grant tranche release from Escrow',
        tags: ['Industry CSR & Escrow Grants'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount'],
                properties: {
                  amount: { type: 'number', example: 25000 },
                  milestoneIndex: { type: 'integer', example: 1 },
                  note: { type: 'string', example: 'Prototype Lab Testing verified by faculty mentor' },
                  sponsorName: { type: 'string', example: 'Tata Steel CSR Foundation' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'CSR Grant tranche released' },
        },
      },
    },
    '/api/analytics/hotspots': {
      get: {
        summary: 'Detect active crisis hotspot clusters across Jharkhand districts for emergency administration alerts',
        tags: ['Analytics & GIS Dashboard'],
        responses: {
          200: { description: 'Active crisis hotspots' },
        },
      },
    },
    '/api/analytics/dashboard': {
      get: {
        summary: 'Get system-wide summary analytics (Total challenges, resolved %, category breakdown, district stats)',
        tags: ['Analytics & GIS Dashboard'],
        responses: {
          200: { description: 'Dashboard analytics summary' },
        },
      },
    },
    '/api/analytics/gis-heatmap': {
      get: {
        summary: 'Get district-wise GIS coordinate points for map heatmap visualization',
        tags: ['Analytics & GIS Dashboard'],
        responses: {
          200: { description: 'GIS points and intensity' },
        },
      },
    },
  },
};

module.exports = swaggerSpec;

