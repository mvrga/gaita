import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { network } from "hardhat";
import { getAddress, parseEther } from "viem";
import type { Address, Hash } from "viem";

type DeploymentRecord = {
  networkName: string;
  chainId: number | null;
  deployedContractAddress: Address;
  contractName: "GaitaCreditPool";
  deployedAtIsoDate: string;
};

type TransactionHashRecord = {
  networkName: string;
  chainId: number | null;
  deployedContractAddress: Address;
  seekerAddress: Address;
  updatedCreditScore: number;
  requestedCreditAmountWei: string;
  updateScoreTransactionHash: Hash;
  requestCreditTransactionHash: Hash;
  interactedAtIsoDate: string;
};

const deploymentsDirectory = "deployments";
const updatedCreditScore = 75;
const requestedCreditAmount = parseEther("100");

function requireFundedOwnerAccount(
  ownerAddress: Address,
  ownerBalanceWei: bigint,
  activeNetworkName: string,
) {
  if (activeNetworkName === "celoSepolia" && ownerBalanceWei === 0n) {
    throw new Error(
      `Owner wallet ${ownerAddress} has 0 CELO on Celo Sepolia. Fund it with testnet CELO before running interact:sepolia.`,
    );
  }

  if (activeNetworkName === "celo" && ownerBalanceWei === 0n) {
    throw new Error(
      `Owner wallet ${ownerAddress} has 0 CELO on Celo Mainnet. Fund it with real CELO before running interact:celo.`,
    );
  }
}

function buildDeploymentFilePath(activeNetworkName: string) {
  return join(
    deploymentsDirectory,
    `contract-address-${activeNetworkName}.json`,
  );
}

function buildTransactionHashesFilePath(activeNetworkName: string) {
  return join(
    deploymentsDirectory,
    `transaction-hashes-${activeNetworkName}.json`,
  );
}

async function readDeploymentRecord(activeNetworkName: string) {
  const deploymentFileContent = await readFile(
    buildDeploymentFilePath(activeNetworkName),
    "utf8",
  );
  const deploymentRecord = JSON.parse(deploymentFileContent) as DeploymentRecord;

  return {
    ...deploymentRecord,
    deployedContractAddress: getAddress(
      deploymentRecord.deployedContractAddress,
    ),
  };
}

async function saveTransactionHashRecord(
  transactionHashRecord: TransactionHashRecord,
) {
  await writeFile(
    buildTransactionHashesFilePath(transactionHashRecord.networkName),
    `${JSON.stringify(transactionHashRecord, null, 2)}\n`,
  );
}

/**
 * Interacts with the GaitaCreditPool deployed on the selected Hardhat network.
 * The same logic works for Celo Sepolia and Celo Mainnet because the network
 * name chooses which deployment JSON is read and which RPC/account config
 * Hardhat uses.
 */
async function interactWithGaitaCreditPool() {
  const hardhatConnection = await network.create();
  const activeNetworkName = hardhatConnection.networkName;
  const publicClient = await hardhatConnection.viem.getPublicClient();
  const activeChainId = await publicClient.getChainId();
  const [ownerWalletClient] = await hardhatConnection.viem.getWalletClients();

  if (ownerWalletClient === undefined) {
    throw new Error(
      `No wallet account configured for ${activeNetworkName}. Set PRIVATE_KEY first.`,
    );
  }

  const deploymentRecord = await readDeploymentRecord(activeNetworkName);
  const seekerAddress = getAddress(ownerWalletClient.account.address);
  const ownerBalanceWei = await publicClient.getBalance({
    address: seekerAddress,
  });

  requireFundedOwnerAccount(seekerAddress, ownerBalanceWei, activeNetworkName);

  const gaitaCreditPool = await hardhatConnection.viem.getContractAt(
    "GaitaCreditPool",
    deploymentRecord.deployedContractAddress,
    { client: { wallet: ownerWalletClient, public: publicClient } },
  );

  console.log(`Interacting with GaitaCreditPool on ${activeNetworkName}...`);
  console.log(`Contract: ${deploymentRecord.deployedContractAddress}`);
  console.log(`Seeker: ${seekerAddress}`);

  const updateScoreTransactionHash = await gaitaCreditPool.write.updateScore([
    seekerAddress,
    updatedCreditScore,
  ]);
  await publicClient.waitForTransactionReceipt({
    hash: updateScoreTransactionHash,
  });

  const requestCreditTransactionHash =
    await gaitaCreditPool.write.requestCredit([requestedCreditAmount]);
  await publicClient.waitForTransactionReceipt({
    hash: requestCreditTransactionHash,
  });

  const transactionHashRecord: TransactionHashRecord = {
    networkName: activeNetworkName,
    chainId: activeChainId,
    deployedContractAddress: deploymentRecord.deployedContractAddress,
    seekerAddress,
    updatedCreditScore,
    requestedCreditAmountWei: requestedCreditAmount.toString(),
    updateScoreTransactionHash,
    requestCreditTransactionHash,
    interactedAtIsoDate: new Date().toISOString(),
  };

  await saveTransactionHashRecord(transactionHashRecord);

  console.log(`updateScore transaction: ${updateScoreTransactionHash}`);
  console.log(`requestCredit transaction: ${requestCreditTransactionHash}`);
  console.log(
    `Transaction hashes saved to ${buildTransactionHashesFilePath(activeNetworkName)}`,
  );
}

await interactWithGaitaCreditPool();
