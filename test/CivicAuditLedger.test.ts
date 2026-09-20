import chai from "chai";
const { expect } = chai;
import hre from "hardhat";
const { ethers } = hre;
import { CivicAuditLedger } from "../typechain-types";

describe("CivicAuditLedger", function () {
  let ledger: CivicAuditLedger;
  let admin: any;
  let relayer: any;
  let unauthorized: any;

  beforeEach(async function () {
    [admin, relayer, unauthorized] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("CivicAuditLedger");
    ledger = (await Factory.deploy(admin.address)) as CivicAuditLedger;
    await ledger.waitForDeployment();

    const relayerRole = await ledger.RELAYER_ROLE();
    await ledger.grantRole(relayerRole, relayer.address);
  });

  it("should initialize roles properly", async function () {
    const adminRole = await ledger.DEFAULT_ADMIN_ROLE();
    const relayerRole = await ledger.RELAYER_ROLE();
    const govtRole = await ledger.GOVERNMENT_ROLE();

    expect(await ledger.hasRole(adminRole, admin.address)).to.be.true;
    expect(await ledger.hasRole(govtRole, admin.address)).to.be.true;
    expect(await ledger.hasRole(relayerRole, relayer.address)).to.be.true;
  });

  it("should record civic lifecycle events and chain hashes", async function () {
    const ticketId = "JH-DHN-2026-001";
    const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("fluoride_reading_3.8ppm"));

    // Step 1: SUBMITTED
    const tx1 = await ledger.connect(relayer).recordAuditEvent(
      ticketId,
      "SUBMITTED",
      "ipfs://bafybeihandpumpinitialphoto",
      "geo:23.7957,86.4304",
      payloadHash,
      admin.address,
      "CITIZEN"
    );
    await tx1.wait();

    const trail1 = await ledger.getTicketAuditTrail(ticketId);
    expect(trail1.length).to.equal(1);
    expect(trail1[0].action).to.equal("SUBMITTED");
    expect(trail1[0].previousBlockHash).to.equal(ethers.ZeroHash);
    expect(trail1[0].currentBlockHash).to.not.equal(ethers.ZeroHash);

    // Step 2: AI_ROUTED
    const tx2 = await ledger.connect(relayer).recordAuditEvent(
      ticketId,
      "AI_ROUTED",
      "ipfs://bafybeiroutingmatrix",
      "geo:23.7957,86.4304",
      payloadHash,
      admin.address,
      "AI_AGENT"
    );
    await tx2.wait();

    const trail2 = await ledger.getTicketAuditTrail(ticketId);
    expect(trail2.length).to.equal(2);
    expect(trail2[1].action).to.equal("AI_ROUTED");
    // Verify hash link connects to previous block
    expect(trail2[1].previousBlockHash).to.equal(trail2[0].currentBlockHash);

    // Verify cryptographic chain
    const [isValid, count] = await ledger.verifyTicketAuditChain(ticketId);
    expect(isValid).to.be.true;
    expect(count).to.equal(2);
  });

  it("should reject unauthorized records", async function () {
    const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
    await expect(
      ledger.connect(unauthorized).recordAuditEvent(
        "JH-DHN-2026-002",
        "SUBMITTED",
        "ipfs://test",
        "geo:0,0",
        payloadHash,
        unauthorized.address,
        "CITIZEN"
      )
    ).to.be.reverted;
  });
});
