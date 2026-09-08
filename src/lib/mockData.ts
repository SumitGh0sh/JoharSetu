import { 
  ProblemTicket, 
  DistrictMetric, 
  AuditBlock, 
  HeiDirectoryEntry, 
  CrcDirectoryEntry, 
  StudentLeaderboardEntry, 
  PublicSentimentMetric,
  ManagedUser 
} from './types';

export const INITIAL_TICKETS: ProblemTicket[] = [
  {
    id: 'tkt-001',
    ticketCode: 'JS-DHN-2026-0042',
    title: 'Red and Dirty Water in Village Handpump',
    description: 'Handpump water turns rusty red quickly. School children are getting skin rashes from drinking it. We need clean drinking water in our village.',
    category: 'WATER_MANAGEMENT',
    urgency: 'HIGH',
    status: 'IN_PROGRESS',
    latitude: 23.8214,
    longitude: 86.2052,
    district: 'Dhanbad',
    village: 'Baghmara Panchayat, Block IV',
    reporterName: 'Mangal Soren (Mukhiya)',
    reporterPhone: '+91 94311 82910',
    reportedAt: '2026-08-28T10:15:00Z',
    imageUrls: [
      '/images/issues/handpump_broken.jpg'
    ],
    aiVerification: {
      confidence: 0.94,
      detectedObjects: [
        { label: 'Rusted iron pipe', confidence: 0.96 },
        { label: 'Dirty reddish water pool', confidence: 0.92 }
      ],
      severityScore: 0.88
    },
    assignedHei: {
      id: 'hei-ism',
      name: 'IIT (ISM) Dhanbad',
      code: 'IITISM',
      department: 'Department of Environmental Engineering',
      facultyMentor: 'Prof. Alok Kumar Sinha (Head of Water Tech)',
      distanceKm: 24.3,
      utilityScore: 0.932,
      routingReason: 'Nearest engineering college (24 km) with water testing lab and active student team.'
    },
    projectTeam: {
      id: 'team-ism-01',
      teamName: 'JalShuddhi Innovators',
      facultyLead: 'Prof. Alok Kumar Sinha',
      students: [
        { name: 'Pooja Murmu', role: 'Team Lead & Chemical Analyst', rollNo: '22JE0451', creditsClaimed: false },
        { name: 'Rohan Sharma', role: 'IoT Telemetry & Sensor Engineer', rollNo: '22JE0512', creditsClaimed: false },
        { name: 'Aniket Soren', role: 'Community Field Liaison', rollNo: '23MT0114', creditsClaimed: false }
      ],
      nepCredits: 4,
      milestones: [
        {
          id: 'ms-1',
          sequence: 1,
          title: 'Field Sampling & Spectrophotometry Assay',
          targetDate: '2026-09-02',
          completedDate: '2026-09-01',
          status: 'APPROVED',
          proofUrl: 'https://joharsetu.gov.in/proofs/baghmara_water_test.pdf',
          sha256Hash: 'a8f5c381d624ef81b37c0f16d7a5b3a62883ef4b14d237b6c7f893e3d9319e2c'
        },
        {
          id: 'ms-2',
          sequence: 2,
          title: 'Terracotta & Activated Sorbent Column Prototype',
          targetDate: '2026-09-15',
          completedDate: '2026-09-04',
          status: 'APPROVED',
          proofUrl: 'https://joharsetu.gov.in/proofs/terracotta_filter_schematic.pdf',
          sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        },
        {
          id: 'ms-3',
          sequence: 3,
          title: 'Solar-Powered Backwash Telemetry Node Deployment',
          targetDate: '2026-09-25',
          status: 'IN_PROGRESS'
        },
        {
          id: 'ms-4',
          sequence: 4,
          title: 'Panchayat Handover & Social Impact Certification',
          targetDate: '2026-10-10',
          status: 'PENDING'
        }
      ],
      sponsors: [
        { company: 'Coal India Limited (CSR Green Cell)', amount: 180000, status: 'DISBURSED' },
        { company: 'Jharkhand State Innovation Council', amount: 50000, status: 'COMMITTED' }
      ]
    },
    socialEngagement: {
      upvotes: 184,
      hasUpvoted: true,
      shares: 42,
      commentsCount: 6,
      hypeScore: 920,
      trendingBadge: '🔥 #1 Trending in Dhanbad',
      comments: [
        {
          id: 'c-1',
          authorName: 'Prof. Alok Kumar Sinha',
          authorRole: 'FACULTY_MENTOR',
          authorAffiliation: 'IIT (ISM) Dhanbad',
          text: 'Our 3rd-year environmental engineering team collected 12 water samples today. Iron concentration is 3.8 mg/L (limit 0.3 mg/L). Terracotta-sorbent prototype column testing begins tomorrow!',
          createdAt: '2026-09-03T11:00:00Z',
          isOfficial: true,
        },
        {
          id: 'c-2',
          authorName: 'Rohan Sharma',
          authorRole: 'STUDENT_LEAD',
          authorAffiliation: 'JalShuddhi NSS Unit',
          text: 'Installed optical turbidity telemetry module at Baghmara Primary School borewell. Real-time data will stream to the JoharSetu map.',
          createdAt: '2026-09-04T15:30:00Z',
          isOfficial: true,
        },
        {
          id: 'c-3',
          authorName: 'Sunita Hembram',
          authorRole: 'CITIZEN',
          authorAffiliation: 'Baghmara Panchayat',
          text: 'Thank you students! The school children were having severe stomach issues. We are eagerly waiting for the filter unit installation.',
          createdAt: '2026-09-05T09:15:00Z',
          isOfficial: false,
        },
      ],
    },
    privacySettings: {
      isAnonymous: true,
      publicReporterIdentifier: 'Resident of Baghmara Block IV',
    },
    crowdfunding: {
      id: 'cf-dhn-01',
      targetAmount: 120000,
      raisedAmount: 78500,
      backersCount: 46,
      is80GEligible: true,
      escrowStatus: 'MILESTONE_LOCKED',
      corporateMatch: {
        company: 'Coal India CSR Cell',
        ratio: '1:1 Match',
        active: true,
      },
      donations: [
        { id: 'd-1', donorName: 'Coal India Green Fund', amount: 50000, isCorporate: true, timestamp: '2026-09-01T12:00:00Z' },
        { id: 'd-2', donorName: 'Anonymous Dhanbad Alumnus', amount: 10000, isAnonymous: true, timestamp: '2026-09-02T14:30:00Z' },
        { id: 'd-3', donorName: 'Birsa Welfare Society', amount: 5000, isAnonymous: false, timestamp: '2026-09-03T18:00:00Z' },
      ],
    },
    nssWorkflow: {
      nssUnitId: 'NSS-IITISM-ENV-04',
      coordinatorName: 'Prof. Alok Kumar Sinha',
      loggedFieldHours: 52,
      targetFieldHours: 60,
      nepCreditsEligible: 4,
      status: 'HOURS_LOGGED',
    },
  },
  {
    id: 'tkt-002',
    ticketCode: 'JS-RNC-2026-0089',
    title: 'Broken Road Culvert Washed Away by Rain',
    description: 'Heavy rain washed away the village road bridge. 450 farming families cannot reach the mandi to sell vegetables.',
    category: 'ROAD_INFRASTRUCTURE',
    urgency: 'HIGH',
    status: 'AI_ROUTED',
    latitude: 23.4190,
    longitude: 85.5210,
    district: 'Ranchi',
    village: 'Hesal Village, Angara Block',
    reporterName: 'Sunita Devi (Ward Member)',
    reporterPhone: '+91 88251 09321',
    reportedAt: '2026-09-03T14:20:00Z',
    imageUrls: [
      '/images/issues/road_culvert.jpg'
    ],
    aiVerification: {
      confidence: 0.92,
      detectedObjects: [
        { label: 'Broken bridge soil', confidence: 0.95 },
        { label: 'Collapsed water pipe', confidence: 0.91 }
      ],
      severityScore: 0.85
    },
    assignedHei: {
      id: 'hei-bit',
      name: 'BIT Mesra, Ranchi',
      code: 'BITMESRA',
      department: 'Department of Civil & Environmental Engineering',
      facultyMentor: 'Dr. Sudhir Chandra (Hydraulic Structures)',
      distanceKm: 14.8,
      utilityScore: 0.945,
      routingReason: 'Direct proximity (14.8 km) + Civil engineering team building rural road solutions.'
    },
    projectTeam: {
      id: 'team-bit-02',
      teamName: 'SetuBandhan Engineers',
      facultyLead: 'Dr. Sudhir Chandra',
      students: [
        { name: 'Kunal Nayak', role: 'Structural Modeler', rollNo: 'BTECH/CE/22/031', creditsClaimed: false },
        { name: 'Ananya Roy', role: 'Hydrological GIS Modeler', rollNo: 'BTECH/CE/22/044', creditsClaimed: false },
        { name: 'Deepak Munda', role: 'Cost & Material Estimator', rollNo: 'BTECH/CE/22/012', creditsClaimed: false }
      ],
      nepCredits: 4,
      milestones: [
        {
          id: 'ms-201',
          sequence: 1,
          title: 'UAV Aerial Photogrammetry & Catchment Discharge Modeling',
          targetDate: '2026-09-12',
          status: 'IN_PROGRESS'
        },
        {
          id: 'ms-202',
          sequence: 2,
          title: 'Modular Precast Bamboo-Reinforced Box Culvert Blueprint',
          targetDate: '2026-09-24',
          status: 'PENDING'
        },
        {
          id: 'ms-203',
          sequence: 3,
          title: 'Physical Pilot Construction with SHG Labor',
          targetDate: '2026-10-15',
          status: 'PENDING'
        },
        {
          id: 'ms-204',
          sequence: 4,
          title: 'Gram Sabha Structural Safety Audit',
          targetDate: '2026-10-30',
          status: 'PENDING'
        }
      ],
      sponsors: [
        { company: 'Tata Steel Rural Development Society (TSRDS)', amount: 250000, status: 'COMMITTED' }
      ]
    },
    socialEngagement: {
      upvotes: 142,
      hasUpvoted: false,
      shares: 28,
      commentsCount: 4,
      hypeScore: 780,
      trendingBadge: '⚡ Viral in Ranchi',
      comments: [
        {
          id: 'c-201',
          authorName: 'Dr. Sudhir Chandra',
          authorRole: 'FACULTY_MENTOR',
          authorAffiliation: 'BIT Mesra',
          text: 'Conducted drone survey of the Hesal seasonal nullah. Peak discharge is 18 cumecs. Pre-cast interlocking culvert design will restore transport within 3 weeks.',
          createdAt: '2026-09-04T16:00:00Z',
          isOfficial: true,
        },
        {
          id: 'c-202',
          authorName: 'Mukesh Mahto',
          authorRole: 'CITIZEN',
          authorAffiliation: 'Hesal Farmer Union',
          text: 'Our tomato produce is rotting in the fields because tractors cannot cross. Please fast-track this!',
          createdAt: '2026-09-05T08:30:00Z',
          isOfficial: false,
        },
      ],
    },
    privacySettings: {
      isAnonymous: true,
      publicReporterIdentifier: 'Ward Member, Angara Block',
    },
    crowdfunding: {
      id: 'cf-rnc-02',
      targetAmount: 250000,
      raisedAmount: 165000,
      backersCount: 58,
      is80GEligible: true,
      escrowStatus: 'OPEN',
      corporateMatch: {
        company: 'Tata Steel TSRDS',
        ratio: '1:1 Match',
        active: true,
      },
      donations: [
        { id: 'd-21', donorName: 'Tata Steel Rural Dev', amount: 100000, isCorporate: true, timestamp: '2026-09-03T18:00:00Z' },
        { id: 'd-22', donorName: 'Hesal Gram Seva Fund', amount: 25000, isAnonymous: false, timestamp: '2026-09-04T11:00:00Z' },
      ],
    },
    nssWorkflow: {
      nssUnitId: 'NSS-BITM-CIVIL-02',
      coordinatorName: 'Dr. Sudhir Chandra',
      loggedFieldHours: 35,
      targetFieldHours: 60,
      nepCreditsEligible: 4,
      status: 'HOURS_LOGGED',
    },
  },
  {
    id: 'tkt-003',
    ticketCode: 'JS-JSR-2026-0112',
    title: 'Village Solar Light & Inverter Burnt by Lightning',
    description: 'Solar power unit was hit by lightning. 65 village homes and the health clinic are in complete darkness.',
    category: 'RURAL_ELECTRIFICATION_SOLAR',
    urgency: 'CRITICAL',
    status: 'ACCEPTED_BY_HEI',
    latitude: 22.6184,
    longitude: 86.2190,
    district: 'East Singhbhum',
    village: 'Sankhabhanga Tola, Potka Block',
    reporterName: 'Gouranga Soren (Panchayat Sevak)',
    reporterPhone: '+91 97712 45890',
    reportedAt: '2026-09-02T09:10:00Z',
    imageUrls: [
      '/images/issues/solar_inverter.jpg'
    ],
    aiVerification: {
      confidence: 0.96,
      detectedObjects: [
        { label: 'Burnt inverter wire board', confidence: 0.97 },
        { label: 'Damaged power unit', confidence: 0.93 }
      ],
      severityScore: 0.92
    },
    assignedHei: {
      id: 'hei-nit',
      name: 'NIT Jamshedpur',
      code: 'NITJSR',
      department: 'Department of Electrical Engineering',
      facultyMentor: 'Prof. Niranjan Kumar (Renewable Microgrids)',
      distanceKm: 21.0,
      utilityScore: 0.951,
      routingReason: 'Expert solar power lab + 21 km distance from village.'
    },
    socialEngagement: {
      upvotes: 215,
      hasUpvoted: true,
      shares: 61,
      commentsCount: 7,
      hypeScore: 1140,
      trendingBadge: '🚨 Critical Hazard • Potka',
      comments: [
        {
          id: 'c-301',
          authorName: 'Prof. Niranjan Kumar',
          authorRole: 'FACULTY_MENTOR',
          authorAffiliation: 'NIT Jamshedpur',
          text: 'Fault diagnosis shows MPPT circuit surge without SPD protection. Student team is preparing a replacement inverter with Class I lightning arrestor.',
          createdAt: '2026-09-03T10:00:00Z',
          isOfficial: true,
        },
      ],
    },
    privacySettings: {
      isAnonymous: true,
      publicReporterIdentifier: 'Resident of Sankhabhanga Tola',
    },
    crowdfunding: {
      id: 'cf-jsr-03',
      targetAmount: 85000,
      raisedAmount: 62000,
      backersCount: 39,
      is80GEligible: true,
      escrowStatus: 'OPEN',
      corporateMatch: {
        company: 'Tata Power Solar CSR',
        ratio: '1:1 Match',
        active: true,
      },
      donations: [
        { id: 'd-31', donorName: 'Tata Power Community Fund', amount: 40000, isCorporate: true, timestamp: '2026-09-03T09:00:00Z' },
      ],
    },
    nssWorkflow: {
      nssUnitId: 'NSS-NITJSR-ELECT-01',
      coordinatorName: 'Prof. Niranjan Kumar',
      loggedFieldHours: 24,
      targetFieldHours: 60,
      nepCreditsEligible: 4,
      status: 'ASSIGNED',
    },
  },
  {
    id: 'tkt-004',
    ticketCode: 'JS-KHK-2026-0017',
    title: 'Yellow Spots & Disease on Rice Crops',
    description: 'Over 40 hectares of paddy have yellow dry spots. Farmers need natural medicine without chemicals to save their crops.',
    category: 'SUSTAINABLE_AGRICULTURE',
    urgency: 'HIGH',
    status: 'RESOLVED',
    latitude: 23.4390,
    longitude: 85.3120,
    district: 'Ranchi',
    village: 'Kanke Block, Pithoriya Cluster',
    reporterName: 'Budhram Oraon (Kisan Mitra)',
    reporterPhone: '+91 91224 88319',
    reportedAt: '2026-08-20T11:45:00Z',
    imageUrls: [
      '/images/issues/crop_blight.jpg'
    ],
    aiVerification: {
      confidence: 0.91,
      detectedObjects: [
        { label: 'Crop leaf blight disease', confidence: 0.94 }
      ],
      severityScore: 0.79
    },
    assignedHei: {
      id: 'hei-bau',
      name: 'Birsa Agricultural University (BAU) Ranchi',
      code: 'BAU',
      department: 'Faculty of Agriculture & Plant Pathology',
      facultyMentor: 'Dr. Pratibha Minz',
      distanceKm: 8.2,
      utilityScore: 0.978,
      routingReason: 'Agriculture university (8.2 km away) with organic crop medicine lab.'
    },
    projectTeam: {
      id: 'team-bau-04',
      teamName: 'Harit Kranti Innovators',
      facultyLead: 'Dr. Pratibha Minz',
      students: [
        { name: 'Sanjay Oraon', role: 'NSS Lead & Bio-Formulation Specialist', rollNo: 'AG/22/019', creditsClaimed: true },
        { name: 'Kavita Kumari', role: 'Soil Microbial Analyst', rollNo: 'AG/22/042', creditsClaimed: true },
        { name: 'Amit Topno', role: 'Community Field Demonstrator', rollNo: 'AG/22/058', creditsClaimed: true }
      ],
      nepCredits: 4,
      milestones: [
        { id: 'ms-401', sequence: 1, title: 'Bacterial Isolate Culture Assay', targetDate: '2026-08-22', completedDate: '2026-08-22', status: 'APPROVED' },
        { id: 'ms-402', sequence: 2, title: 'Trichoderma Bio-Formulation Mixing', targetDate: '2026-08-26', completedDate: '2026-08-25', status: 'APPROVED' },
        { id: 'ms-403', sequence: 3, title: 'Field Spraying across 40 Hectares', targetDate: '2026-08-30', completedDate: '2026-08-29', status: 'APPROVED' },
        { id: 'ms-404', sequence: 4, title: 'Gram Sabha Resolution Signoff', targetDate: '2026-09-05', completedDate: '2026-09-05', status: 'APPROVED' }
      ],
      sponsors: [
        { company: 'Jharkhand State Organic Mission', amount: 60000, status: 'DISBURSED' }
      ]
    },
    socialEngagement: {
      upvotes: 290,
      hasUpvoted: true,
      shares: 88,
      commentsCount: 14,
      hypeScore: 1450,
      trendingBadge: '🏆 Resolved with 4 NEP Credits',
      comments: [
        {
          id: 'c-401',
          authorName: 'Dr. Pratibha Minz',
          authorRole: 'FACULTY_MENTOR',
          authorAffiliation: 'BAU Ranchi',
          text: 'Field evaluation confirmed 98% remission of Xanthomonas oryzae after application of our organic microbial culture. Proud of the student team!',
          createdAt: '2026-09-05T14:00:00Z',
          isOfficial: true,
        },
        {
          id: 'c-402',
          authorName: 'Budhram Oraon',
          authorRole: 'CITIZEN',
          authorAffiliation: 'Pithoriya Cluster',
          text: 'Our entire village crop was saved without spending money on toxic chemicals. The BAU students worked in the rain with us.',
          createdAt: '2026-09-05T17:30:00Z',
          isOfficial: true,
        }
      ],
    },
    privacySettings: {
      isAnonymous: true,
      publicReporterIdentifier: 'Kisan Mitra, Kanke Block',
    },
    crowdfunding: {
      id: 'cf-bau-04',
      targetAmount: 60000,
      raisedAmount: 60000,
      backersCount: 51,
      is80GEligible: true,
      escrowStatus: 'DISBURSED',
      donations: [
        { id: 'd-41', donorName: 'Jharkhand Organic Mission', amount: 40000, isCorporate: true, timestamp: '2026-08-22T10:00:00Z' },
        { id: 'd-42', donorName: 'Rotary Club of Ranchi', amount: 20000, isCorporate: true, timestamp: '2026-08-23T14:00:00Z' },
      ],
    },
    nssWorkflow: {
      nssUnitId: 'NSS-BAU-AGRI-07',
      coordinatorName: 'Dr. Pratibha Minz',
      loggedFieldHours: 65,
      targetFieldHours: 60,
      nepCreditsEligible: 4,
      status: 'CREDITS_AWARDED',
      resolutionPortfolio: {
        beforePhotoUrl: '/images/issues/crop_blight.jpg',
        afterPhotoUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop',
        fieldSummary: 'Biological control spraying of indigenous Trichoderma bio-culture formulated at BAU Plant Pathology Lab. Cured bacterial leaf blight across 40 hectares with 0% chemical residues.',
        completionDate: '2026-09-05',
        facultyEndorsement: 'Dr. Pratibha Minz (Dean of Agriculture) & Gram Sabha Head',
        blockchainHash: 'e839210948572019485720194857201938475610293847561029384756102938',
      },
    },
  }
];

