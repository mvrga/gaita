// @vitest-environment jsdom

import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useMiniPayCompatibility } from "./useMiniPayCompatibility";

const seekerAddress = "0x1111111111111111111111111111111111111111";

type ProviderRequest = {
  method: string;
};

type MockMiniPayProvider = {
  isMiniPay: boolean;
  request: ReturnType<typeof vi.fn<[ProviderRequest], Promise<string[]>>>;
};

function assignMiniPayProvider(miniPayProvider: MockMiniPayProvider) {
  Object.defineProperty(window, "ethereum", {
    configurable: true,
    value: miniPayProvider,
  });
}

function clearMiniPayProvider() {
  Object.defineProperty(window, "ethereum", {
    configurable: true,
    value: undefined,
  });
}

describe("useMiniPayCompatibility", () => {
  afterEach(() => {
    clearMiniPayProvider();
    vi.restoreAllMocks();
  });

  it("marks the MiniPay wallet as unavailable when no injected provider exists", async () => {
    clearMiniPayProvider();

    const { result } = renderHook(() => useMiniPayCompatibility());

    await waitFor(() => {
      expect(result.current.miniPayCompatibilityStatus).toBe("unavailable");
    });

    expect(result.current.isMiniPayCompatible).toBe(false);
    expect(result.current.seekerWalletAddress).toBeUndefined();
  });

  it("detects a MiniPay provider and resolves the Seeker wallet address", async () => {
    const miniPayProvider: MockMiniPayProvider = {
      isMiniPay: true,
      request: vi.fn(async ({ method }: ProviderRequest) => {
        if (method === "eth_accounts") {
          return [seekerAddress];
        }

        return [];
      }),
    };
    assignMiniPayProvider(miniPayProvider);

    const { result } = renderHook(() => useMiniPayCompatibility());

    await waitFor(() => {
      expect(result.current.miniPayCompatibilityStatus).toBe("connected");
    });

    expect(result.current.isMiniPayCompatible).toBe(true);
    expect(result.current.isMiniPayDetected).toBe(true);
    expect(result.current.seekerWalletAddress).toBe(seekerAddress);
    expect(result.current.preferredCeloNetwork.name).toBe("Celo");
  });
});
