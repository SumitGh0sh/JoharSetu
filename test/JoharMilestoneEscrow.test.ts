import chai from "chai";
const { expect } = chai;
import hre from "hardhat";
const { ethers } = hre;
import { JoharMilestoneEscrow } from "../typechain-types";

describe("JoharMilestoneEscrow", function () {
  let escrow: JoharMilestoneEscrow;
  let admin: any;
  let csrSponsor: any;
  let heiBeneficiary: any;
  let heiMentor: any;
  let govtVerifier: any;

  beforeEach(async function () {
    [admin, csrSponsor, heiBeneficiary, heiMentor, govtVerifier] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("JoharMilestoneEscrow");
    escrow = (await Factory.deploy(admin.address)) as JoharMilestoneEscrow;
    await escrow.waitForDeployment();

    const heiRole = await escrow.HEI_ROLE();
    const govtRole = await escrow.GOVERNMENT_ROLE();
    const csrRole = await escrow.CSR_ROLE();

    await escrow.grantRole(heiRole, heiMentor.address);
    await escrow.grantRole(govtRole, govtVerifier.address);
    await escrow.grantRole(csrRole, csrSponsor.address);
  });

  it("should create project, accept CSR deposit, approve milestone, and release payout", async function () {
    const ticketId = "JH-DHN-2026-001";
    const depositAmount = ethers.parseEther("1.0");
    const milestonePayout = ethers.parseEther("0.4");

    // 1. Create project
    await escrow.connect(csrSponsor).createProject(ticketId, heiBeneficiary.address, depositAmount);

    // 2. Deposit funds
    await escrow.connect(csrSponsor).depositFunds(ticketId, { value: depositAmount });

    const proj = await escrow.getProject(ticketId);
    expect(proj.totalDeposited).to.equal(depositAmount);

    // 3. Add milestone
    await escrow.connect(csrSponsor).addMilestone(
      ticketId,
      "Phase 1: Fluoride Field Survey & Alumina Filtration Column Prototype",
      milestonePayout
    );

    // 4. Submit Proof
    await escrow.connect(heiMentor).submitMilestoneProof(
      ticketId,
      0,
      "ipfs://bafybeiphase1surveyresults"
    );

    let m = await escrow.getMilestone(ticketId, 0);
    expect(m.status).to.equal(1); // PROOF_SUBMITTED

    // 5. Mentor Verifies
    await escrow.connect(heiMentor).verifyMilestoneByHei(ticketId, 0);
    m = await escrow.getMilestone(ticketId, 0);
    expect(m.status).to.equal(2); // VERIFIED_BY_HEI

    // 6. Government Approves
    await escrow.connect(govtVerifier).approveMilestoneByGovt(ticketId, 0);
    m = await escrow.getMilestone(ticketId, 0);
    expect(m.status).to.equal(3); // APPROVED_BY_GOVT

    // 7. Release Payout
    const initialBalance = await ethers.provider.getBalance(heiBeneficiary.address);
    await escrow.releaseMilestonePayout(ticketId, 0);

    const finalBalance = await ethers.provider.getBalance(heiBeneficiary.address);
    expect(finalBalance - initialBalance).to.equal(milestonePayout);

    m = await escrow.getMilestone(ticketId, 0);
    expect(m.status).to.equal(4); // RELEASED
  });
});
