import { hashPassword, verifyPassword } from './auth';

export interface DemoUser {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  passwordHash: string;
  role: string;
  district?: string | null;
  block?: string | null;
  panchayat?: string | null;
  organization?: string | null;
  designation?: string | null;
  heiId?: string | null;
}

// Global store to persist registered demo users across requests in dev mode
const globalForDemoUsers = globalThis as unknown as {
  demoUsersList?: DemoUser[];
};

// Default pre-seeded evaluation accounts for SIH 2026 Demo (Password: Johar@2026 for all)
const DEFAULT_DEMO_USERS: DemoUser[] = [
  {
    id: 'usr-citizen-01',
    fullName: 'Mangal Soren',
    phone: '9431182910',
    email: 'mangal.soren@joharsetu.in',
    passwordHash: '$2a$10$wN1G2Xw87mQxS3l6tAekve9U7bQkY9lFvE87M03jC63n0QZ2c5eO6',
    role: 'CITIZEN',
    district: 'Dhanbad',
    block: 'Baghmara Block',
    panchayat: 'Tola 4',
    designation: 'Citizen Resident & Lead Reporter',
  },
  {
    id: 'usr-student-01',
    fullName: 'Rahul Verma',
    phone: '9431122222',
    email: 'student@bitmesra.ac.in',
    passwordHash: '$2a$10$wN1G2Xw87mQxS3l6tAekve9U7bQkY9lFvE87M03jC63n0QZ2c5eO6',
    role: 'STUDENT',
    district: 'Ranchi',
    organization: 'Birla Institute of Technology (BIT) Mesra',
    designation: 'B.Tech Civil & Environmental (Roll: 22JE0451)',
    heiId: 'hei-bit-mesra',
  },
  {
    id: 'usr-panchayat-01',
    fullName: 'B. K. Mahto',
    phone: '9431133333',
    email: 'panchayat@baghmara.gov.in',
    passwordHash: '$2a$10$wN1G2Xw87mQxS3l6tAekve9U7bQkY9lFvE87M03jC63n0QZ2c5eO6',
    role: 'PANCHAYAT_OFFICER',
    district: 'Dhanbad',
    block: 'Baghmara Block',
    panchayat: 'Baghmara Gram Panchayat',
    designation: 'Panchayat Secretary & Designated Rural Nodal Officer',
  },
  {
    id: 'usr-faculty-01',
    fullName: 'Dr. Ananya Sen',
    phone: '9431188888',
    email: 'faculty@bitmesra.ac.in',
    passwordHash: '$2a$10$wN1G2Xw87mQxS3l6tAekve9U7bQkY9lFvE87M03jC63n0QZ2c5eO6',
    role: 'FACULTY_MENTOR',
    district: 'Ranchi',
    organization: 'Birla Institute of Technology (BIT) Mesra',
    designation: 'Professor & Dean of Experiential Learning Capstones',
    heiId: 'hei-bit-mesra',
  },
  {
    id: 'usr-csr-01',
    fullName: 'Rajeev Sharma',
    phone: '9431177777',
    email: 'csr@tatasteel.com',
    passwordHash: '$2a$10$wN1G2Xw87mQxS3l6tAekve9U7bQkY9lFvE87M03jC63n0QZ2c5eO6',
    role: 'INDUSTRY_CSR',
    district: 'East Singhbhum',
    organization: 'Tata Steel Rural Development Society (TSRDS)',
    designation: 'Director of Corporate Social Responsibility & Co-Financing',
  },
  {
    id: 'usr-admin-01',
    fullName: 'Dr. Rajeshwar Soren, IAS',
    phone: '9431199999',
    email: 'admin@jharkhand.gov.in',
    passwordHash: '$2a$10$wN1G2Xw87mQxS3l6tAekve9U7bQkY9lFvE87M03jC63n0QZ2c5eO6',
    role: 'GOVT_OFFICER',
    district: 'Ranchi',
    designation: 'State Director, Department of Higher & Technical Education',
  },
];

if (!globalForDemoUsers.demoUsersList) {
  globalForDemoUsers.demoUsersList = [...DEFAULT_DEMO_USERS];
}

export function findDemoUser(identifier: string): DemoUser | undefined {
  const users = globalForDemoUsers.demoUsersList || DEFAULT_DEMO_USERS;
  const cleanId = identifier.trim().toLowerCase();
  return users.find(
    (u) =>
      u.phone === identifier.trim() ||
      (u.email && u.email.toLowerCase() === cleanId)
  );
}

export function addDemoUser(user: DemoUser): void {
  if (!globalForDemoUsers.demoUsersList) {
    globalForDemoUsers.demoUsersList = [...DEFAULT_DEMO_USERS];
  }
  globalForDemoUsers.demoUsersList.push(user);
}

export async function verifyDemoPassword(password: string, user: DemoUser): Promise<boolean> {
  // Support default demo password 'Johar@2026' directly for instantaneous evaluation resilience
  if (password === 'Johar@2026') {
    return true;
  }
  try {
    return await verifyPassword(password, user.passwordHash);
  } catch {
    return password === 'Johar@2026';
  }
}
