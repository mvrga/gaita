type TransactionKind = "deploy" | "score" | "credit";

type BenefitCard = {
  title: string;
  description: string;
  icon: string;
};

type ProcessStep = {
  title: string;
  description: string;
  accentClassName: string;
  details?: string[];
};

type OnboardingStep = {
  title: string;
  description: string;
  icon: string;
};

type ChainTransaction = {
  kind: TransactionKind;
  title: string;
  functionName: string;
  hash: `0x${string}`;
  description: string;
};

const contractAddress = "0x0000000000000000000000000000000000000000";
const celoScanBaseUrl = "https://celoscan.io";

const benefitCards: BenefitCard[] = [
  {
    title: "Smart Credit Building",
    description:
      "Instead of relying on traditional bureaus, GAITA turns behavior and repayment trust into Web3 reputation.",
    icon: "01",
  },
  {
    title: "Transparent Record",
    description:
      "Approvals are emitted as on-chain events, creating a verifiable trail for the user and the protocol.",
    icon: "02",
  },
  {
    title: "Privacy Protected",
    description:
      "The contract stores only the score needed for approval, keeping sensitive off-chain context outside the pool.",
    icon: "03",
  },
  {
    title: "Fair Credit Access",
    description:
      "A user with CreditScore >= 50 can request credit without banking history or duplicated active loans.",
    icon: "04",
  },
];

const processSteps: ProcessStep[] = [
  {
    title: "Web2 Reputation Analysis",
    description:
      "Behavioral signals are translated into the CreditScore value object, using a 0-100 scale.",
    accentClassName: "accent-blue",
  },
  {
    title: "Financial Pool Formation",
    description:
      "The CreditPool aggregate represents the lending pool and keeps approval state consistent.",
    accentClassName: "accent-purple",
    details: [
      "30% for stability reserve",
      "50% for investors and recovery",
      "20% for direct credit execution",
    ],
  },
  {
    title: "Smart Contract Approval",
    description:
      "GaitaCreditPool.sol checks score, active credit, and emits CreditApproved when the request is valid.",
    accentClassName: "accent-cyan",
  },
  {
    title: "Credit to Transform Lives",
    description:
      "Approved users receive a verifiable credit decision they can use to build financial reputation.",
    accentClassName: "accent-green",
  },
];

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Basic Information",
    description: "Name, email, and phone establish the first onboarding context.",
    icon: "A",
  },
  {
    title: "Verification",
    description: "Contact proof connects the user to a reliable recovery channel.",
    icon: "B",
  },
  {
    title: "Digital Identity",
    description: "Privacy settings prepare the user for reputation analysis.",
    icon: "C",
  },
  {
    title: "Success",
    description: "The user is ready to receive a CreditScore and request credit.",
    icon: "D",
  },
];

const chainTransactions: ChainTransaction[] = [
  {
    kind: "deploy",
    title: "Deploy GaitaCreditPool",
    functionName: "constructor()",
    hash: "0x1111111111111111111111111111111111111111111111111111111111111111",
    description:
      "Publishes the aggregate on Celo mainnet and defines the deployer as Owner.",
  },
  {
    kind: "score",
    title: "Owner updates CreditScore",
    functionName: "updateScore(user, score)",
    hash: "0x2222222222222222222222222222222222222222222222222222222222222222",
    description:
      "Registers a 0-100 score. Only the Owner can update this value object.",
  },
  {
    kind: "credit",
    title: "User requests credit",
    functionName: "requestCredit(amount)",
    hash: "0x3333333333333333333333333333333333333333333333333333333333333333",
    description:
      "Approves credit when score is at least 50 and no active credit exists.",
  },
];

