import "dotenv/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";

function resolvePrivateKeyAccounts() {
  const configuredPrivateKey = process.env.PRIVATE_KEY;

  if (configuredPrivateKey === undefined || configuredPrivateKey === "") {
    return [];
  }

  const normalizedPrivateKey = configuredPrivateKey.startsWith("0x")
    ? configuredPrivateKey
    : `0x${configuredPrivateKey}`;

  return [normalizedPrivateKey];
}

const privateKeyAccounts =
  resolvePrivateKeyAccounts();

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