export const INITIAL_LEDGER_BLOCKS: AuditBlock[] = [
  {
    index: 0,
    timestamp: 1725475200,
    previous_hash: '0000000000000000000000000000000000000000000000000000000000000000',
    ticket_id: 'GENESIS',
    action: 'INITIALIZE_JOHARSETU_LEDGER',
    data: {
      governing_body: 'Government of Jharkhand - Department of Higher & Technical Education',
      audit_protocol: 'NEP2020-Experiential-Ledger-v1.4',
      genesis_validator: 'Jharkhand State Higher Education Council'
    },
    hash: '0000a4b981d3ef189d2c1257ba9045bc118f679e432165cd8912ef34ca679234'
  },
  {
    index: 1,
    timestamp: 1725518400,
    previous_hash: '0000a4b981d3ef189d2c1257ba9045bc118f679e432165cd8912ef34ca679234',
    ticket_id: 'JS-DHN-2026-0042',
    action: 'AI_TRIAGE_AND_HEI_ROUTING',
    data: {
      ticket_code: 'JS-DHN-2026-0042',
      assigned_institution: 'IIT (ISM) Dhanbad',
      department: 'Department of Environmental Engineering',
      utility_score: 0.932,
      cv_confidence: 0.94
    },
    hash: '8f7a9321c7849e01823901bce4798a12dc6345981274bc93821034fe8923412a'
  },
  {
    index: 2,
    timestamp: 1725532800,
    previous_hash: '8f7a9321c7849e01823901bce4798a12dc6345981274bc93821034fe8923412a',
    ticket_id: 'JS-DHN-2026-0042',
    action: 'CSR_GRANT_COMMITTED',
    data: {
      corporate_partner: 'Coal India Limited (CSR Green Cell)',
      committed_amount_inr: 180000,
      tranche: 'Phase 1 - Lab Sorbent Fabrications'
    },
    hash: '4bc82931de67104829381023749abcdef1209384756182934059682736451029'
  },
  {
    index: 3,
    timestamp: 1725619200,
    previous_hash: '4bc82931de67104829381023749abcdef1209384756182934059682736451029',
    ticket_id: 'JS-DHN-2026-0042',
    action: 'MILESTONE_VERIFIED_AND_CREDITED',
    data: {
      milestone_sequence: 1,
      title: 'Field Sampling & Spectrophotometry Assay',
      verified_by: 'Prof. Alok Kumar Sinha & Gram Panchayat Head',
      nep_credits_awarded: 1
    },
    hash: 'e839210948572019485720194857201938475610293847561029384756102938'
  }
];

