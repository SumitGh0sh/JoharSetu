import { NextRequest, NextResponse } from "next/server";
import { RelayerService } from "@/lib/blockchain/relayerService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("ticketId") || "JH-DHN-2026-001";

    const auditTrail = await RelayerService.getAuditTrail(ticketId);
    const metadata = RelayerService.getContractMetadata();

    return NextResponse.json({
      success: true,
      ticketId,
      auditTrail,
      network: metadata.network,
      contractAddress: metadata.auditLedgerAddress,
      explorerBase: metadata.explorerBase,
      verifiedOnChain: true,
      protocol: "JoharSetu CivicAuditLedger v1.0 (Polygon Amoy / PoS)"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch audit trail" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ticketId,
      action,
      evidenceIpfsCid = "ipfs://bafybeihandpumpbaghmarafluoride01",
      gpsCoordinatesHash = "geo:23.7957,86.4304",
      actor = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      actorRole = "CITIZEN"
    } = body;

    if (!ticketId || !action) {
      return NextResponse.json(
        { success: false, error: "ticketId and action are required" },
        { status: 400 }
      );
    }

    const record = await RelayerService.recordAuditEvent(
      ticketId,
      action,
      evidenceIpfsCid,
      gpsCoordinatesHash,
      actor,
      actorRole
    );

    return NextResponse.json({
      success: true,
      message: "Event successfully anchored to Polygon Amoy blockchain ledger",
      record
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to record audit event" },
      { status: 500 }
    );
  }
}
