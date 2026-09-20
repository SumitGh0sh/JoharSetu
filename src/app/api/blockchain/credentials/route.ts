import { NextRequest, NextResponse } from "next/server";
import { RelayerService } from "@/lib/blockchain/relayerService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tokenIdParam = searchParams.get("tokenId");
    const tokenId = tokenIdParam ? parseInt(tokenIdParam, 10) : 1;

    const credential = await RelayerService.getCredential(tokenId);
    const metadata = RelayerService.getContractMetadata();

    if (!credential) {
      return NextResponse.json(
        { success: false, error: `Soulbound credential #${tokenId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      credential,
      network: metadata.network,
      contractAddress: metadata.nepCreditsAddress,
      explorerBase: metadata.explorerBase,
      tokenStandard: "Soulbound Token (Non-transferable ERC-721)",
      verifiedAuthority: "Department of Higher & Technical Education, Government of Jharkhand"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch credential" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      studentName,
      studentRollNumber,
      abcId,
      heiName,
      ticketId,
      nepCredits = 4.0,
      nssHours = 120,
      evidenceIpfsCid = "ipfs://bafybeifluoridecapstonereport"
    } = body;

    if (!studentName || !ticketId) {
      return NextResponse.json(
        { success: false, error: "studentName and ticketId are required" },
        { status: 400 }
      );
    }

    const cred = await RelayerService.issueCredential(
      studentAddress,
      studentName,
      studentRollNumber || "22JE0451",
      abcId || "ABC-JH-2026-88912",
      heiName || "Birsa Institute of Technology (BIT) Sindri",
      ticketId,
      nepCredits,
      nssHours,
      evidenceIpfsCid
    );

    return NextResponse.json({
      success: true,
      message: "Soulbound NEP 2020 experiential learning credential issued on-chain",
      credential: cred
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to issue credential" },
      { status: 500 }
    );
  }
}
