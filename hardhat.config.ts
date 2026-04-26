import "dotenv/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";

const privateKeyAccounts =
  process.env.PRIVATE_KEY === undefined || process.env.PRIVATE_KEY === ""
    ? []
    : [process.env.PRIVATE_KEY];

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    celoSepolia: {
      type: "http",
      chainType: "l1",
      chainId: 11142220,
      url: "https://forno.celo-sepolia.celo-testnet.org",
      accounts: privateKeyAccounts,
    },
    celo: {
      type: "http",
      chainType: "l1",
      chainId: 42220,
      url: "https://forno.celo.org",
      accounts: privateKeyAccounts,
    },
  },
});