export const JHARKHAND_DISTRICT_STATS: DistrictMetric[] = [
  { name: 'Ranchi', lat: 23.3441, lon: 85.3096, activeTickets: 42, resolved: 89, heis: ['BIT Mesra', 'BAU Ranchi', 'Ranchi University'], urgencyRate: 'Moderate' },
  { name: 'Dhanbad', lat: 23.8145, lon: 86.4412, activeTickets: 38, resolved: 74, heis: ['IIT (ISM) Dhanbad', 'BIT Sindri'], urgencyRate: 'Severe' },
  { name: 'East Singhbhum', lat: 22.8046, lon: 86.2029, activeTickets: 31, resolved: 82, heis: ['NIT Jamshedpur', 'MGMC Jsr'], urgencyRate: 'High' },
  { name: 'Bokaro', lat: 23.6693, lon: 86.1511, activeTickets: 24, resolved: 51, heis: ['Bokaro Steel City College'], urgencyRate: 'Moderate' },
  { name: 'Hazaribagh', lat: 23.9925, lon: 85.3637, activeTickets: 19, resolved: 43, heis: ['Vinoba Bhave University'], urgencyRate: 'Moderate' },
  { name: 'Dumka', lat: 24.2676, lon: 87.2486, activeTickets: 28, resolved: 39, heis: ['Sido Kanhu Murmu University'], urgencyRate: 'High' },
  { name: 'Deoghar', lat: 24.4826, lon: 86.7000, activeTickets: 18, resolved: 40, heis: ['AIIMS Deoghar', 'BIT Deoghar'], urgencyRate: 'Low' },
  { name: 'Palamu', lat: 24.0416, lon: 84.0722, activeTickets: 22, resolved: 35, heis: ['Nilamber-Pitamber University'], urgencyRate: 'Moderate' },
  { name: 'Giridih', lat: 24.1903, lon: 86.3006, activeTickets: 25, resolved: 31, heis: ['Giridih College'], urgencyRate: 'Moderate' },
  { name: 'West Singhbhum', lat: 22.5539, lon: 85.8080, activeTickets: 29, resolved: 28, heis: ['Kolhan University'], urgencyRate: 'Severe' },
  { name: 'Ramgarh', lat: 23.6264, lon: 85.5126, activeTickets: 15, resolved: 34, heis: ['Ramgarh Engineering College'], urgencyRate: 'Low' },
  { name: 'Khunti', lat: 23.0735, lon: 85.2774, activeTickets: 21, resolved: 27, heis: ['Birsa College Khunti'], urgencyRate: 'High' },
  { name: 'Gumla', lat: 23.0440, lon: 84.5414, activeTickets: 19, resolved: 26, heis: ['Kartik Oraon College'], urgencyRate: 'Moderate' },
  { name: 'Lohardaga', lat: 23.4418, lon: 84.6784, activeTickets: 12, resolved: 23, heis: ['BS College Lohardaga'], urgencyRate: 'Low' },
  { name: 'Simdega', lat: 22.6167, lon: 84.5167, activeTickets: 16, resolved: 20, heis: ['Simdega College'], urgencyRate: 'Moderate' },
  { name: 'Latehar', lat: 23.7431, lon: 84.5028, activeTickets: 17, resolved: 19, heis: ['Govt Polytechnic Latehar'], urgencyRate: 'Moderate' },
  { name: 'Garhwa', lat: 24.1600, lon: 83.8100, activeTickets: 18, resolved: 22, heis: ['Govt Degree College Garhwa'], urgencyRate: 'Moderate' },
  { name: 'Chatra', lat: 24.2100, lon: 84.8700, activeTickets: 15, resolved: 24, heis: ['Chatra College'], urgencyRate: 'Low' },
  { name: 'Koderma', lat: 24.4674, lon: 85.5947, activeTickets: 13, resolved: 30, heis: ['JJ College Koderma'], urgencyRate: 'Low' },
  { name: 'Jamtara', lat: 23.9634, lon: 86.8016, activeTickets: 14, resolved: 21, heis: ['Jamtara College'], urgencyRate: 'Low' },
  { name: 'Godda', lat: 24.8267, lon: 87.2144, activeTickets: 16, resolved: 25, heis: ['Godda College'], urgencyRate: 'Low' },
  { name: 'Pakur', lat: 24.6333, lon: 87.8500, activeTickets: 20, resolved: 18, heis: ['Pakur Polytechnic'], urgencyRate: 'High' },
  { name: 'Sahebganj', lat: 25.2500, lon: 87.6500, activeTickets: 22, resolved: 26, heis: ['Sahibganj College'], urgencyRate: 'Moderate' },
  { name: 'Saraikela', lat: 22.6989, lon: 85.9328, activeTickets: 14, resolved: 29, heis: ['Govt Polytechnic Saraikela'], urgencyRate: 'Low' }
];

