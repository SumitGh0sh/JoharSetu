import { NextRequest, NextResponse } from 'next/server';
import { MOCK_MANAGED_USERS } from '@/lib/mockData';
import { ManagedUser, UserRole } from '@/lib/types';

// In-memory user store initialized with MOCK_MANAGED_USERS
let managedUsers: ManagedUser[] = [...MOCK_MANAGED_USERS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.toLowerCase().trim() || '';
    const role = searchParams.get('role');
    const district = searchParams.get('district');
    const status = searchParams.get('status');

    let result = [...managedUsers];

    if (query) {
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.phone.toLowerCase().includes(query) ||
          u.registrationId.toLowerCase().includes(query) ||
          (u.organization && u.organization.toLowerCase().includes(query)) ||
          (u.department && u.department.toLowerCase().includes(query)) ||
          (u.designation && u.designation.toLowerCase().includes(query))
      );
    }

    if (role && role !== 'ALL') {
      result = result.filter((u) => u.role === role);
    }

    if (district && district !== 'ALL') {
      result = result.filter((u) => u.district === district);
    }

    if (status && status !== 'ALL') {
      result = result.filter((u) => u.status === status);
    }

    return NextResponse.json({
      success: true,
      users: result,
      total: result.length,
      overallTotal: managedUsers.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      role,
      district,
      block,
      panchayat,
      organization,
      department,
      designation,
      status = 'ACTIVE',
      verifiedAadhaar = true
    } = body;

    if (!fullName || !role || !district) {
      return NextResponse.json(
        { success: false, error: 'Full name, role, and district are required.' },
        { status: 400 }
      );
    }

    const newId = `usr-${Date.now().toString(36)}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regId = `JH-REG-2026-${randomSuffix}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newUser: ManagedUser = {
      id: newId,
      registrationId: body.registrationId || regId,
      fullName,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@joharsetu.gov.in`,
      phone: phone || '+91 94311 00000',
      role: role as UserRole,
      district,
      block: block || undefined,
      panchayat: panchayat || undefined,
      organization: organization || undefined,
      department: department || undefined,
      designation: designation || undefined,
      status: status || 'ACTIVE',
      joinedDate: now.split(' ')[0],
      lastActive: now,
      verifiedAadhaar: Boolean(verifiedAadhaar),
      activityMetric: {
        ticketsReported: role === 'CITIZEN' ? 1 : undefined,
        tasksResolved: role === 'STUDENT' || role === 'FACULTY_MENTOR' ? 0 : undefined,
        hoursLogged: role === 'STUDENT' ? 0 : undefined,
        fundsPledgedINR: role === 'INDUSTRY_CSR' ? 0 : undefined
      }
    };

    managedUsers.unshift(newUser);

    return NextResponse.json({
      success: true,
      message: 'User account created and provisioned successfully',
      user: newUser
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required for update' },
        { status: 400 }
      );
    }

    const idx = managedUsers.findIndex((u) => u.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: `User with ID ${id} not found` },
        { status: 404 }
      );
    }

    managedUsers[idx] = {
      ...managedUsers[idx],
      ...updates,
      lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    return NextResponse.json({
      success: true,
      message: 'User profile updated successfully',
      user: managedUsers[idx]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required for deletion' },
        { status: 400 }
      );
    }

    const idx = managedUsers.findIndex((u) => u.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: `User with ID ${id} not found` },
        { status: 404 }
      );
    }

    const deletedUser = managedUsers.splice(idx, 1)[0];

    return NextResponse.json({
      success: true,
      message: `User ${deletedUser.fullName} (${deletedUser.registrationId}) removed from master directory`,
      user: deletedUser
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
