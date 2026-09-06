import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signAuthToken, AUTH_COOKIE_NAME, getPortalRouteForRole } from '@/lib/auth';
import { findDemoUser, verifyDemoPassword } from '@/lib/demoUsersStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body; // identifier can be phone or email

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Phone/Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();

    // 1. Attempt database lookup with a fast timeout fallback
    let user: any = null;

    try {
      // 2-second timeout to prevent connection hangs if Supabase is offline/unreachable
      const dbLookup = prisma.user.findFirst({
        where: {
          OR: [
            { phone: cleanIdentifier },
            { email: cleanIdentifier },
          ],
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB_TIMEOUT')), 2000)
      );

      user = await Promise.race([dbLookup, timeoutPromise]);
    } catch (dbError: any) {
      console.warn('[Auth] Remote database unreachable or timed out. Falling back to demo evaluation store:', dbError?.message);
    }

    // 2. If not found in DB or DB is offline, check demo users store
    if (!user) {
      const demoUser = findDemoUser(cleanIdentifier);
      if (demoUser) {
        const isMatch = await verifyDemoPassword(password, demoUser);
        if (!isMatch) {
          return NextResponse.json(
            { success: false, error: 'Invalid phone/email or password.' },
            { status: 401 }
          );
        }

        // Sign JWT token for the demo user
        const token = await signAuthToken({
          userId: demoUser.id,
          phone: demoUser.phone,
          email: demoUser.email,
          fullName: demoUser.fullName,
          role: demoUser.role,
          district: demoUser.district,
        });

        const redirectUrl = getPortalRouteForRole(demoUser.role);

        const response = NextResponse.json({
          success: true,
          user: {
            id: demoUser.id,
            fullName: demoUser.fullName,
            phone: demoUser.phone,
            email: demoUser.email,
            role: demoUser.role,
            district: demoUser.district,
          },
          redirectUrl,
        });

        response.cookies.set({
          name: AUTH_COOKIE_NAME,
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }

      return NextResponse.json(
        { success: false, error: 'Invalid phone/email or password.' },
        { status: 401 }
      );
    }

    // 3. User was found in live database: verify password
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone/email or password.' },
        { status: 401 }
      );
    }

    // Sign JWT token
    const token = await signAuthToken({
      userId: user.id,
      phone: user.phone,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      district: user.district,
    });

    const redirectUrl = getPortalRouteForRole(user.role);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        district: user.district,
      },
      redirectUrl,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
