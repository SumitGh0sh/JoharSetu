import prisma from './prisma';
import { hashPassword } from './auth';

async function seed() {
  console.log('[*] Seeding demo evaluation accounts into Supabase...');

  const defaultPassword = await hashPassword('Johar@2026');

  // 1. Citizen
  await prisma.user.upsert({
    where: { phone: '9431182910' },
    update: { passwordHash: defaultPassword },
    create: {
      fullName: 'Mangal Soren',
      phone: '9431182910',
      email: 'mangal.soren@joharsetu.in',
      passwordHash: defaultPassword,
      role: 'CITIZEN',
      district: 'Khunti',
      block: 'Torpa Block',
      panchayat: 'Tola 4',
    },
  });

  // 2. Govt Officer
  await prisma.user.upsert({
    where: { phone: '9431199999' },
    update: { passwordHash: defaultPassword },
    create: {
      fullName: 'Dr. Rajeshwar Soren, IAS',
      phone: '9431199999',
      email: 'admin@jharkhand.gov.in',
      passwordHash: defaultPassword,
      role: 'GOVT_OFFICER',
      district: 'Ranchi',
      designation: 'State Nodal Director, Higher & Technical Education',
    },
  });

  // 3. HEI Faculty Mentor
  await prisma.user.upsert({
    where: { phone: '9431188888' },
    update: { passwordHash: defaultPassword },
    create: {
      fullName: 'Prof. Alok Kumar Sinha',
      phone: '9431188888',
      email: 'faculty@bitmesra.ac.in',
      passwordHash: defaultPassword,
      role: 'FACULTY_MENTOR',
      designation: 'Dean of Experiential Learning',
    },
  });

  // 4. CSR Corporate Sponsor
  await prisma.user.upsert({
    where: { phone: '9431177777' },
    update: { passwordHash: defaultPassword },
    create: {
      fullName: 'Ananya Mukherjee',
      phone: '9431177777',
      email: 'csr@tatasteel.com',
      passwordHash: defaultPassword,
      role: 'INDUSTRY_CSR',
      organization: 'Tata Steel Rural Development Society (TSRDS)',
      designation: 'Chief of CSR Programs',
    },
  });

  console.log('[+] Seeding completed successfully!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
