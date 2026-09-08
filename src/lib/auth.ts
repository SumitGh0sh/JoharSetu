import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'joharsetu_sih2026_super_secure_jwt_secret_jharkhand'
);

export const AUTH_COOKIE_NAME = 'joharsetu_token';

export interface UserSession {
  userId: string;
  phone: string;
  email?: string | null;
  fullName: string;
  role: string;
  district?: string | null;
}

// 1. Password Hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 2. JWT Signing
export async function signAuthToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// 3. JWT Verification (Edge-safe)
export async function verifyAuthToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      phone: payload.phone as string,
      email: (payload.email as string) || null,
      fullName: payload.fullName as string,
      role: payload.role as string,
      district: (payload.district as string) || null,
    };
  } catch {
    return null;
  }
}

// 4. Role to Portal Route Mapping
export function getPortalRouteForRole(role: string): string {
  switch (role) {
    case 'CITIZEN':
      return '/portal/citizen';
    case 'PANCHAYAT_OFFICER':
      return '/portal/panchayat';
    case 'STUDENT':
    case 'FACULTY_MENTOR':
    case 'DEPT_HEAD':
    case 'HEI_DIRECTOR':
      return '/portal/hei';
    case 'INDUSTRY_CSR':
      return '/portal/csr';
    case 'GOVT_OFFICER':
    case 'SUPER_ADMIN':
      return '/portal/admin';
    default:
      return '/portal/citizen';
  }
}

// 5. Server-side session retrieval
export async function getSessionFromCookies(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}
