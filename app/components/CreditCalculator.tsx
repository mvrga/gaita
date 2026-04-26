"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";

const maximumCreditAmount = 2000;
const defaultDesiredCreditAmount = 1000;
const defaultInstallmentCount = 6;
const interestRatePercent = 2;
const installmentOptions = [3, 6, 9, 12];
const creditIntentStorageKey = "creditAmountIntent";

function formatCurrency(creditAmount: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(creditAmount);
}

function normalizeCreditAmount(requestedCreditAmount: number) {
  if (Number.isNaN(requestedCreditAmount)) {
    return 1;
  }

  return Math.min(Math.max(requestedCreditAmount, 1), maximumCreditAmount);
}

function scrollToSeekerOnboarding() {
  const onboardingSection = document.getElementById("onboarding");

  if (onboardingSection === null) {
    return;
  }

  if (typeof onboardingSection.scrollIntoView !== "function") {
    return;
  }

  onboardingSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function CreditCalculator() {
  const [desiredCreditAmount, setDesiredCreditAmount] = useState<number>(
    defaultDesiredCreditAmount,
  );
  const [installmentCount, setInstallmentCount] = useState<number>(
    defaultInstallmentCount,
  );

  const monthlyPaymentAmount = useMemo(() => {
    const totalCreditAmountWithInterest =
      desiredCreditAmount * (1 + (interestRatePercent / 100) * installmentCount);
    const monthlyPaymentValue = totalCreditAmountWithInterest / installmentCount;

    return formatCurrency(monthlyPaymentValue);
  }, [desiredCreditAmount, installmentCount]);

  function updateDesiredCreditAmount(changeEvent: ChangeEvent<HTMLInputElement>) {
    setDesiredCreditAmount(normalizeCreditAmount(changeEvent.target.valueAsNumber));
  }

  function updateInstallmentCount(changeEvent: ChangeEvent<HTMLSelectElement>) {
    setInstallmentCount(Number(changeEvent.target.value));
  }

  function continueWithCreditAmount() {
    localStorage.setItem(
      creditIntentStorageKey,
      JSON.stringify({
        desiredCreditAmount,
        installmentCount,
        interestRatePercent,
        monthlyPaymentAmount,
      }),
    );
    scrollToSeekerOnboarding();
  }

  return (
    <aside className="credit-calculator" aria-label="Credit calculator">
      <div className="calculator-header">
        <p>Your Available Credit</p>
        <strong>{formatCurrency(maximumCreditAmount)}</strong>
      </div>
      <label htmlFor="credit-amount">Desired Credit Amount</label>
      <div className="currency-input">
        <span>$</span>
        <input
          id="credit-amount"
          max={maximumCreditAmount}
          min={1}
          name="desiredCreditAmount"
          onChange={updateDesiredCreditAmount}
          type="number"
          value={desiredCreditAmount}
        />
      </div>
      <p className="input-help">
        Maximum: {formatCurrency(maximumCreditAmount)}
      </p>

      <label htmlFor="installments">Number of Installments</label>
      <select
        id="installments"
        name="installmentCount"
        onChange={updateInstallmentCount}
        value={installmentCount}
      >
        {installmentOptions.map((installmentOption) => (
          <option key={installmentOption} value={installmentOption}>
            {installmentOption} installments
          </option>
        ))}
      </select>

      <div className="payment-panel">
        <p>Your Monthly Payment</p>
        <strong>{monthlyPaymentAmount}</strong>
        <span>Interest rate: {interestRatePercent}% per month</span>
      </div>

      <button
        className="primary-button calculator-button"
        onClick={continueWithCreditAmount}
        type="button"
      >
        Continue with Credit
      </button>
    </aside>
  );
}
