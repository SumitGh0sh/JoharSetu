import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signAuthToken, AUTH_COOKIE_NAME, getPortalRouteForRole } from '@/lib/auth';
import { Role } from '@prisma/client';
import { findDemoUser, addDemoUser } from '@/lib/demoUsersStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      password,
      role = 'CITIZEN',
      district,
      block,
      panchayat,
      organization,
      designation,
      universityCode,
    } = body;

    // Validation
    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, phone, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.trim() : null;

    // Hash password
    const passwordHash = await hashPassword(password);

    let user: any = null;

    try {
      // Check existing phone or email in live database with timeout
      const existingUserLookup = prisma.user.findFirst({
        where: {
          OR: [
            { phone: cleanPhone },
            ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ],
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB_TIMEOUT')), 2000)
      );

      const existingUser = (await Promise.race([existingUserLookup, timeoutPromise])) as any;

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'A user with this phone or email already exists.' },
          { status: 409 }
        );
      }

      // If student/faculty, find HEI by code if provided
      let heiId: string | undefined = undefined;
      if (universityCode) {
        const hei = await prisma.hEI.findUnique({
          where: { code: universityCode },
        });
        if (hei) {
          heiId = hei.id;
        }
      }

      // Create user in database
      user = await prisma.user.create({
        data: {
          fullName,
          phone: cleanPhone,
          email: cleanEmail,
          passwordHash,
          role: role as Role,
          district: district || null,
          block: block || null,
          panchayat: panchayat || null,
          organization: organization || null,
          designation: designation || null,
          heiId,
        },
      });
    } catch (dbError: any) {
      console.warn('[Auth] Database offline during registration. Using demo memory store:', dbError?.message);

      // Check existing in demo store
      if (findDemoUser(cleanPhone) || (cleanEmail && findDemoUser(cleanEmail))) {
        return NextResponse.json(
          { success: false, error: 'A user with this phone or email already exists.' },
          { status: 409 }
        );
      }

      const newDemoUser = {
        id: `usr-demo-${Date.now()}`,
        fullName,
        phone: cleanPhone,
        email: cleanEmail,
        passwordHash,
        role: role as string,
        district: district || null,
        block: block || null,
        panchayat: panchayat || null,
        organization: organization || null,
        designation: designation || null,
      };

      addDemoUser(newDemoUser);
      user = newDemoUser;
    }

    // Generate JWT
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
