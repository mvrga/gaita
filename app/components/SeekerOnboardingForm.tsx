"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

type OnboardingStatus = "collecting" | "verifying" | "creating" | "completed";

type ReputationData = {
  seekerName: string;
  emailAddress: string;
  phoneNumber: string;
};

type VerificationCode = {
  expectedVerificationCode: string;
  providedVerificationCode: string;
};

type DigitalIdentity = {
  onchainIdentity: `0x${string}`;
  createdAtIsoDate: string;
};

type SeekerSession = {
  reputationData: ReputationData;
  verificationCode: VerificationCode;
  digitalIdentity?: DigitalIdentity;
  onboardingStatus: OnboardingStatus;
};

type ReputationValidationErrors = Partial<Record<keyof ReputationData, string>>;

type OnboardingStage = {
  onboardingStageNumber: number;
  onboardingStageTitle: string;
  onboardingStageDescription: string;
  onboardingStageIcon: string;
};

const seekerSessionStorageKey = "seekerSession";

const onboardingStages: OnboardingStage[] = [
  {
    onboardingStageNumber: 1,
    onboardingStageTitle: "Seeker ReputationData",
    onboardingStageDescription: "Collect seekerName, emailAddress, and phoneNumber.",
    onboardingStageIcon: "S",
  },
  {
    onboardingStageNumber: 2,
    onboardingStageTitle: "VerificationCode",
    onboardingStageDescription:
      "Simulate a VerificationCode delivery and let the Seeker validate it.",
    onboardingStageIcon: "V",
  },
  {
    onboardingStageNumber: 3,
    onboardingStageTitle: "DigitalIdentity",
    onboardingStageDescription: "Create a fake onchainIdentity for the onboarding session.",
    onboardingStageIcon: "D",
  },
  {
    onboardingStageNumber: 4,
    onboardingStageTitle: "onboardingCompleted",
    onboardingStageDescription: "Confirm completion and reset the onboarding flow.",
    onboardingStageIcon: "C",
  },
];

const initialReputationData: ReputationData = {
  seekerName: "",
  emailAddress: "",
  phoneNumber: "",
};

const initialVerificationCode: VerificationCode = {
  expectedVerificationCode: "",
  providedVerificationCode: "",
};

function createVerificationCode(): string {
  return "482913";
}

function createOnchainIdentity(): `0x${string}` {
  const randomIdentitySeed = crypto.randomUUID().replaceAll("-", "");
  return `0x${randomIdentitySeed}${Date.now().toString(16)}`;
}

function validateReputationData(
  reputationData: ReputationData,
): ReputationValidationErrors {
  const validationErrors: ReputationValidationErrors = {};
  const trimmedSeekerName = reputationData.seekerName.trim();
  const trimmedEmailAddress = reputationData.emailAddress.trim();
  const normalizedPhoneNumber = reputationData.phoneNumber.replace(/\D/g, "");
  const validEmailAddressPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hasValidBrazilianPhoneNumber =
    normalizedPhoneNumber.length === 12 || normalizedPhoneNumber.length === 13;
  const hasBrazilCountryCode = normalizedPhoneNumber.startsWith("55");

  if (!trimmedSeekerName) {
    validationErrors.seekerName = "Please provide a seekerName";
  }

  if (!validEmailAddressPattern.test(trimmedEmailAddress)) {
    validationErrors.emailAddress = "Please provide a valid emailAddress";
  }

  if (!hasBrazilCountryCode || !hasValidBrazilianPhoneNumber) {
    validationErrors.phoneNumber =
      "Please provide a phoneNumber with DDD, like +55 11 99999-9999";
  }

  return validationErrors;
}

function getOnboardingStageNumber(onboardingStatus: OnboardingStatus): number {
  const onboardingStageNumberByStatus: Record<OnboardingStatus, number> = {
    collecting: 1,
    verifying: 2,
    creating: 3,
    completed: 4,
  };

  return onboardingStageNumberByStatus[onboardingStatus];
}

