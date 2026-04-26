"use client";

import { useMiniPayCompatibility } from "../hooks/useMiniPayCompatibility";

function shortenWalletAddress(seekerWalletAddress: string) {
  return `${seekerWalletAddress.slice(0, 6)}...${seekerWalletAddress.slice(-4)}`;
}

export function MiniPayCompatibilityPanel() {
  const {
    miniPayCompatibilityStatus,
    preferredCeloNetwork,
    isMiniPayDetected,
    isMiniPayCompatible,
    seekerWalletAddress,
    miniPayCompatibilityMessage,
    connectMiniPayWallet,
  } = useMiniPayCompatibility();

  const compatibilityLabel = isMiniPayCompatible
    ? "MiniPay compatible"
    : "MiniPay required";
  const walletLabel = seekerWalletAddress
    ? shortenWalletAddress(seekerWalletAddress)
    : "Not connected";

  return (
    <section
      aria-label="MiniPay compatibility"
      className="minipay-panel"
      data-minipay-status={miniPayCompatibilityStatus}
    >
      <div>
        <p className="pill">Build for MiniPay</p>
        <h2>MiniPay Seeker Wallet</h2>
        <p>{miniPayCompatibilityMessage}</p>
      </div>

      <div className="minipay-status-grid">
        <div>
          <span>Compatibility</span>
          <strong>{compatibilityLabel}</strong>
        </div>
        <div>
          <span>Provider</span>
          <strong>{isMiniPayDetected ? "Detected" : "Waiting"}</strong>
        </div>
        <div>
          <span>Network</span>
          <strong>{preferredCeloNetwork.name}</strong>
        </div>
        <div>
          <span>Seeker Wallet</span>
          <strong>{walletLabel}</strong>
        </div>
      </div>

      <button
        aria-label="Connect MiniPay wallet"
        className="secondary-button minipay-button"
        disabled={miniPayCompatibilityStatus === "checking"}
        onClick={connectMiniPayWallet}
        type="button"
      >
        Connect MiniPay
      </button>
    </section>
  );
}
