import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("==================================================================");
  console.log("JoharSetu (जोहारसेतु) - Smart Contract Deployment Pipeline");
  console.log("Problem Statement: SIH26043 | Dept of Higher & Technical Education");
  console.log("==================================================================");

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log(`Deploying contracts with account: ${deployer.address}`);
  console.log(`Target Network: ${network.name} (Chain ID: ${network.chainId})`);

  const initialBalance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(initialBalance)} POL/ETH\n`);

  // 1. Deploy CivicAuditLedger
  console.log("[1/3] Deploying CivicAuditLedger.sol...");
  const CivicAuditLedgerFactory = await ethers.getContractFactory("CivicAuditLedger");
  const civicAuditLedger = await CivicAuditLedgerFactory.deploy(deployer.address);
  await civicAuditLedger.waitForDeployment();
  const civicAuditLedgerAddress = await civicAuditLedger.getAddress();
  console.log(`  ✓ CivicAuditLedger deployed at: ${civicAuditLedgerAddress}`);

  // 2. Deploy NEPAcademicCredits (Soulbound Token)
  console.log("\n[2/3] Deploying NEPAcademicCredits.sol (Soulbound Token)...");
  const NEPAcademicCreditsFactory = await ethers.getContractFactory("NEPAcademicCredits");
  const nepCredits = await NEPAcademicCreditsFactory.deploy(deployer.address);
  await nepCredits.waitForDeployment();
  const nepCreditsAddress = await nepCredits.getAddress();
  console.log(`  ✓ NEPAcademicCredits deployed at: ${nepCreditsAddress}`);

  // 3. Deploy JoharMilestoneEscrow
  console.log("\n[3/3] Deploying JoharMilestoneEscrow.sol (CSR Fund Escrow)...");
  const JoharMilestoneEscrowFactory = await ethers.getContractFactory("JoharMilestoneEscrow");
  const milestoneEscrow = await JoharMilestoneEscrowFactory.deploy(deployer.address);
  await milestoneEscrow.waitForDeployment();
  const milestoneEscrowAddress = await milestoneEscrow.getAddress();
  console.log(`  ✓ JoharMilestoneEscrow deployed at: ${milestoneEscrowAddress}`);

  // 4. Extract ABIs from artifacts
  const artifactsDir = path.join(process.cwd(), "artifacts_hardhat", "contracts");

  const getContractArtifact = (contractFolder: string, contractName: string) => {
    const artifactPath = path.join(artifactsDir, `${contractFolder}.sol`, `${contractName}.json`);
    if (fs.existsSync(artifactPath)) {
      const content = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
      return content.abi;
    }
    return [];
  };

  const contractsData = {
    network: {
      name: network.name,
      chainId: Number(network.chainId),
      rpcUrl: network.chainId === BigInt(80002)
        ? "https://rpc-amoy.polygon.technology"
        : "http://127.0.0.1:8545",
      explorerUrl: network.chainId === BigInt(80002)
        ? "https://amoy.polygonscan.com"
        : "https://localhost:8545",
    },
    contracts: {
      CivicAuditLedger: {
        address: civicAuditLedgerAddress,
        abi: getContractArtifact("CivicAuditLedger", "CivicAuditLedger"),
      },
      NEPAcademicCredits: {
        address: nepCreditsAddress,
        abi: getContractArtifact("NEPAcademicCredits", "NEPAcademicCredits"),
      },
      JoharMilestoneEscrow: {
        address: milestoneEscrowAddress,
        abi: getContractArtifact("JoharMilestoneEscrow", "JoharMilestoneEscrow"),
      },
    },
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  // 5. Save to src/lib/blockchain/contracts.json
  const targetDir = path.join(process.cwd(), "src", "lib", "blockchain");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, "contracts.json");
  fs.writeFileSync(targetFile, JSON.stringify(contractsData, null, 2));
  console.log(`\n✓ Contract configurations & ABIs saved to: ${targetFile}`);

  console.log("\n==================================================================");
  console.log("Deployment completed successfully! All contracts live and ready.");
  console.log("==================================================================");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