export const MOCK_HEI_DIRECTORY: HeiDirectoryEntry[] = [
  {
    id: 'hei-ism',
    name: 'Indian Institute of Technology (ISM) Dhanbad',
    code: 'IITISM',
    type: 'Institute of National Importance',
    district: 'Dhanbad',
    nirfRank: 42,
    nirfScore: 58.4,
    address: 'Police Line, Sardar Patel Nagar, Dhanbad, Jharkhand 826004',
    website: 'https://www.iitism.ac.in',
    facultyLead: 'Prof. Alok Kumar Sinha',
    facultyEmail: 'aloksinha@iitism.ac.in',
    facultyPhone: '+91 326 223 5400',
    activeStudentVolunteers: 148,
    activeCapstones: 14,
    resolvedProblems: 38,
    societalImpactScore: 945,
    avgResolutionDays: 16.4,
    nepCreditsAwarded: 152,
    state: 'Jharkhand',
    totalCsrDonationsINR: 5200000,
    assignedJurisdiction: ['Baghmara Block', 'Govindpur Block', 'Nirsa Block', 'Tundi Block'],
    crcConnections: ['Coal India Limited (CSR Green Cell)', 'Tata Steel Foundation', 'BCCL Community Wing']
  },
  {
    id: 'hei-bit-mesra',
    name: 'Birla Institute of Technology, Mesra',
    code: 'BITM',
    type: 'Deemed to be University',
    district: 'Ranchi',
    nirfRank: 53,
    nirfScore: 54.2,
    address: 'Mesra, Ranchi, Jharkhand 835215',
    website: 'https://www.bitmesra.ac.in',
    facultyLead: 'Dr. Ananya Sen',
    facultyEmail: 'ananya.sen@bitmesra.ac.in',
    facultyPhone: '+91 651 227 5444',
    activeStudentVolunteers: 124,
    activeCapstones: 12,
    resolvedProblems: 34,
    societalImpactScore: 915,
    avgResolutionDays: 18.2,
    nepCreditsAwarded: 136,
    state: 'Jharkhand',
    totalCsrDonationsINR: 3850000,
    assignedJurisdiction: ['Kanke Block', 'Namkum Block', 'Angara Block', 'Ormanjhi Block'],
    crcConnections: ['Tata Steel Foundation', 'Jindal Steel & Power Foundation', 'JSMC Smart City CSR']
  },
  {
    id: 'hei-nit-jsr',
    name: 'National Institute of Technology, Jamshedpur',
    code: 'NITJSR',
    type: 'Institute of National Importance',
    district: 'East Singhbhum',
    nirfRank: 86,
    nirfScore: 49.1,
    address: 'Adityapur, Jamshedpur, Jharkhand 831014',
    website: 'https://www.nitjsr.ac.in',
    facultyLead: 'Prof. R. K. Prasad',
    facultyEmail: 'rkprasad.civil@nitjsr.ac.in',
    facultyPhone: '+91 657 237 3407',
    activeStudentVolunteers: 96,
    activeCapstones: 9,
    resolvedProblems: 29,
    societalImpactScore: 870,
    avgResolutionDays: 21.0,
    nepCreditsAwarded: 116,
    state: 'Jharkhand',
    totalCsrDonationsINR: 3400000,
    assignedJurisdiction: ['Ghatshila Block', 'Potka Block', 'Patamda Block', 'Golmuri'],
    crcConnections: ['Tata Motors CSR', 'Tata Steel Foundation', 'Uranium Corp India Ltd (UCIL)']
  },
  {
    id: 'hei-bau',
    name: 'Birsa Agricultural University',
    code: 'BAU',
    type: 'State Agricultural University',
    district: 'Ranchi',
    nirfScore: 44.8,
    address: 'Kanke, Ranchi, Jharkhand 834006',
    website: 'https://www.bauranchi.org',
    facultyLead: 'Dr. S. K. Mahato',
    facultyEmail: 'skmahato.soil@bauranchi.org',
    facultyPhone: '+91 651 245 0626',
    activeStudentVolunteers: 78,
    activeCapstones: 8,
    resolvedProblems: 22,
    societalImpactScore: 825,
    avgResolutionDays: 24.5,
    nepCreditsAwarded: 88,
    state: 'Jharkhand',
    totalCsrDonationsINR: 2200000,
    assignedJurisdiction: ['Mandar Block', 'Bero Block', 'Itki Block', 'Lapung Block'],
    crcConnections: ['Jindal Steel CSR', 'NABARD Rural Innovation Fund']
  },
  {
    id: 'hei-bit-sindri',
    name: 'Birsa Institute of Technology, Sindri',
    code: 'BITSINDRI',
    type: 'State Autonomous Engineering College',
    district: 'Dhanbad',
    nirfScore: 42.5,
    address: 'Sindri, Dhanbad, Jharkhand 828123',
    website: 'https://www.bitsindri.ac.in',
    facultyLead: 'Dr. D. K. Singh',
    facultyEmail: 'director@bitsindri.ac.in',
    facultyPhone: '+91 326 235 0495',
    activeStudentVolunteers: 82,
    activeCapstones: 7,
    resolvedProblems: 25,
    societalImpactScore: 795,
    avgResolutionDays: 19.8,
    nepCreditsAwarded: 100,
    state: 'Jharkhand',
    totalCsrDonationsINR: 2500000,
    assignedJurisdiction: ['Sindri NAC', 'Baliapur Block', 'Jharia Block'],
    crcConnections: ['SAIL Bokaro Steel Plant CSR', 'BCCL Dhanbad']
  },
  {
    id: 'hei-aiims-deoghar',
    name: 'All India Institute of Medical Sciences (AIIMS) Deoghar',
    code: 'AIIMSDEO',
    type: 'Institute of National Importance (Medical)',
    district: 'Deoghar',
    nirfScore: 51.0,
    address: 'Devipur, Rohini, Deoghar, Jharkhand 814152',
    website: 'https://www.aiimsdeoghar.edu.in',
    facultyLead: 'Dr. Saurabh Mishra',
    facultyEmail: 'dr.smishra@aiimsdeoghar.edu.in',
    facultyPhone: '+91 643 229 1100',
    activeStudentVolunteers: 52,
    activeCapstones: 6,
    resolvedProblems: 18,
    societalImpactScore: 860,
    avgResolutionDays: 14.1,
    nepCreditsAwarded: 72,
    state: 'Jharkhand',
    totalCsrDonationsINR: 2800000,
    assignedJurisdiction: ['Devipur Block', 'Sarwan Block', 'Mohanpur Block'],
    crcConnections: ['Adani Foundation CSR', 'National Health Mission Jharkhand']
  },
  {
    id: 'hei-skmu',
    name: 'Sido Kanhu Murmu University',
    code: 'SKMU',
    type: 'State University',
    district: 'Dumka',
    nirfScore: 38.6,
    address: 'Santhal Pargana, Dumka, Jharkhand 814110',
    website: 'https://www.skmu.ac.in',
    facultyLead: 'Dr. Sunita Soren',
    facultyEmail: 'sunita.soren@skmu.ac.in',
    facultyPhone: '+91 643 422 2495',
    activeStudentVolunteers: 64,
    activeCapstones: 6,
    resolvedProblems: 19,
    societalImpactScore: 765,
    avgResolutionDays: 26.2,
    nepCreditsAwarded: 76,
    state: 'Jharkhand',
    totalCsrDonationsINR: 1800000,
    assignedJurisdiction: ['Dumka Sadar', 'Shikaripara Block', 'Kathikund Block', 'Ranishwar'],
    crcConnections: ['NTPC CSR Tribal Welfare', 'Jharkhand Tribal Welfare Commission']
  },
  {
    id: 'hei-npu',
    name: 'Nilamber-Pitamber University',
    code: 'NPU',
    type: 'State University',
    district: 'Palamu',
    nirfScore: 36.2,
    address: 'Medininagar, Palamu, Jharkhand 822101',
    website: 'https://www.npu.ac.in',
    facultyLead: 'Dr. V. K. Verma',
    facultyEmail: 'vkverma@npu.ac.in',
    facultyPhone: '+91 656 222 2011',
    activeStudentVolunteers: 46,
    activeCapstones: 5,
    resolvedProblems: 14,
    societalImpactScore: 710,
    avgResolutionDays: 28.0,
    nepCreditsAwarded: 56,
    state: 'Jharkhand',
    totalCsrDonationsINR: 1500000,
    assignedJurisdiction: ['Medininagar', 'Chainpur Block', 'Lesliganj Block', 'Satbarwa'],
    crcConnections: ['Hindalco Industries CSR', 'Aditya Birla Group Rural Development']
  }
];