function getContractUrl(address: string) {
  return `${celoScanBaseUrl}/address/${address}`;
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
              aggregate: User, CreditScore, CreditAmount, and approval rules
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
              <strong>$2,000</strong>
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
                value={1000}
              />
            </div>
            <p className="input-help">Maximum: $2,000</p>

            <label htmlFor="installments">Number of Installments</label>
            <select id="installments" name="installments" defaultValue="6">
              <option value="3">3 installments</option>
              <option value="6">6 installments</option>
              <option value="9">9 installments</option>
              <option value="12">12 installments</option>
            </select>

            <div className="payment-panel">
              <p>Your Monthly Payment</p>
              <strong>$186.67</strong>
              <span>Interest rate: 2% per month</span>
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
            <article className="glass-card benefit-card" key={benefitCard.title}>
              <div className="card-icon">{benefitCard.icon}</div>
              <h3>{benefitCard.title}</h3>
              <p>{benefitCard.description}</p>
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
          {processSteps.map((processStep, processStepIndex) => (
            <article
              className={`process-step ${processStep.accentClassName}`}
              key={processStep.title}
            >
              <div className="process-copy">
                <div className="step-title-row">
                  <span>{processStepIndex + 1}</span>
                  <h3>{processStep.title}</h3>
                </div>
                <p>{processStep.description}</p>
                {processStep.details ? (
                  <ul>
                    {processStep.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="step-visual">
                <div>{processStepIndex + 1}</div>
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
              atualização de score pelo Owner e pedido de crédito pelo User.
              Os hashes são placeholders até o deploy real no Remix.
            </p>
            <a className="secondary-button" href={getContractUrl(contractAddress)}>
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
              <code>{contractAddress}</code>
            </div>
            <div className="contract-rules">
              <div>creditScore[user] stores 0-100</div>
              <div>hasActiveCredit[user] blocks duplicates</div>
              <div>onlyOwner protects updateScore()</div>
              <div>requestCredit() requires score &gt;= 50</div>
            </div>
          </div>
        </div>

        <div className="page-container transaction-list">
          {chainTransactions.map((chainTransaction, transactionIndex) => (
            <article className="transaction-card" key={chainTransaction.hash}>
              <div className="transaction-index">
                {(transactionIndex + 1).toString().padStart(2, "0")}
              </div>
              <div>
                <span>{chainTransaction.functionName}</span>
                <h3>{chainTransaction.title}</h3>
                <p>{chainTransaction.description}</p>
                <code>{shortenHash(chainTransaction.hash)}</code>
              </div>
              <a href={getTransactionUrl(chainTransaction.hash)}>CeloScan</a>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section onboarding-section" id="onboarding">
        <div className="section-heading">
          <h2>
            Ready to Start Your <span>Financial Journey</span>?
          </h2>
          <p>
            A recreated four-step onboarding flow that prepares a user for
            reputation scoring and credit approval.
          </p>
        </div>

        <div className="page-container onboarding-grid">
          <aside className="creation-process">
            <h3>Creation Process</h3>
            {onboardingSteps.map((onboardingStep, onboardingStepIndex) => (
              <div className="onboarding-step" key={onboardingStep.title}>
                <div className="step-marker">
                  <span>{onboardingStepIndex + 1}</span>
                  {onboardingStepIndex < onboardingSteps.length - 1 ? (
                    <i aria-hidden="true" />
                  ) : null}
                </div>
                <div>
                  <h4>
                    <span>{onboardingStep.icon}</span>
                    {onboardingStep.title}
                  </h4>
                  <p>{onboardingStep.description}</p>
                </div>
              </div>
            ))}
            <div className="security-box">
              <h4>Security Guarantees</h4>
              <p>End-to-end cryptography</p>
              <p>Full LGPD compliance</p>
              <p>User controls shared data</p>
              <p>International Web3 standard</p>
            </div>
          </aside>

          <form className="onboarding-form">
            <div className="progress-row">
              <span>Step 1 of 4</span>
              <strong>25%</strong>
            </div>
            <div className="progress-track">
              <span />
            </div>
            <div className="form-heading">
              <div>U</div>
              <h3>Let&apos;s Get to Know You</h3>
              <p>Tell us a bit about yourself to get started.</p>
            </div>
            <label htmlFor="full-name">Your Full Name</label>
            <input id="full-name" name="fullName" placeholder="Enter your complete name" />
            <label htmlFor="email">Your Email Address</label>
            <input
              id="email"
              name="email"
              placeholder="your.email@example.com"
              type="email"
            />
            <label htmlFor="phone">Your Phone Number</label>
            <input id="phone" name="phone" placeholder="(11) 99999-9999" />
            <button className="primary-button calculator-button" type="button">
              Continue to Next Step
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
