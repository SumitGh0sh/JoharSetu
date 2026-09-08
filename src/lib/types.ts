export type UserRole = 
  | 'CITIZEN' 
  | 'PANCHAYAT_OFFICER' 
  | 'STUDENT' 
  | 'FACULTY_MENTOR' 
  | 'DEPT_HEAD' 
  | 'INDUSTRY_CSR' 
  | 'GOVT_OFFICER';

export type TicketCategory = 
  | 'WATER_MANAGEMENT' 
  | 'SANITATION_WASTE' 
  | 'RURAL_ELECTRIFICATION_SOLAR' 
  | 'SUSTAINABLE_AGRICULTURE' 
  | 'HEALTHCARE_DELIVERY' 
  | 'ROAD_INFRASTRUCTURE' 
  | 'PRIMARY_EDUCATION_DIGITAL' 
  | 'FORESTRY_ENVIRONMENT';

export type TicketStatus = 
  | 'SUBMITTED' 
  | 'AI_VERIFIED' 
  | 'AI_ROUTED' 
  | 'ACCEPTED_BY_HEI' 
  | 'IN_PROGRESS' 
  | 'PROTOTYPE_DEPLOYED' 
  | 'FIELD_TESTED' 
  | 'RESOLVED';

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TicketComment {
  id: string;
  authorName: string;
  authorRole?: 'CITIZEN' | 'STUDENT_LEAD' | 'FACULTY_MENTOR' | 'CSR_SPONSOR' | 'GOVT_OFFICER';
  authorAffiliation?: string;
  text: string;
  createdAt: string;
  isOfficial?: boolean;
}

export interface SocialEngagement {
  upvotes: number;
  hasUpvoted?: boolean;
  shares: number;
  commentsCount: number;
  comments: TicketComment[];
  hypeScore?: number;
  trendingBadge?: string;
}

export interface CitizenPrivacySettings {
  isAnonymous?: boolean;
  publicReporterIdentifier?: string;
}

export interface CrowdfundDonation {
  id: string;
  donorName: string;
  amount: number;
  isCorporate?: boolean;
  isAnonymous?: boolean;
  timestamp: string;
}

export interface CrowdfundingCampaign {
  id: string;
  targetAmount: number;
  raisedAmount: number;
  backersCount: number;
  is80GEligible: boolean;
  escrowStatus: 'OPEN' | 'MILESTONE_LOCKED' | 'DISBURSED';
  corporateMatch?: {
    company: string;
    ratio: string;
    active: boolean;
  };
  donations: CrowdfundDonation[];
}

export interface NssWorkflow {
  nssUnitId: string;
  coordinatorName: string;
  loggedFieldHours: number;
  targetFieldHours: number;
  nepCreditsEligible: number;
  status: 'ASSIGNED' | 'HOURS_LOGGED' | 'VERIFIED' | 'CREDITS_AWARDED';
  resolutionPortfolio?: {
    beforePhotoUrl: string;
    afterPhotoUrl: string;
    fieldSummary: string;
    completionDate: string;
    facultyEndorsement: string;
    blockchainHash: string;
  };
}

export interface ProblemTicket {
  id: string;
  ticketCode: string;
  title: string;
  description: string;
  category: TicketCategory;
  urgency: UrgencyLevel;
  status: TicketStatus;
  latitude: number;
  longitude: number;
  district: string;
  village: string;
  reporterName: string;
  reporterPhone: string;
  reportedAt: string;
  imageUrls: string[];
  audioUrl?: string;
  aiVerification?: {
    confidence: number;
    detectedObjects: Array<{ label: string; confidence: number }>;
    severityScore: number;
  };
  assignedHei?: {
    id: string;
    name: string;
    code: string;
    department: string;
    facultyMentor?: string;
    distanceKm: number;
    utilityScore: number;
    routingReason: string;
  };
  projectTeam?: {
    id: string;
    teamName: string;
    facultyLead: string;
    students: Array<{ name: string; role: string; rollNo: string; creditsClaimed: boolean }>;
    nepCredits: number;
    milestones: Milestone[];
    sponsors: Array<{ company: string; amount: number; status: string }>;
  };
  socialEngagement?: SocialEngagement;
  privacySettings?: CitizenPrivacySettings;
  crowdfunding?: CrowdfundingCampaign;
  nssWorkflow?: NssWorkflow;
}

export interface Milestone {
  id: string;
  sequence: number;
  title: string;
  targetDate: string;
  completedDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED';
  proofUrl?: string;
  sha256Hash?: string;
}

export interface AuditBlock {
  index: number;
  timestamp: number;
  previous_hash: string;
  ticket_id: string;
  action: string;
  data: Record<string, any>;
  hash: string;
}

export interface DistrictMetric {
  name: string;
  lat: number;
  lon: number;
  activeTickets: number;
  resolved: number;
  heis: string[];
  urgencyRate: 'Low' | 'Moderate' | 'High' | 'Severe';
}

export interface HeiDirectoryEntry {
  id: string;
  code: string;
  name: string;
  type: string;
  district: string;
  nirfRank?: number;
  nirfScore: number;
  address: string;
  website?: string;
  facultyLead: string;
  facultyEmail: string;
  facultyPhone: string;
  activeStudentVolunteers: number;
  activeCapstones: number;
  resolvedProblems: number;
  societalImpactScore: number; // 0 - 1000
  avgResolutionDays: number;
  nepCreditsAwarded: number;
  assignedJurisdiction: string[];
  crcConnections: string[];
  state?: string;
  totalCsrDonationsINR?: number;
}

export interface CrcDirectoryEntry {
  id: string;
  companyName: string;
  brandTag: string;
  csrDirector: string;
  contactEmail: string;
  contactPhone: string;
  regionalFocus: string[];
  totalPledgedINR: number;
  totalDisbursedINR: number;
  state?: string;
  activeSchemes: Array<{
    title: string;
    focusTheme: TicketCategory;
    grantPerProjectINR: number;
    description: string;
  }>;
  sponsoredTicketsCount: number;
  taxCertificates80GCount: number;
  communitiesImpactedCount: number;
}

export interface StudentLeaderboardEntry {
  id: string;
  name: string;
  rollNo: string;
  heiName: string;
  heiCode: string;
  department?: string;
  district: string;
  state?: string;
  avatarUrl?: string;
  fieldHoursLogged: number;
  resolvedTasksCount: number;
  nepCreditsEarned: number;
  specialization: string;
  badge: 'GOLD' | 'SILVER' | 'BRONZE' | 'FIELD_STAR';
  rank: number;
}

export interface ManagedUser {
  id: string;
  registrationId: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  district: string;
  block?: string;
  panchayat?: string;
  organization?: string;
  department?: string;
  designation?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'UNDER_REVIEW';
  joinedDate: string;
  lastActive: string;
  verifiedAadhaar: boolean;
  activityMetric?: {
    ticketsReported?: number;
    tasksResolved?: number;
    hoursLogged?: number;
    fundsPledgedINR?: number;
  };
}

export interface PublicSentimentMetric {
  overallSentiment: 'VERY_URGENT' | 'DISTRESSED' | 'NEUTRAL' | 'SATISFIED' | 'HIGHLY_POSITIVE';
  urgentDistressedPct: number;
  neutralPct: number;
  positivePraisePct: number;
  totalSocialShares: number;
  whatsappShares: number;
  instagramShares: number;
  xShares: number;
  viralMultiplier: number;
  trendingHashtags: string[];
  moderationFlagsCount: number;
}