export const MOCK_CRC_DIRECTORY: CrcDirectoryEntry[] = [
  {
    id: 'crc-tata-steel',
    companyName: 'Tata Steel CSR Foundation',
    brandTag: 'Tata Steel - Corporate Social Responsibility',
    csrDirector: 'Rajeev Sharma',
    contactEmail: 'csr.jharkhand@tatasteel.com',
    contactPhone: '+91 657 664 4500',
    regionalFocus: ['East Singhbhum', 'Saraikela', 'West Singhbhum', 'Ramgarh'],
    totalPledgedINR: 4500000,
    totalDisbursedINR: 3850000,
    activeSchemes: [
      {
        title: 'Project Jalshala: Rural Potable Water Micro-Filtration',
        focusTheme: 'WATER_MANAGEMENT',
        grantPerProjectINR: 250000,
        description: 'Co-funding engineering capstones for membrane filtration, solar-powered borewells, and iron arsenic removal systems.'
      },
      {
        title: 'Gram Swasthya: Tele-Medicine Diagnostic Kiosks',
        focusTheme: 'HEALTHCARE_DELIVERY',
        grantPerProjectINR: 300000,
        description: 'Enabling medical and IoT engineering students to prototype solar-backed health diagnostics for tribal remote hamlets.'
      }
    ],
    sponsoredTicketsCount: 14,
    taxCertificates80GCount: 14,
    communitiesImpactedCount: 32
  },
  {
    id: 'crc-coal-india',
    companyName: 'Coal India Limited (CSR Green Cell)',
    brandTag: 'Coal India Ltd / BCCL / CCL',
    csrDirector: 'S. C. Bhattacharya',
    contactEmail: 'csr.cell@coalindia.in',
    contactPhone: '+91 33 2324 5555',
    regionalFocus: ['Dhanbad', 'Bokaro', 'Ranchi', 'Ramgarh'],
    totalPledgedINR: 6000000,
    totalDisbursedINR: 5200000,
    activeSchemes: [
      {
        title: 'Mine-Water Reclamation & Community Aquifer Rejuvenation',
        focusTheme: 'WATER_MANAGEMENT',
        grantPerProjectINR: 350000,
        description: 'Grant scheme for converting overburden pit discharge water into WHO-standard drinking water for adjacent colliery villages.'
      },
      {
        title: 'Shiksha Setu Digital Solar Classrooms',
        focusTheme: 'PRIMARY_EDUCATION_DIGITAL',
        grantPerProjectINR: 200000,
        description: 'Providing student teams with electronics and tablet endowments for government schools lacking uninterrupted grid power.'
      }
    ],
    sponsoredTicketsCount: 18,
    taxCertificates80GCount: 18,
    communitiesImpactedCount: 45
  },
  {
    id: 'crc-jindal-steel',
    companyName: 'Jindal Steel & Power Foundation',
    brandTag: 'JSP Foundation',
    csrDirector: 'Meenakshi Roy',
    contactEmail: 'csr@jindalsteel.com',
    contactPhone: '+91 11 4146 2000',
    regionalFocus: ['Ramgarh', 'Ranchi', 'Hazaribagh'],
    totalPledgedINR: 3000000,
    totalDisbursedINR: 2400000,
    activeSchemes: [
      {
        title: 'Surya Jyoti Rural Micro-Grids',
        focusTheme: 'RURAL_ELECTRIFICATION_SOLAR',
        grantPerProjectINR: 220000,
        description: 'Decentralized 5kW solar mini-grids for off-grid tribal hamlets managed through smart student-developed telemetry.'
      },
      {
        title: 'Kisan Sampada Cold-Storage Chain',
        focusTheme: 'SUSTAINABLE_AGRICULTURE',
        grantPerProjectINR: 280000,
        description: 'Peltier-based low-cost cold boxes designed by agriculture and mechanical student teams to prevent vegetable post-harvest decay.'
      }
    ],
    sponsoredTicketsCount: 9,
    taxCertificates80GCount: 9,
    communitiesImpactedCount: 22
  },
  {
    id: 'crc-ntpc',
    companyName: 'NTPC Tribal Empowerment Grant',
    brandTag: 'NTPC CSR Foundation',
    csrDirector: 'Alok Ranjan',
    contactEmail: 'csr.eastern@ntpc.co.in',
    contactPhone: '+91 654 626 8000',
    regionalFocus: ['Hazaribagh', 'Chatra', 'Dumka'],
    totalPledgedINR: 2500000,
    totalDisbursedINR: 2000000,
    activeSchemes: [
      {
        title: 'Swachh Gram Bio-Digester Initiatives',
        focusTheme: 'SANITATION_WASTE',
        grantPerProjectINR: 180000,
        description: 'Installation and maintenance validation of community biogas units linked to public school restrooms.'
      }
    ],
    sponsoredTicketsCount: 8,
    taxCertificates80GCount: 8,
    communitiesImpactedCount: 18
  },
  {
    id: 'crc-adani',
    companyName: 'Adani Solar Rural Energy Grant',
    brandTag: 'Adani Foundation Jharkhand',
    csrDirector: 'Vikramaditya Sen',
    contactEmail: 'csr.jharkhand@adani.com',
    contactPhone: '+91 79 2656 5555',
    regionalFocus: ['Godda', 'Sahebganj', 'Deoghar'],
    totalPledgedINR: 3500000,
    totalDisbursedINR: 2800000,
    activeSchemes: [
      {
        title: 'Krishi Jal Solar Irrigation Lift',
        focusTheme: 'SUSTAINABLE_AGRICULTURE',
        grantPerProjectINR: 300000,
        description: 'Submersible solar pump sets paired with drip irrigation lines engineered and field-validated by agricultural students.'
      }
    ],
    sponsoredTicketsCount: 11,
    taxCertificates80GCount: 11,
    communitiesImpactedCount: 28
  }
];

