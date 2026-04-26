import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { network } from "hardhat";
import { getAddress } from "viem";
import type { Address } from "viem";

type DeploymentRecord = {
  networkName: string;
  chainId: number | null;
  deployedContractAddress: `0x${string}`;
  contractName: "GaitaCreditPool";
  deployedAtIsoDate: string;
};

const deploymentsDirectory = "deployments";

function requireConfiguredPrivateKey(activeNetworkName: string) {
  if (activeNetworkName === "celoSepolia" || activeNetworkName === "celo") {
    if (process.env.PRIVATE_KEY === undefined || process.env.PRIVATE_KEY === "") {
      throw new Error(
        `PRIVATE_KEY is required to deploy GaitaCreditPool on ${activeNetworkName}`,
      );
    }
  }
}

function requireFundedDeployAccount(
  deployerAddress: Address,
  deployerBalanceWei: bigint,
  activeNetworkName: string,
) {
  if (activeNetworkName === "celoSepolia" && deployerBalanceWei === 0n) {
    throw new Error(
      `Deploy wallet ${deployerAddress} has 0 CELO on Celo Sepolia. Fund it with testnet CELO before running deploy:sepolia.`,
    );
  }

  if (activeNetworkName === "celo" && deployerBalanceWei === 0n) {
    throw new Error(
      `Deploy wallet ${deployerAddress} has 0 CELO on Celo Mainnet. Fund it with real CELO before running deploy:celo.`,
    );
  }
}

function buildDeploymentFilePath(activeNetworkName: string) {
  return join(
    deploymentsDirectory,
    `contract-address-${activeNetworkName}.json`,
  );
}

async function saveDeploymentRecord(deploymentRecord: DeploymentRecord) {
  await mkdir(deploymentsDirectory, { recursive: true });
  await writeFile(
    buildDeploymentFilePath(deploymentRecord.networkName),
    `${JSON.stringify(deploymentRecord, null, 2)}\n`,
  );
}

/**
 * Deploys GaitaCreditPool using the network selected by Hardhat CLI.
 * This works for both Celo Sepolia and Celo Mainnet because `network.create()`
 * binds Viem clients to the current `--network` configuration, including RPC
 * and accounts.
 */
async function deployGaitaCreditPool() {
  const hardhatConnection = await network.create();
  const activeNetworkName = hardhatConnection.networkName;
  requireConfiguredPrivateKey(activeNetworkName);

  const publicClient = await hardhatConnection.viem.getPublicClient();
  const [deployerWalletClient] = await hardhatConnection.viem.getWalletClients();
  const activeChainId = await publicClient.getChainId();

  if (deployerWalletClient === undefined) {
    throw new Error(
      `No deploy wallet configured for ${activeNetworkName}. Set PRIVATE_KEY first.`,
    );
  }

  const deployerAddress = getAddress(deployerWalletClient.account.address);
  const deployerBalanceWei = await publicClient.getBalance({
    address: deployerAddress,
  });

  requireFundedDeployAccount(
    deployerAddress,
    deployerBalanceWei,
    activeNetworkName,
  );

  console.log(`Deploying GaitaCreditPool to ${activeNetworkName}...`);
  console.log(`Deployer wallet: ${deployerAddress}`);

  const gaitaCreditPool = await hardhatConnection.viem.deployContract(
    "GaitaCreditPool",
  );

  const deploymentRecord: DeploymentRecord = {
    networkName: activeNetworkName,
    chainId: activeChainId,
    deployedContractAddress: gaitaCreditPool.address,
    contractName: "GaitaCreditPool",
    deployedAtIsoDate: new Date().toISOString(),
  };

  await saveDeploymentRecord(deploymentRecord);

  console.log(`GaitaCreditPool deployed at: ${gaitaCreditPool.address}`);
  console.log(
    `Deployment record saved to ${buildDeploymentFilePath(activeNetworkName)}`,
  );
}

await deployGaitaCreditPool();
