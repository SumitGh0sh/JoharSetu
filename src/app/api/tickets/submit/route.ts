import { NextRequest, NextResponse } from 'next/server';
import { findOptimalHeiForTicket } from '@/lib/heiRegistry';
import { TicketCategory, UrgencyLevel, ProblemTicket } from '@/lib/types';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title = 'Reported Community Issue',
      description = '',
      category = 'WATER_MANAGEMENT',
      urgency = 'HIGH',
      district = 'Ranchi',
      village = 'Rural Ward',
      latitude = 23.3441,
      longitude = 85.3096,
      reporterName = 'Citizen Reporter',
      reporterPhone = '+91 94311 00000',
      imageDataUrl,
      audioDataUrl,
      imageUrls = [],
    } = body;

    const ticketCode = `JS-${district.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Autonomous spatial and domain routing
    const { winner: optimalHei } = findOptimalHeiForTicket(
      Number(latitude),
      Number(longitude),
      category,
      district
    );

    const deptName = optimalHei.departments?.[0]?.name || 'Department of Rural Technology & Innovation';
    const finalImageUrls = [...imageUrls];
    if (imageDataUrl && !finalImageUrls.includes(imageDataUrl)) {
      finalImageUrls.push(imageDataUrl);
    }
    if (finalImageUrls.length === 0) {
      finalImageUrls.push('/images/issues/handpump_broken.jpg');
    }

    const createdTicket: ProblemTicket = {
      id: 'tkt-sync-' + Date.now(),
      ticketCode,
      title,
      description,
      category: category as TicketCategory,
      urgency: urgency as UrgencyLevel,
      status: 'AI_ROUTED',
      latitude: Number(latitude),
      longitude: Number(longitude),
      district,
      village,
      reporterName,
      reporterPhone,
      reportedAt: new Date().toISOString(),
      imageUrls: finalImageUrls,
      audioUrl: audioDataUrl,
      assignedHei: {
        id: optimalHei.id,
        name: optimalHei.name,
        code: optimalHei.code,
        department: deptName,
        distanceKm: optimalHei.distanceKm,
        utilityScore: optimalHei.utilityScore,
        routingReason: `Offline sync routed to ${optimalHei.name} (${optimalHei.distanceKm} km away) specializing in ${deptName}.`,
      },
      socialEngagement: {
        upvotes: 1,
        shares: 0,
        commentsCount: 0,
        hypeScore: 120,
        comments: [],
      },
      privacySettings: {
        isAnonymous: true,
        publicReporterIdentifier: `Resident of ${village}`,
      },
    };

    // Try persisting to PostgreSQL Prisma SSOT if connected
    let dbPersisted = false;
    try {
      if (prisma) {
        // Find or create district
        const distRecord = await prisma.district.upsert({
          where: { name: district },
          update: {},
          create: { name: district, division: 'South Chotanagpur' },
        });

        // Find or create anonymous/citizen user
        const cleanPhone = reporterPhone.replace(/\s+/g, '').substring(0, 15) || `+91${Date.now().toString().substring(3, 13)}`;
        const user = await prisma.user.upsert({
          where: { phone: cleanPhone },
          update: { fullName: reporterName },
          create: {
            phone: cleanPhone,
            fullName: reporterName,
            role: 'CITIZEN',
            district,
          },
        });

        // Find or associate optimal HEI
        let heiRecord = await prisma.hEI.findFirst({
          where: {
            OR: [
              { code: optimalHei.code },
              { name: { contains: optimalHei.name.substring(0, 10), mode: 'insensitive' } },
            ],
          },
        });
        if (!heiRecord) {
          heiRecord = await prisma.hEI.findFirst();
        }

        // Create ProblemTicket
        await prisma.problemTicket.create({
          data: {
            ticketCode,
            title,
            description,
            category: category as any,
            urgency: urgency as any,
            status: 'AI_ROUTED',
            latitude: Number(latitude),
            longitude: Number(longitude),
            districtId: distRecord.id,
            villageOrWard: village,
            reporterId: user.id,
            assignedHeiId: heiRecord?.id,
            imageUrls: finalImageUrls,
          },
        });
        dbPersisted = true;
      }
    } catch (dbErr: any) {
      // Prisma offline or schema sync in-progress; edge fallback handles ticket gracefully
      console.warn('Prisma SSOT persist warning (using edge fallback):', dbErr?.message || dbErr);
    }

    return NextResponse.json({
      success: true,
      ticketCode,
      ticket: createdTicket,
      dbPersisted,
      message: 'Citizen report successfully received and routed to HEI capstone pool.',
    });
  } catch (error: any) {
    console.error('Error in /api/tickets/submit:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit ticket' },
      { status: 500 }
    );
  }
}
