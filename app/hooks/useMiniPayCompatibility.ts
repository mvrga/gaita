"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { celo, celoSepolia } from "viem/chains";
import type { Address, Chain } from "viem";

type MiniPayCompatibilityStatus =
  | "checking"
  | "detected"
  | "connected"
  | "unavailable"
  | "failed";

type MiniPayProviderRequest = {
  method: string;
  params?: unknown[];
};

type MiniPayProvider = {
  isMiniPay?: boolean;
  request: (miniPayProviderRequest: MiniPayProviderRequest) => Promise<unknown>;
};

type MiniPayWindow = Window & {
  ethereum?: MiniPayProvider;
  provider?: MiniPayProvider;
};

type MiniPayCompatibility = {
  miniPayCompatibilityStatus: MiniPayCompatibilityStatus;
  preferredCeloNetwork: Chain;
  isMiniPayDetected: boolean;
  isMiniPayCompatible: boolean;
  seekerWalletAddress?: Address;
  miniPayCompatibilityMessage: string;
  connectMiniPayWallet: () => Promise<void>;
};

function getPreferredCeloNetwork(): Chain {
  return process.env.NEXT_PUBLIC_NETWORK === "sepolia" ? celoSepolia : celo;
}

function readMiniPayProvider(): MiniPayProvider | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const miniPayWindow = window as MiniPayWindow;
  return miniPayWindow.ethereum ?? miniPayWindow.provider;
}

function isAddressList(providerResponse: unknown): providerResponse is Address[] {
  return (
    Array.isArray(providerResponse) &&
    providerResponse.every(
      (providerAddress) =>
        typeof providerAddress === "string" && providerAddress.startsWith("0x"),
    )
  );
}

function detectMiniPayUserAgent(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /MiniPay|Opera Mini/i.test(navigator.userAgent);
}

export function useMiniPayCompatibility(): MiniPayCompatibility {
  const preferredCeloNetwork = useMemo(() => getPreferredCeloNetwork(), []);
  const [miniPayCompatibilityStatus, setMiniPayCompatibilityStatus] =
    useState<MiniPayCompatibilityStatus>("checking");
  const [isMiniPayDetected, setIsMiniPayDetected] = useState<boolean>(false);
  const [seekerWalletAddress, setSeekerWalletAddress] = useState<
    Address | undefined
  >();

  const resolveMiniPayWallet = useCallback(
    async (shouldRequestPermission: boolean) => {
      const miniPayProvider = readMiniPayProvider();
      const hasMiniPayUserAgent = detectMiniPayUserAgent();

      if (miniPayProvider === undefined) {
        setIsMiniPayDetected(hasMiniPayUserAgent);
        setMiniPayCompatibilityStatus("unavailable");
        return;
      }

      setIsMiniPayDetected(Boolean(miniPayProvider.isMiniPay) || hasMiniPayUserAgent);

      const providerMethod = shouldRequestPermission
        ? "eth_requestAccounts"
        : "eth_accounts";
      const providerResponse = await miniPayProvider.request({
        method: providerMethod,
      });

      if (isAddressList(providerResponse) && providerResponse.length > 0) {
        setSeekerWalletAddress(providerResponse[0]);
        setMiniPayCompatibilityStatus("connected");
        return;
      }

      setMiniPayCompatibilityStatus("detected");
    },
    [],
  );

  useEffect(() => {
    resolveMiniPayWallet(false).catch(() => {
      setMiniPayCompatibilityStatus("failed");
    });
  }, [resolveMiniPayWallet]);

  const connectMiniPayWallet = useCallback(async () => {
    try {
      await resolveMiniPayWallet(true);
    } catch {
      setMiniPayCompatibilityStatus("failed");
    }
  }, [resolveMiniPayWallet]);

  const isMiniPayCompatible =
    miniPayCompatibilityStatus === "detected" ||
    miniPayCompatibilityStatus === "connected";

  const miniPayCompatibilityMessage =
    miniPayCompatibilityStatus === "connected"
      ? "MiniPay wallet connected to the Seeker session."
      : miniPayCompatibilityStatus === "detected"
        ? "MiniPay provider detected. Connect to continue with Celo."
        : miniPayCompatibilityStatus === "unavailable"
          ? "Open this app inside MiniPay to use the embedded Celo wallet."
          : miniPayCompatibilityStatus === "failed"
            ? "MiniPay provider was detected, but the wallet request failed."
            : "Checking MiniPay compatibility.";

  return {
    miniPayCompatibilityStatus,
    preferredCeloNetwork,
    isMiniPayDetected,
    isMiniPayCompatible,
    seekerWalletAddress,
    miniPayCompatibilityMessage,
    connectMiniPayWallet,
  };
}
