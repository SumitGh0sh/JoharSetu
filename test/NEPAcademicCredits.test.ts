import chai from "chai";
const { expect } = chai;
import hre from "hardhat";
const { ethers } = hre;
import { NEPAcademicCredits } from "../typechain-types";

describe("NEPAcademicCredits (Soulbound Token)", function () {
  let sbt: NEPAcademicCredits;
  let admin: any;
  let heiMentor: any;
  let student: any;
  let stranger: any;

  beforeEach(async function () {
    [admin, heiMentor, student, stranger] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("NEPAcademicCredits");
    sbt = (await Factory.deploy(admin.address)) as NEPAcademicCredits;
    await sbt.waitForDeployment();

    const issuerRole = await sbt.ISSUER_ROLE();
    await sbt.grantRole(issuerRole, heiMentor.address);
  });

  it("should issue an NEP 2020 experiential credit credential to a student", async function () {
    const tx = await sbt.connect(heiMentor).issueCredential(
      student.address,
      "Mangal Soren",
      "22JE0451",
      "ABC-JH-2026-88912",
      "Birsa Institute of Technology (BIT) Sindri",
      "JH-DHN-2026-001",
      400, // 4.00 Credits
      120, // 120 Field Hours
      "ipfs://bafybeifluoridecapstonereport",
      "https://joharsetu.jharkhand.gov.in/api/credentials/1"
    );
    await tx.wait();

    expect(await sbt.balanceOf(student.address)).to.equal(1);
    expect(await sbt.ownerOf(1)).to.equal(student.address);

    const cred = await sbt.getCredential(1);
    expect(cred.studentName).to.equal("Mangal Soren");
    expect(cred.abcId).to.equal("ABC-JH-2026-88912");
    expect(cred.nepCreditsBasis).to.equal(400);
    expect(cred.nssHours).to.equal(120);
    expect(cred.isValid).to.be.true;
  });

  it("MUST enforce Soulbound non-transferability (transfers MUST revert)", async function () {
    await sbt.connect(heiMentor).issueCredential(
      student.address,
      "Mangal Soren",
      "22JE0451",
      "ABC-JH-2026-88912",
      "BIT Sindri",
      "JH-DHN-2026-001",
      400,
      120,
      "ipfs://bafybeireport",
      "https://joharsetu.jharkhand.gov.in/api/credentials/1"
    );

    // Attempting to transfer token 1 from student to stranger MUST revert
    await expect(
      sbt.connect(student).transferFrom(student.address, stranger.address, 1)
    ).to.be.revertedWithCustomError(sbt, "SoulboundTokenNonTransferable");
  });

  it("should allow government to revoke a credential for academic misconduct", async function () {
    await sbt.connect(heiMentor).issueCredential(
      student.address,
      "Mangal Soren",
      "22JE0451",
      "ABC-JH-2026-88912",
      "BIT Sindri",
      "JH-DHN-2026-001",
      400,
      120,
      "ipfs://bafybeireport",
      "https://joharsetu.jharkhand.gov.in/api/credentials/1"
    );

    await sbt.connect(admin).revokeCredential(1, "Erroneous field hours counter-signature");
    const cred = await sbt.getCredential(1);
    expect(cred.isValid).to.be.false;
    expect(cred.revocationReason).to.equal("Erroneous field hours counter-signature");
    expect(await sbt.isCredentialValid(1)).to.be.false;
  });
});
