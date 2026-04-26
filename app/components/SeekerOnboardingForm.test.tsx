// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SeekerOnboardingForm } from "./SeekerOnboardingForm";

const seekerNamePlaceholder = "Maria Silva";
const emailAddressPlaceholder = "maria@example.com";
const phoneNumberPlaceholder = "+55 11 99999-9999";
const verificationCodePlaceholder = "482913";
const generatedIdentitySeed = "12345678-1234-1234-1234-123456789abc";
const fixedCreatedAtTimestamp = 1_777_202_400_000;

function readStoredSeekerSession() {
  const storedSeekerSession = localStorage.getItem("seekerSession");

  if (storedSeekerSession === null) {
    throw new Error("Expected seekerSession to be stored");
  }

  return JSON.parse(storedSeekerSession) as {
    onboardingStatus: string;
    digitalIdentity?: {
      onchainIdentity: string;
      createdAtIsoDate: string;
    };
    reputationData: {
      seekerName: string;
      emailAddress: string;
      phoneNumber: string;
    };
  };
}

describe("SeekerOnboardingForm", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(crypto, "randomUUID").mockReturnValue(generatedIdentitySeed);
    vi.spyOn(Date, "now").mockReturnValue(fixedCreatedAtTimestamp);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("validates placeholders and completes the DigitalIdentity onboarding flow", async () => {
    render(<SeekerOnboardingForm />);

    const seekerNameInput = screen.getByPlaceholderText(seekerNamePlaceholder);
    const emailAddressInput = screen.getByPlaceholderText(
      emailAddressPlaceholder,
    );
    const phoneNumberInput = screen.getByPlaceholderText(phoneNumberPlaceholder);

    expect(seekerNameInput.getAttribute("name")).toBe("seekerName");
    expect(emailAddressInput.getAttribute("name")).toBe("emailAddress");
    expect(phoneNumberInput.getAttribute("name")).toBe("phoneNumber");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simulate VerificationCode Delivery",
      }),
    );

    expect(screen.getByText("Please provide a seekerName")).toBeTruthy();
    expect(screen.getByText("Please provide a valid emailAddress")).toBeTruthy();
    expect(
      screen.getByText(
        "Please provide a phoneNumber with DDD, like +55 11 99999-9999",
      ),
    ).toBeTruthy();

    fireEvent.change(seekerNameInput, {
      target: { value: seekerNamePlaceholder },
    });
    fireEvent.change(emailAddressInput, {
      target: { value: emailAddressPlaceholder },
    });
    fireEvent.change(phoneNumberInput, {
      target: { value: phoneNumberPlaceholder },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: "Simulate VerificationCode Delivery",
      }),
    );

    expect(screen.getByText("Validate VerificationCode")).toBeTruthy();
    expect(screen.getByPlaceholderText(verificationCodePlaceholder)).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText(verificationCodePlaceholder), {
      target: { value: "000000" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Validate Seeker" }));
    expect(
      screen.getByText("Please provide the VerificationCode sent to the Seeker"),
    ).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText(verificationCodePlaceholder), {
      target: { value: verificationCodePlaceholder },
    });
    fireEvent.click(screen.getByRole("button", { name: "Validate Seeker" }));

    expect(screen.getByText("Create DigitalIdentity")).toBeTruthy();
    expect(screen.getByText(seekerNamePlaceholder)).toBeTruthy();
    expect(screen.getByText(emailAddressPlaceholder)).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "Create onchainIdentity" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain(
        "onboardingCompleted",
      );
    });

    const completedSeekerSession = readStoredSeekerSession();
    expect(completedSeekerSession.onboardingStatus).toBe("completed");
    expect(completedSeekerSession.reputationData).toEqual({
      seekerName: seekerNamePlaceholder,
      emailAddress: emailAddressPlaceholder,
      phoneNumber: phoneNumberPlaceholder,
    });
    expect(completedSeekerSession.digitalIdentity?.onchainIdentity).toBe(
      "0x12345678123412341234123456789abc19dc9848b00",
    );
    expect(screen.getByText("DigitalIdentity.onchainIdentity")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "Reset Seeker Onboarding" }),
    );

    await waitFor(() => {
      expect(localStorage.getItem("seekerSession")).toBeNull();
    });
    expect(screen.getByText("Collect Seeker ReputationData")).toBeTruthy();
  });
});
