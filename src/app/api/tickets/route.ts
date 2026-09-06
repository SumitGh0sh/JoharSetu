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
          // Merge or supplement initial tickets
          const mappedDb = dbTickets.map((t) => ({
            id: t.id,
            ticketCode: t.ticketCode,
            title: t.title,
            description: t.description,
            category: t.category as any,
            urgency: t.urgency as any,
            status: t.status as any,
            latitude: t.latitude,
            longitude: t.longitude,
            district: t.district?.name || 'Ranchi',
            village: t.villageOrWard || 'Gram Panchayat',
            reporterName: t.reporter?.fullName || 'Citizen Reporter',
            reporterPhone: t.reporter?.phone || '+91 •••••',
            reportedAt: t.createdAt.toISOString(),
            imageUrls: t.imageUrls || [],
          }));

          tickets = [...mappedDb, ...INITIAL_TICKETS];
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
