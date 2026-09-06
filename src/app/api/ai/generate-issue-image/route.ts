import { NextRequest, NextResponse } from 'next/server';
import { generateIssueImagePrompt } from '@/lib/issueImagePromptEngine';
import { TicketCategory } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title = 'Reported Village Infrastructure Issue',
      description = '',
      category = 'WATER_MANAGEMENT',
      district = 'Dhanbad',
      village = 'Baghmara',
      latitude = 23.8145,
      longitude = 86.4412
    } = body;

    const structuredPrompt = generateIssueImagePrompt({
      title,
      description,
      category: category as TicketCategory,
      district,
      village,
      latitude: Number(latitude),
      longitude: Number(longitude)
    });

    return NextResponse.json({
      success: true,
      data: structuredPrompt
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to synthesize prompt' },
      { status: 500 }
    );
  }
}
