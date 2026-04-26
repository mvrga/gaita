import { SeekerOnboardingForm } from "./components/SeekerOnboardingForm";

type OnchainTransactionKind = "deploy" | "creditScore" | "creditRequest";

type BenefitCard = {
  benefitTitle: string;
  benefitDescription: string;
  benefitIcon: string;
};

type PipelineStage = {
  pipelineStageNumber: number;
  stageTitle: string;
  stageDescription: string;
  accentClassName: string;
  stageDetails?: string[];
};

type OnchainTransaction = {
  onchainTransactionKind: OnchainTransactionKind;
  transactionTitle: string;
  functionName: string;
  transactionHash: `0x${string}`;
  transactionDescription: string;
};

const availableCreditAmount = "$2,000";
const desiredCreditAmount = 1000;
const monthlyPaymentAmount = "$186.67";
const interestRatePercent = 2;
const deployedContractAddress = "0x0000000000000000000000000000000000000000";
const celoScanBaseUrl = "https://celoscan.io";

const benefitCards: BenefitCard[] = [
  {
    benefitTitle: "Smart Credit Building",
    benefitDescription:
      "Instead of relying on traditional bureaus, GAITA turns behavior and repayment trust into Web3 reputation.",
    benefitIcon: "01",
  },
  {
    benefitTitle: "Transparent Record",
    benefitDescription:
      "Approvals are emitted as on-chain events, creating a verifiable trail for the Seeker and the protocol.",
    benefitIcon: "02",
  },
  {
    benefitTitle: "Privacy Protected",
    benefitDescription:
      "The contract stores only the score needed for approval, keeping sensitive off-chain context outside the pool.",
    benefitIcon: "03",
  },
  {
    benefitTitle: "Fair Credit Access",
    benefitDescription:
      "A Seeker with CreditScore >= 50 can request credit without banking history or duplicated active loans.",
    benefitIcon: "04",
  },
];

const pipelineStages: PipelineStage[] = [
  {
    pipelineStageNumber: 1,
    stageTitle: "Web2 Reputation Analysis",
    stageDescription:
      "Behavioral signals are translated into the CreditScore value object, using a 0-100 scale.",
    accentClassName: "accent-blue",
  },
  {
    pipelineStageNumber: 2,
    stageTitle: "Financial Pool Formation",
    stageDescription:
      "The CreditPool aggregate represents the lending pool and keeps approval state consistent.",
    accentClassName: "accent-purple",
    stageDetails: [
      "30% for stability reserve",
      "50% for investors and recovery",
      "20% for direct credit execution",
    ],
  },
  {
    pipelineStageNumber: 3,
    stageTitle: "Smart Contract Approval",
    stageDescription:
      "GaitaCreditPool.sol checks score, active credit, and emits CreditApproved when the request is valid.",
    accentClassName: "accent-cyan",
  },
  {
    pipelineStageNumber: 4,
    stageTitle: "Credit to Transform Lives",
    stageDescription:
      "Approved users receive a verifiable credit decision they can use to build financial reputation.",
    accentClassName: "accent-green",
  },
];

const onchainTransactionHashes: OnchainTransaction[] = [
  {
    onchainTransactionKind: "deploy",
    transactionTitle: "Deploy GaitaCreditPool",
    functionName: "constructor()",
    transactionHash:
      "0x1111111111111111111111111111111111111111111111111111111111111111",
    transactionDescription:
      "Publishes the aggregate on Celo mainnet and defines the deployer as Owner.",
  },
  {
    onchainTransactionKind: "creditScore",
    transactionTitle: "Owner updates CreditScore",
    functionName: "updateScore(seekerAddress, creditScore)",
    transactionHash:
      "0x2222222222222222222222222222222222222222222222222222222222222222",
    transactionDescription:
      "Registers a 0-100 score. Only the Owner can update this value object.",
  },
  {
    onchainTransactionKind: "creditRequest",
    transactionTitle: "Seeker requests CreditAmount",
    functionName: "requestCredit(creditAmount)",
    transactionHash:
      "0x3333333333333333333333333333333333333333333333333333333333333333",
    transactionDescription:
      "Approves credit when score is at least 50 and no active credit exists.",
  },
];

function getContractUrl(contractAddress: string) {
  return `${celoScanBaseUrl}/address/${contractAddress}`;
}

function getTransactionUrl(transactionHash: string) {
  return `${celoScanBaseUrl}/tx/${transactionHash}`;
}