export const MOCK_STUDENT_LEADERBOARD: StudentLeaderboardEntry[] = [
  {
    id: 'stud-01',
    name: 'Pooja Murmu',
    rollNo: '22JE0451',
    heiName: 'IIT (ISM) Dhanbad',
    heiCode: 'IITISM',
    district: 'Dhanbad',
    fieldHoursLogged: 142,
    resolvedTasksCount: 8,
    nepCreditsEarned: 4,
    department: 'Department of Environmental Engineering',
    state: 'Jharkhand',
    specialization: 'Environmental Engineering & Hydro-Chemical Filtration',
    badge: 'GOLD',
    rank: 1
  },
  {
    id: 'stud-02',
    name: 'Rahul Verma',
    rollNo: '2022-BT-CSE-042',
    heiName: 'BIT Mesra',
    heiCode: 'BITM',
    district: 'Ranchi',
    fieldHoursLogged: 128,
    resolvedTasksCount: 7,
    nepCreditsEarned: 4,
    department: 'Department of Computer Science & Engineering',
    state: 'Jharkhand',
    specialization: 'IoT Telemetry & Edge Sensor Networks',
    badge: 'SILVER',
    rank: 2
  },
  {
    id: 'stud-03',
    name: 'Sunita Kisku',
    rollNo: '21NITJ-CIV-089',
    heiName: 'NIT Jamshedpur',
    heiCode: 'NITJSR',
    district: 'East Singhbhum',
    fieldHoursLogged: 115,
    resolvedTasksCount: 6,
    nepCreditsEarned: 4,
    department: 'Department of Civil Engineering',
    state: 'Jharkhand',
    specialization: 'Rural Road Materials & Stormwater Drainage',
    badge: 'BRONZE',
    rank: 3
  },
  {
    id: 'stud-04',
    name: 'Aniket Soren',
    rollNo: '23MT0114',
    heiName: 'IIT (ISM) Dhanbad',
    heiCode: 'IITISM',
    district: 'Dhanbad',
    fieldHoursLogged: 96,
    resolvedTasksCount: 5,
    nepCreditsEarned: 3,
    department: 'Department of Mining & Earth Sciences',
    state: 'Jharkhand',
    specialization: 'Tribal Community Liaison & Geospatial Mapping',
    badge: 'FIELD_STAR',
    rank: 4
  },
  {
    id: 'stud-05',
    name: 'Priya Kumari',
    rollNo: '22BAU-AGR-019',
    heiName: 'Birsa Agricultural University',
    heiCode: 'BAU',
    district: 'Ranchi',
    fieldHoursLogged: 88,
    resolvedTasksCount: 4,
    nepCreditsEarned: 3,
    department: 'Department of Agricultural Sciences',
    state: 'Jharkhand',
    specialization: 'Soil Moisture Sensors & Organic Crop Remediation',
    badge: 'FIELD_STAR',
    rank: 5
  },
  {
    id: 'stud-06',
    name: 'Amit Kumar Das',
    rollNo: '21BITS-EE-104',
    heiName: 'BIT Sindri',
    heiCode: 'BITSINDRI',
    district: 'Dhanbad',
    fieldHoursLogged: 82,
    resolvedTasksCount: 4,
    nepCreditsEarned: 2,
    department: 'Department of Electrical Engineering',
    state: 'Jharkhand',
    specialization: 'Solar Micro-Inverters & High-Tension Fault Detectors',
    badge: 'FIELD_STAR',
    rank: 6
  }
];

