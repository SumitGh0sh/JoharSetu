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