function shortenHash(transactionHash: string) {
  return `${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}`;
}

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero-section">
        <div className="gradient-field" aria-hidden="true" />
        <div className="page-container hero-grid">
          <div className="hero-copy">
            <p className="pill">Proof of Ship on Celo</p>
            <h1>
              <span>GAITA</span>
            </h1>
            <h2>
              Your Web3 Financial Reputation
              <strong> Starts Here</strong>
            </h2>
            <p className="hero-lead">
              Empowering the invisible to build trust and access credit through
              decentralized innovation.
            </p>
            <div className="glass-note">
              GAITA uses <strong>GaitaCreditPool.sol</strong> as the on-chain
              aggregate: Seeker, CreditScore, CreditAmount, and approval rules
              become auditable Celo transactions.
            </div>
            <div className="hero-actions">
              <a className="primary-button" href="#onboarding">
                Start Building Your Reputation
              </a>
              <a className="secondary-button" href="#proof">
                View Proof of Ship
              </a>
            </div>
          </div>

          <aside className="credit-calculator" aria-label="Credit calculator">
            <div className="calculator-header">
              <p>Your Available Credit</p>
              <strong>{availableCreditAmount}</strong>
            </div>
            <label htmlFor="credit-amount">Desired Credit Amount</label>
            <div className="currency-input">
              <span>$</span>
              <input
                id="credit-amount"
                max={2000}
                min={1}
                name="creditAmount"
                readOnly
                type="number"
                value={desiredCreditAmount}
              />
            </div>
            <p className="input-help">Maximum: {availableCreditAmount}</p>

            <label htmlFor="installments">Number of Installments</label>
            <select id="installments" name="installments" defaultValue="6">
              <option value="3">3 installments</option>
              <option value="6">6 installments</option>
              <option value="9">9 installments</option>
              <option value="12">12 installments</option>
            </select>

            <div className="payment-panel">
              <p>Your Monthly Payment</p>
              <strong>{monthlyPaymentAmount}</strong>
              <span>Interest rate: {interestRatePercent}% per month</span>
            </div>

            <button className="primary-button calculator-button" type="button">
              Continue with Credit
            </button>
          </aside>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>
            Why Choose <span>GAITA</span>?
          </h2>
          <p>
            Simple, secure, and fair financial reputation building for everyone.
          </p>
        </div>
        <div className="page-container benefit-grid">
          {benefitCards.map((benefitCard) => (
            <article
              className="glass-card benefit-card"
              key={benefitCard.benefitTitle}
            >
              <div className="card-icon">{benefitCard.benefitIcon}</div>
              <h3>{benefitCard.benefitTitle}</h3>
              <p>{benefitCard.benefitDescription}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section process-section">
        <div className="section-heading">
          <div className="spark-badge">✦</div>
          <h2>
            How It <span>Works</span>
          </h2>
          <p>
            The old GAITA journey now connects directly to the contract rules
            tested in this project.
          </p>
        </div>
        <div className="page-container process-list">
          {pipelineStages.map((pipelineStage) => (
            <article
              className={`process-step ${pipelineStage.accentClassName}`}
              key={pipelineStage.stageTitle}
            >
              <div className="process-copy">
                <div className="step-title-row">
                  <span>{pipelineStage.pipelineStageNumber}</span>
                  <h3>{pipelineStage.stageTitle}</h3>
                </div>
                <p>{pipelineStage.stageDescription}</p>
                {pipelineStage.stageDetails ? (
                  <ul>
                    {pipelineStage.stageDetails.map((stageDetail) => (
                      <li key={stageDetail}>{stageDetail}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="step-visual">
                <div>{pipelineStage.pipelineStageNumber}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section proof-section" id="proof">
        <div className="page-container proof-grid">
          <div>
            <p className="pill">On-chain evidence</p>
            <h2>
              Proof of Ship: <span>GaitaCreditPool.sol</span>
            </h2>
            <p>
              Esta seção mostra a prova pública do fluxo: deploy do contrato,
              atualização de CreditScore pelo Owner e pedido de crédito pelo
              Seeker.
              Os hashes são placeholders até o deploy real no Remix.
            </p>
            <a
              className="secondary-button"
              href={getContractUrl(deployedContractAddress)}
            >
              Contract on CeloScan
            </a>
          </div>

          <div className="glass-card contract-card">
            <div className="contract-row">
              <span>Contract</span>
              <strong>GaitaCreditPool</strong>
            </div>
            <div className="contract-row">
              <span>Address</span>
              <code>{deployedContractAddress}</code>
            </div>
            <div className="contract-rules">
              <div>creditScore[seekerAddress] stores 0-100</div>
              <div>hasActiveCredit[seekerAddress] blocks duplicates</div>
              <div>onlyOwner protects updateScore()</div>
              <div>requestCredit() requires score &gt;= 50</div>
            </div>
          </div>
        </div>

        <div className="page-container transaction-list">
          {onchainTransactionHashes.map(
            (onchainTransaction, onchainTransactionIndex) => (
            <article
              className="transaction-card"
              key={onchainTransaction.transactionHash}
            >
              <div className="transaction-index">
                {(onchainTransactionIndex + 1).toString().padStart(2, "0")}
              </div>
              <div>
                <span>{onchainTransaction.functionName}</span>
                <h3>{onchainTransaction.transactionTitle}</h3>
                <p>{onchainTransaction.transactionDescription}</p>
                <code>{shortenHash(onchainTransaction.transactionHash)}</code>
              </div>
              <a href={getTransactionUrl(onchainTransaction.transactionHash)}>
                CeloScan
              </a>
            </article>
            ),
          )}
        </div>
      </section>

      <section className="page-section onboarding-section" id="onboarding">
        <div className="section-heading">
          <h2>
            Ready to Start Your <span>Financial Journey</span>?
          </h2>
          <p>
            A recreated four-step onboarding flow that prepares a Seeker for
            reputation scoring and credit approval.
          </p>
        </div>

        <SeekerOnboardingForm />
      </section>
    </main>
  );
}