export function SeekerOnboardingForm() {
  const [reputationData, setReputationData] =
    useState<ReputationData>(initialReputationData);
  const [verificationCode, setVerificationCode] = useState<VerificationCode>(
    initialVerificationCode,
  );
  const [digitalIdentity, setDigitalIdentity] = useState<
    DigitalIdentity | undefined
  >();
  const [onboardingStatus, setOnboardingStatus] =
    useState<OnboardingStatus>("collecting");
  const [validationErrors, setValidationErrors] =
    useState<ReputationValidationErrors>({});
  const [verificationError, setVerificationError] = useState<string>("");
  const [shouldPersistSeekerSession, setShouldPersistSeekerSession] =
    useState<boolean>(false);

  const onboardingStageNumber = getOnboardingStageNumber(onboardingStatus);
  const onboardingProgressPercent = onboardingStageNumber * 25;
  const successToast =
    onboardingStatus === "completed"
      ? "onboardingCompleted: Seeker is ready for CreditScore evaluation."
      : "";

  const seekerSession = useMemo<SeekerSession>(
    () => ({
      reputationData,
      verificationCode,
      digitalIdentity,
      onboardingStatus,
    }),
    [digitalIdentity, onboardingStatus, reputationData, verificationCode],
  );

  useEffect(() => {
    if (!shouldPersistSeekerSession) {
      localStorage.removeItem(seekerSessionStorageKey);
      return;
    }

    localStorage.setItem(
      seekerSessionStorageKey,
      JSON.stringify(seekerSession),
    );
  }, [seekerSession, shouldPersistSeekerSession]);

  function updateReputationData(reputationDataField: keyof ReputationData) {
    return function handleReputationDataChange(
      changeEvent: ChangeEvent<HTMLInputElement>,
    ) {
      setReputationData((currentReputationData) => ({
        ...currentReputationData,
        [reputationDataField]: changeEvent.target.value,
      }));
      setShouldPersistSeekerSession(true);
      setValidationErrors((currentValidationErrors) => ({
        ...currentValidationErrors,
        [reputationDataField]: undefined,
      }));
    };
  }

  function submitReputationData() {
    const nextValidationErrors = validateReputationData(reputationData);
    setValidationErrors(nextValidationErrors);

    if (Object.keys(nextValidationErrors).length > 0) {
      return;
    }

    setVerificationCode({
      expectedVerificationCode: createVerificationCode(),
      providedVerificationCode: "",
    });
    setReputationData({
      seekerName: reputationData.seekerName.trim(),
      emailAddress: reputationData.emailAddress.trim(),
      phoneNumber: reputationData.phoneNumber.trim(),
    });
    setOnboardingStatus("verifying");
  }

  function updateProvidedVerificationCode(
    changeEvent: ChangeEvent<HTMLInputElement>,
  ) {
    setVerificationCode((currentVerificationCode) => ({
      ...currentVerificationCode,
      providedVerificationCode: changeEvent.target.value,
    }));
    setVerificationError("");
  }

  function submitVerificationCode() {
    if (
      verificationCode.providedVerificationCode !==
      verificationCode.expectedVerificationCode
    ) {
      setVerificationError("Please provide the VerificationCode sent to the Seeker");
      return;
    }

    setOnboardingStatus("creating");
  }

  function createDigitalIdentity() {
    setDigitalIdentity({
      onchainIdentity: createOnchainIdentity(),
      createdAtIsoDate: new Date().toISOString(),
    });
    setOnboardingStatus("completed");
  }

  function resetSeekerOnboarding() {
    setReputationData(initialReputationData);
    setVerificationCode(initialVerificationCode);
    setDigitalIdentity(undefined);
    setValidationErrors({});
    setVerificationError("");
    setOnboardingStatus("collecting");
    setShouldPersistSeekerSession(false);
  }

  return (
    <div className="page-container onboarding-grid">
      <aside
        aria-label="Seeker onboarding process"
        className="creation-process"
      >
        <h3>Seeker Onboarding Process</h3>
        {onboardingStages.map((onboardingStage) => (
          <div
            className={
              onboardingStage.onboardingStageNumber === onboardingStageNumber
                ? "onboarding-step active-onboarding-step"
                : "onboarding-step"
            }
            key={onboardingStage.onboardingStageTitle}
          >
            <div className="step-marker">
              <span>{onboardingStage.onboardingStageNumber}</span>
              {onboardingStage.onboardingStageNumber <
              onboardingStages.length ? (
                <span aria-hidden="true" className="step-line" />
              ) : null}
            </div>
            <div>
              <h4>
                <span>{onboardingStage.onboardingStageIcon}</span>
                {onboardingStage.onboardingStageTitle}
              </h4>
              <p>{onboardingStage.onboardingStageDescription}</p>
            </div>
          </div>
        ))}
        <div className="security-box">
          <h4>Security Guarantees</h4>
          <p>End-to-end cryptography</p>
          <p>Full LGPD compliance</p>
          <p>Seeker controls shared ReputationData</p>
          <p>International Web3 standard</p>
        </div>
      </aside>

      <form
        aria-label="Seeker onboarding form"
        className="onboarding-form"
        onSubmit={(submitEvent) => submitEvent.preventDefault()}
      >
        {successToast ? (
          <div aria-live="polite" className="success-toast" role="status">
            {successToast}
          </div>
        ) : null}

        <div className="progress-row">
          <span>Step {onboardingStageNumber} of 4</span>
          <strong>{onboardingProgressPercent}%</strong>
        </div>
        <div
          aria-label="Seeker onboarding progress"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={onboardingProgressPercent}
          className="progress-track"
          role="progressbar"
        >
          <span style={{ width: `${onboardingProgressPercent}%` }} />
        </div>

        {onboardingStatus === "collecting" ? (
          <section aria-label="Collect Seeker ReputationData">
            <div className="form-heading">
              <div>S</div>
              <h3>Collect Seeker ReputationData</h3>
              <p>Start with the fields used to evaluate financial reputation.</p>
            </div>

            <label htmlFor="seeker-name">seekerName</label>
            <input
              aria-describedby={
                validationErrors.seekerName ? "seeker-name-error" : undefined
              }
              aria-invalid={Boolean(validationErrors.seekerName)}
              id="seeker-name"
              name="seekerName"
              onChange={updateReputationData("seekerName")}
              placeholder="Maria Silva"
              value={reputationData.seekerName}
            />
            {validationErrors.seekerName ? (
              <p className="field-error" id="seeker-name-error">
                {validationErrors.seekerName}
              </p>
            ) : null}

            <label htmlFor="email-address">emailAddress</label>
            <input
              aria-describedby={
                validationErrors.emailAddress
                  ? "email-address-error"
                  : undefined
              }
              aria-invalid={Boolean(validationErrors.emailAddress)}
              id="email-address"
              name="emailAddress"
              onChange={updateReputationData("emailAddress")}
              placeholder="maria@example.com"
              type="email"
              value={reputationData.emailAddress}
            />
            {validationErrors.emailAddress ? (
              <p className="field-error" id="email-address-error">
                {validationErrors.emailAddress}
              </p>
            ) : null}

            <label htmlFor="phone-number">phoneNumber</label>
            <input
              aria-describedby={
                validationErrors.phoneNumber ? "phone-number-error" : undefined
              }
              aria-invalid={Boolean(validationErrors.phoneNumber)}
              id="phone-number"
              name="phoneNumber"
              onChange={updateReputationData("phoneNumber")}
              placeholder="+55 11 99999-9999"
              value={reputationData.phoneNumber}
            />
            {validationErrors.phoneNumber ? (
              <p className="field-error" id="phone-number-error">
                {validationErrors.phoneNumber}
              </p>
            ) : null}

            <button
              className="primary-button calculator-button"
              onClick={submitReputationData}
              type="button"
            >
              Simulate VerificationCode Delivery
            </button>
          </section>
        ) : null}

        {onboardingStatus === "verifying" ? (
          <section aria-label="Validate Seeker VerificationCode">
            <div className="form-heading">
              <div>V</div>
              <h3>Validate VerificationCode</h3>
              <p>
                Simulated VerificationCode sent to the Seeker:{" "}
                <strong>{verificationCode.expectedVerificationCode}</strong>
              </p>
            </div>

            <label htmlFor="verification-code">VerificationCode</label>
            <input
              aria-describedby={
                verificationError ? "verification-code-error" : undefined
              }
              aria-invalid={Boolean(verificationError)}
              id="verification-code"
              inputMode="numeric"
              name="verificationCode"
              onChange={updateProvidedVerificationCode}
              placeholder="482913"
              value={verificationCode.providedVerificationCode}
            />
            {verificationError ? (
              <p className="field-error" id="verification-code-error">
                {verificationError}
              </p>
            ) : null}

            <div className="form-action-row">
              <button
                className="secondary-button"
                onClick={() => setOnboardingStatus("collecting")}
                type="button"
              >
                Back to ReputationData
              </button>
              <button
                className="primary-button"
                onClick={submitVerificationCode}
                type="button"
              >
                Validate Seeker
              </button>
            </div>
          </section>
        ) : null}

        {onboardingStatus === "creating" ? (
          <section aria-label="Create Seeker DigitalIdentity">
            <div className="form-heading">
              <div>D</div>
              <h3>Create DigitalIdentity</h3>
              <p>
                Generate a fake onchainIdentity that can later be replaced by a
                deployed identity transaction.
              </p>
            </div>
            <div className="identity-preview">
              <span>Seeker</span>
              <strong>{reputationData.seekerName}</strong>
              <span>emailAddress</span>
              <strong>{reputationData.emailAddress}</strong>
            </div>
            <button
              className="primary-button calculator-button"
              onClick={createDigitalIdentity}
              type="button"
            >
              Create onchainIdentity
            </button>
          </section>
        ) : null}

        {onboardingStatus === "completed" ? (
          <section aria-label="Seeker onboarding completed">
            <div className="form-heading">
              <div>C</div>
              <h3>onboardingCompleted</h3>
              <p>
                The Seeker session is saved as seekerSession and ready for
                CreditScore evaluation.
              </p>
            </div>
            <div className="identity-preview">
              <span>DigitalIdentity.onchainIdentity</span>
              <code>{digitalIdentity?.onchainIdentity}</code>
              <span>ReputationData owner</span>
              <strong>{reputationData.seekerName}</strong>
            </div>
            <button
              className="primary-button calculator-button"
              onClick={resetSeekerOnboarding}
              type="button"
            >
              Reset Seeker Onboarding
            </button>
          </section>
        ) : null}
      </form>
    </div>
  );
}
