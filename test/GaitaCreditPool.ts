import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { getAddress, parseEther } from "viem";

describe("GaitaCreditPool", async function () {
  const { viem } = await network.create();

  async function deployCreditPoolFixture() {
    const [ownerWallet, userWallet, outsiderWallet] =
      await viem.getWalletClients();
    const creditPool = await viem.deployContract("GaitaCreditPool");

    const creditPoolAsUser = await viem.getContractAt(
      "GaitaCreditPool",
      creditPool.address,
      { client: { wallet: userWallet } },
    );
    const creditPoolAsOutsider = await viem.getContractAt(
      "GaitaCreditPool",
      creditPool.address,
      { client: { wallet: outsiderWallet } },
    );

    return {
      creditPool,
      creditPoolAsUser,
      creditPoolAsOutsider,
      ownerAddress: getAddress(ownerWallet.account.address),
      userAddress: getAddress(userWallet.account.address),
      outsiderAddress: getAddress(outsiderWallet.account.address),
    };
  }

  it("updateScore() reverts when the caller is not the owner", async function () {
    const { creditPoolAsOutsider, userAddress } =
      await deployCreditPoolFixture();

    await assert.rejects(
      creditPoolAsOutsider.write.updateScore([userAddress, 70]),
      /Only owner can update credit scores/,
    );
  });

  it("updateScore() accepts scores between 0 and 100", async function () {
    const { creditPool, userAddress } = await deployCreditPoolFixture();

    await creditPool.write.updateScore([userAddress, 0]);
    assert.equal(await creditPool.read.creditScore([userAddress]), 0);

    await creditPool.write.updateScore([userAddress, 100]);
    assert.equal(await creditPool.read.creditScore([userAddress]), 100);

    await assert.rejects(
      creditPool.write.updateScore([userAddress, 101]),
      /Credit score must be between 0 and 100/,
    );
  });

  it("updateScore() emits ScoreUpdated", async function () {
    const { creditPool, userAddress, ownerAddress } =
      await deployCreditPoolFixture();

    await viem.assertions.emitWithArgs(
      creditPool.write.updateScore([userAddress, 80]),
      creditPool,
      "ScoreUpdated",
      [userAddress, 80, ownerAddress],
    );
  });

  it("requestCredit() reverts when score is below 50", async function () {
    const { creditPool, creditPoolAsUser, userAddress } =
      await deployCreditPoolFixture();

    await creditPool.write.updateScore([userAddress, 49]);

    await assert.rejects(
      creditPoolAsUser.write.requestCredit([parseEther("10")]),
      /Credit score must be at least 50/,
    );
  });

  it("requestCredit() reverts when user already has active credit", async function () {
    const { creditPool, creditPoolAsUser, userAddress } =
      await deployCreditPoolFixture();

    await creditPool.write.updateScore([userAddress, 75]);
    await creditPoolAsUser.write.requestCredit([parseEther("10")]);

    await assert.rejects(
      creditPoolAsUser.write.requestCredit([parseEther("5")]),
      /User already has active credit/,
    );
  });

  it("requestCredit() emits CreditApproved when approved", async function () {
    const { creditPool, creditPoolAsUser, userAddress } =
      await deployCreditPoolFixture();

    await creditPool.write.updateScore([userAddress, 90]);

    const requestedAmount = parseEther("25");
    await viem.assertions.emitWithArgs(
      creditPoolAsUser.write.requestCredit([requestedAmount]),
      creditPool,
      "CreditApproved",
      [userAddress, requestedAmount, 90],
    );
    assert.equal(await creditPool.read.hasActiveCredit([userAddress]), true);
  });
});
