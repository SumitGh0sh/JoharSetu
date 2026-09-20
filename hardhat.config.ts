import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const POLYGON_AMOY_RPC_URL =
  process.env.POLYGON_AMOY_RPC_URL ||
  process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL ||
  "https://rpc-amoy.polygon.technology";

const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    polygonAmoy: {
      url: POLYGON_AMOY_RPC_URL,
      chainId: 80002,
      accounts: RELAYER_PRIVATE_KEY ? [RELAYER_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: POLYGONSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache_hardhat",
    artifacts: "./artifacts_hardhat",
  },
};

export default config;
