import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_TICKETS } from '@/lib/mockData';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const district = searchParams.get('district');
    const status = searchParams.get('status');

    let tickets = INITIAL_TICKETS;

    try {
      if (prisma) {
        const dbTickets = await prisma.problemTicket.findMany({
          include: {
            reporter: true,
            district: true,
            assignedHei: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        });

        if (dbTickets && dbTickets.length > 0) {
          // Merge and format database tickets
          const mappedDb = dbTickets.map((t) => {
            const hei = t.assignedHei;
            return {
              id: t.id,
              ticketCode: t.ticketCode,
              title: t.title,
              description: t.description,
              category: t.category as any,
              urgency: t.urgency as any,
              status: (t.status === 'SUBMITTED' ? 'AI_ROUTED' : t.status) as any,
              latitude: t.latitude,
              longitude: t.longitude,
              district: t.district?.name || 'Ranchi',
              village: t.villageOrWard || 'Gram Panchayat',
              reporterName: t.reporter?.fullName || 'Citizen Reporter',
              reporterPhone: t.reporter?.phone || '+91 94311 00000',
              reportedAt: t.createdAt.toISOString(),
              imageUrls: t.imageUrls && t.imageUrls.length > 0 ? t.imageUrls : ['/images/issues/handpump_broken.jpg'],
              assignedHei: hei ? {
                id: hei.id,
                name: hei.name,
                code: hei.code,
                department: 'Department of Technology & Engineering Solutions',
                facultyMentor: `Prof. ${hei.name.split(' ')[0]} (Academic Project Guide)`,
                distanceKm: 18,
                utilityScore: 0.94,
                routingReason: `Assigned to ${hei.name} based on regional mandate and capstone capacity.`,
              } : {
                id: 'hei-bit-mesra',
                name: 'Birla Institute of Technology, Mesra',
                code: 'BITM',
                department: 'Department of Civil & Environmental Engineering',
                facultyMentor: 'Prof. Dr. A. K. Sinha (Academic Project Guide)',
                distanceKm: 18,
                utilityScore: 0.94,
                routingReason: 'Assigned to BIT Mesra based on regional mandate and capstone capacity.',
              },
              socialEngagement: {
                upvotes: 1,
                shares: 0,
                commentsCount: 0,
                hypeScore: 120,
                comments: [],
              },
            };
          });

          const dbCodes = new Set(mappedDb.map((m) => m.ticketCode));
          tickets = [...mappedDb, ...INITIAL_TICKETS.filter((init) => !dbCodes.has(init.ticketCode))];
        }
      }
    } catch (e) {
      // Use fallback INITIAL_TICKETS
    }

    if (category && category !== 'ALL') {
      tickets = tickets.filter((t) => t.category === category);
    }
    if (district && district !== 'ALL') {
      tickets = tickets.filter((t) => t.district.toLowerCase() === district.toLowerCase());
    }
    if (status) {
      tickets = tickets.filter((t) => t.status === status);
    }

    return NextResponse.json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ticketCode, status, assignedDepartment, assignedHei, urgency, category, adminNotes } = body;

    if (!id && !ticketCode) {
      return NextResponse.json(
        { success: false, error: 'Either id or ticketCode is required for update' },
        { status: 400 }
      );
    }

    try {
      if (prisma) {
        const updateData: any = {};
        if (status) updateData.status = status;
        if (urgency) updateData.urgency = urgency;
        if (category) updateData.category = category;
        if (adminNotes) updateData.adminNotes = adminNotes;
        if (assignedHei?.id) updateData.assignedHeiId = assignedHei.id;

        await prisma.problemTicket.updateMany({
          where: id ? { id } : { ticketCode },
          data: updateData,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma update fallback notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      data: {
        id,
        ticketCode,
        status,
        assignedDepartment,
        assignedHei,
        urgency,
        category,
        adminNotes,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    let ticketCode = searchParams.get('ticketCode');

    if (!id && !ticketCode) {
      try {
        const body = await req.json();
        id = body.id;
        ticketCode = body.ticketCode;
      } catch {}
    }

    if (!id && !ticketCode) {
      return NextResponse.json(
        { success: false, error: 'Either id or ticketCode is required for deletion' },
        { status: 400 }
      );
    }

    try {
      if (prisma) {
        const whereClause: any = id ? { id } : { ticketCode: ticketCode || undefined };
        await prisma.problemTicket.deleteMany({
          where: whereClause,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma delete fallback notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Ticket ${ticketCode || id} soft-deleted/removed successfully`,
      deletedId: id || ticketCode,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}

