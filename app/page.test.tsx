// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import Home from "./page";

const deployedContractAddress = "0xbf294362cE805Db2B7378122A94f081C627eaD64";
const deployTransactionHash =
  "0xdc2db333e7d7dacf5560ac5925cbaf48c9f1a6c8cde123c09635858a4f9034f6";
const updateScoreTransactionHash =
  "0xe2c53127e567319fe956db9c33696b5a9f4bd75c69450b1f6b4b6a28ca1d38a8";
const requestCreditTransactionHash =
  "0xa3f0c88935360e64a1c9310c5d08911feed8ea3cc0c89bd5b934779321131188";

describe("Home page", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("shows Maria every calculator, Proof of Ship, MiniPay, and onboarding field", async () => {
    render(<Home />);

    const desiredCreditAmountInput = screen.getByLabelText(
      "Desired Credit Amount",
    ) as HTMLInputElement;
    expect(desiredCreditAmountInput.value).toBe("1000");
    expect(desiredCreditAmountInput.readOnly).toBe(false);
    expect(desiredCreditAmountInput.getAttribute("min")).toBe("1");
    expect(desiredCreditAmountInput.getAttribute("max")).toBe("2000");
    fireEvent.change(desiredCreditAmountInput, { target: { value: "1500" } });
    expect(desiredCreditAmountInput.value).toBe("1500");

    const installmentSelector = screen.getByLabelText(
      "Number of Installments",
    ) as HTMLSelectElement;
    expect(installmentSelector.value).toBe("6");
    expect(screen.getByRole("option", { name: "3 installments" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "6 installments" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "9 installments" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "12 installments" })).toBeTruthy();
    expect(screen.getAllByText("$2,000.00").length).toBeGreaterThan(0);
    expect(screen.getByText("$280.00")).toBeTruthy();
    expect(screen.getByText("Interest rate: 2% per month")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Continue with Credit" }));
    expect(localStorage.getItem("creditAmountIntent")).toContain(
      '"desiredCreditAmount":1500',
    );

    expect(screen.getByText(deployedContractAddress)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Contract on CeloScan" }).getAttribute(
        "href",
      ),
    ).toBe(`https://celoscan.io/address/${deployedContractAddress}`);
    expect(screen.getByText(`${deployTransactionHash.slice(0, 10)}...${deployTransactionHash.slice(-8)}`)).toBeTruthy();
    expect(screen.getByText(`${updateScoreTransactionHash.slice(0, 10)}...${updateScoreTransactionHash.slice(-8)}`)).toBeTruthy();
    expect(screen.getByText(`${requestCreditTransactionHash.slice(0, 10)}...${requestCreditTransactionHash.slice(-8)}`)).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByLabelText("MiniPay compatibility")).toBeTruthy();
    });
    expect(screen.getByText("MiniPay Seeker Wallet")).toBeTruthy();

    expect(screen.getByPlaceholderText("Maria Silva")).toBeTruthy();
    expect(screen.getByPlaceholderText("maria@example.com")).toBeTruthy();
    expect(screen.getByPlaceholderText("+55 11 99999-9999")).toBeTruthy();
  });
});