export const MOCK_PUBLIC_SENTIMENT: PublicSentimentMetric = {
  overallSentiment: 'SATISFIED',
  urgentDistressedPct: 18,
  neutralPct: 34,
  positivePraisePct: 48,
  totalSocialShares: 14890,
  whatsappShares: 8420,
  instagramShares: 4110,
  xShares: 2360,
  viralMultiplier: 2.8,
  trendingHashtags: [
    '#JoharSetu',
    '#BaghmaraCleanWater',
    '#HEIActionJharkhand',
    '#SIH2026',
    '#StudentChangemakers',
    '#PanchayatTech'
  ],
  moderationFlagsCount: 3
};

export const MOCK_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'usr-cit-01',
    registrationId: 'JH-REG-2026-1042',
    fullName: 'Mangal Soren',
    phone: '+91 94311 82910',
    email: 'mangal.soren@joharsetu.in',
    role: 'CITIZEN',
    district: 'Dhanbad',
    block: 'Baghmara Block',
    panchayat: 'Baghmara Panchayat',
    designation: 'Gram Resident & Civic Advocate',
    status: 'ACTIVE',
    joinedDate: '2026-06-12',
    lastActive: '2026-09-08 19:42',
    verifiedAadhaar: true,
    activityMetric: { ticketsReported: 5, tasksResolved: 3 }
  },
  {
    id: 'usr-stud-01',
    registrationId: 'JH-REG-2026-2001',
    fullName: 'Pooja Murmu',
    phone: '+91 94311 20451',
    email: 'pooja.murmu@iitism.ac.in',
    role: 'STUDENT',
    district: 'Dhanbad',
    organization: 'IIT (ISM) Dhanbad',
    department: 'Department of Environmental Engineering',
    designation: 'B.Tech Environmental (Roll: 22JE0451)',
    status: 'ACTIVE',
    joinedDate: '2026-07-01',
    lastActive: '2026-09-08 21:15',
    verifiedAadhaar: true,
    activityMetric: { hoursLogged: 142, tasksResolved: 8 }
  },
  {
    id: 'usr-stud-02',
    registrationId: 'JH-REG-2026-2042',
    fullName: 'Rahul Verma',
    phone: '+91 94311 22222',
    email: 'student@bitmesra.ac.in',
    role: 'STUDENT',
    district: 'Ranchi',
    organization: 'Birla Institute of Technology (BIT) Mesra',
    department: 'Department of Computer Science & IoT',
    designation: 'B.Tech CSE (Roll: 2022-BT-CSE-042)',
    status: 'ACTIVE',
    joinedDate: '2026-07-10',
    lastActive: '2026-09-08 20:50',
    verifiedAadhaar: true,
    activityMetric: { hoursLogged: 128, tasksResolved: 7 }
  },
  {
    id: 'usr-stud-03',
    registrationId: 'JH-REG-2026-2089',
    fullName: 'Sunita Kisku',
    phone: '+91 94311 21089',
    email: 'sunita.kisku@nitjsr.ac.in',
    role: 'STUDENT',
    district: 'East Singhbhum',
    organization: 'National Institute of Technology, Jamshedpur',
    department: 'Department of Civil Engineering',
    designation: 'B.Tech Civil (Roll: 21NITJ-CIV-089)',
    status: 'ACTIVE',
    joinedDate: '2026-07-15',
    lastActive: '2026-09-08 17:30',
    verifiedAadhaar: true,
    activityMetric: { hoursLogged: 115, tasksResolved: 6 }
  },
  {
    id: 'usr-fac-01',
    registrationId: 'JH-REG-2026-3001',
    fullName: 'Dr. Ananya Sen',
    phone: '+91 94311 88888',
    email: 'faculty@bitmesra.ac.in',
    role: 'FACULTY_MENTOR',
    district: 'Ranchi',
    organization: 'Birla Institute of Technology (BIT) Mesra',
    department: 'Department of Experiential Learning & Civil Systems',
    designation: 'Professor & Dean of Experiential Learning Capstones',
    status: 'ACTIVE',
    joinedDate: '2026-05-20',
    lastActive: '2026-09-08 21:05',
    verifiedAadhaar: true,
    activityMetric: { tasksResolved: 12 }
  },
  {
    id: 'usr-fac-02',
    registrationId: 'JH-REG-2026-3042',
    fullName: 'Prof. Alok Kumar Sinha',
    phone: '+91 326 223 5400',
    email: 'aloksinha@iitism.ac.in',
    role: 'FACULTY_MENTOR',
    district: 'Dhanbad',
    organization: 'IIT (ISM) Dhanbad',
    department: 'Department of Environmental Engineering',
    designation: 'Head of Water Technology Laboratory',
    status: 'ACTIVE',
    joinedDate: '2026-05-15',
    lastActive: '2026-09-08 18:40',
    verifiedAadhaar: true,
    activityMetric: { tasksResolved: 14 }
  },
  {
    id: 'usr-pan-01',
    registrationId: 'JH-REG-2026-4001',
    fullName: 'B. K. Mahto',
    phone: '+91 94311 33333',
    email: 'panchayat@baghmara.gov.in',
    role: 'PANCHAYAT_OFFICER',
    district: 'Dhanbad',
    block: 'Baghmara Block',
    panchayat: 'Baghmara Gram Panchayat',
    designation: 'Panchayat Secretary & Designated Rural Nodal Officer',
    status: 'ACTIVE',
    joinedDate: '2026-06-01',
    lastActive: '2026-09-08 20:15',
    verifiedAadhaar: true,
    activityMetric: { ticketsReported: 18, tasksResolved: 14 }
  },
  {
    id: 'usr-pan-02',
    registrationId: 'JH-REG-2026-4015',
    fullName: 'Sarita Tudu',
    phone: '+91 94311 44415',
    email: 'panchayat.dumka@jharkhand.gov.in',
    role: 'PANCHAYAT_OFFICER',
    district: 'Dumka',
    block: 'Shikaripara Block',
    panchayat: 'Mohanpur Gram Panchayat',
    designation: 'Gram Panchayat Mukhiya',
    status: 'ACTIVE',
    joinedDate: '2026-06-18',
    lastActive: '2026-09-07 16:20',
    verifiedAadhaar: true,
    activityMetric: { ticketsReported: 9, tasksResolved: 6 }
  },
  {
    id: 'usr-csr-01',
    registrationId: 'JH-REG-2026-5001',
    fullName: 'Rajeev Sharma',
    phone: '+91 94311 77777',
    email: 'csr@tatasteel.com',
    role: 'INDUSTRY_CSR',
    district: 'East Singhbhum',
    organization: 'Tata Steel Rural Development Society (TSRDS)',
    designation: 'Director of Corporate Social Responsibility & Co-Financing',
    status: 'ACTIVE',
    joinedDate: '2026-05-10',
    lastActive: '2026-09-08 15:45',
    verifiedAadhaar: true,
    activityMetric: { fundsPledgedINR: 4500000, tasksResolved: 14 }
  },
  {
    id: 'usr-csr-02',
    registrationId: 'JH-REG-2026-5022',
    fullName: 'S. C. Bhattacharya',
    phone: '+91 33 2324 5555',
    email: 'csr.cell@coalindia.in',
    role: 'INDUSTRY_CSR',
    district: 'Dhanbad',
    organization: 'Coal India Limited (CSR Green Cell)',
    designation: 'Chief General Manager (CSR & Sustainable Dev)',
    status: 'ACTIVE',
    joinedDate: '2026-05-12',
    lastActive: '2026-09-08 16:30',
    verifiedAadhaar: true,
    activityMetric: { fundsPledgedINR: 6000000, tasksResolved: 18 }
  },
  {
    id: 'usr-gov-01',
    registrationId: 'JH-REG-2026-6001',
    fullName: 'Dr. Rajeshwar Soren, IAS',
    phone: '+91 94311 99999',
    email: 'admin@jharkhand.gov.in',
    role: 'GOVT_OFFICER',
    district: 'Ranchi',
    organization: 'Department of Higher & Technical Education',
    designation: 'State Director & Nodal Secretary',
    status: 'ACTIVE',
    joinedDate: '2026-04-01',
    lastActive: '2026-09-08 21:30',
    verifiedAadhaar: true,
    activityMetric: { tasksResolved: 48 }
  },
  {
    id: 'usr-cit-02',
    registrationId: 'JH-REG-2026-1089',
    fullName: 'Sunita Devi',
    phone: '+91 94311 81089',
    email: 'sunita.kanke@gmail.com',
    role: 'CITIZEN',
    district: 'Ranchi',
    block: 'Kanke Block',
    panchayat: 'Arsande Panchayat',
    designation: 'Resident & Mahila Samiti Lead',
    status: 'ACTIVE',
    joinedDate: '2026-06-25',
    lastActive: '2026-09-06 14:10',
    verifiedAadhaar: true,
    activityMetric: { ticketsReported: 3, tasksResolved: 2 }
  },
  {
    id: 'usr-cit-03',
    registrationId: 'JH-REG-2026-1199',
    fullName: 'Vikas Kumar',
    phone: '+91 94311 99199',
    email: 'vikas.bad@spammail.com',
    role: 'CITIZEN',
    district: 'Dhanbad',
    block: 'Jharia Block',
    designation: 'Individual Citizen',
    status: 'SUSPENDED',
    joinedDate: '2026-08-01',
    lastActive: '2026-08-20 11:00',
    verifiedAadhaar: false,
    activityMetric: { ticketsReported: 0, tasksResolved: 0 }
  }
];

