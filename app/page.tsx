type TransactionKind = "Deploy" | "Score" | "Credit";

type ChainTransaction = {
  kind: TransactionKind;
  title: string;
  hash: `0x${string}`;
  description: string;
};

type DomainRule = {
  title: string;
  description: string;
};

const contractAddress = "0x0000000000000000000000000000000000000000";
const celoScanBaseUrl = "https://celoscan.io";

const domainRules: DomainRule[] = [
  {
    title: "User",
    description:
      "A pessoa da rede é representada pelo endereço Ethereum/Celo. Esse endereço carrega reputação e estado de crédito.",
  },
  {
    title: "CreditScore",
    description:
      "Nota de 0 a 100. A regra do agregado aceita crédito apenas quando a nota é pelo menos 50.",
  },
  {
    title: "CreditPool",
    description:
      "O agregado centraliza reputação, aprovação e bloqueio de crédito ativo duplicado.",
  },
];

const transactions: ChainTransaction[] = [
  {
    kind: "Deploy",
    title: "Deploy do GaitaCreditPool",
    hash: "0x1111111111111111111111111111111111111111111111111111111111111111",
    description:
      "Publica o agregado de crédito na Celo mainnet e define o deployer como Owner.",
  },
  {
    kind: "Score",
    title: "Owner atualiza CreditScore",
    hash: "0x2222222222222222222222222222222222222222222222222222222222222222",
    description:
      "Admin registra a reputação do User. Apenas o Owner consegue executar updateScore().",
  },
  {
    kind: "Credit",
    title: "User solicita crédito",
    hash: "0x3333333333333333333333333333333333333333333333333333333333333333",
    description:
      "requestCredit() aprova quando CreditScore >= 50 e o User ainda não possui crédito ativo.",
  },
];

function getTransactionUrl(transactionHash: string) {
  return `${celoScanBaseUrl}/tx/${transactionHash}`;
}

function getContractUrl(address: string) {
  return `${celoScanBaseUrl}/address/${address}`;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080908] text-[#f4f7f2]">
      <section className="border-b border-[#28352c] bg-[linear-gradient(135deg,#080908_0%,#111712_45%,#2a2414_100%)]">
        <div className="mx-auto grid min-h-[92vh] w-full max-w-7xl items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-[#8dae63]/50 bg-[#11180f] px-4 py-2 text-sm font-semibold text-[#c7f071]">
              Proof of Ship Celo
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-[#f8ffe8] sm:text-6xl lg:text-7xl">
              GAITA Credit Pool
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#cfd8c6]">
              Maria, a solução usa DDD de forma direta: o endereço Celo é o
              User, o CreditScore mede reputação, e o CreditPool decide se o
              crédito pode ser aprovado.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="metric-tile">
                <span>Score mínimo</span>
                <strong>50</strong>
              </div>
              <div className="metric-tile">
                <span>Score máximo</span>
                <strong>100</strong>
              </div>
              <div className="metric-tile">
                <span>Crédito ativo</span>
                <strong>1x</strong>
              </div>
            </div>
          </div>

          <div className="domain-console" aria-label="Mapa visual do domínio">
            <div className="console-header">
              <span />
              <span />
              <span />
            </div>
            <div className="score-ring">
              <div>
                <span>CreditScore</span>
                <strong>90</strong>
              </div>
            </div>
            <div className="flow-grid">
              <div>User</div>
              <div>Owner</div>
              <div>CreditPool</div>
              <div>Approved</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {domainRules.map((rule) => (
            <article className="domain-card" key={rule.title}>
              <h2>{rule.title}</h2>
              <p>{rule.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#263329] bg-[#0d100d]">
        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">Celo mainnet</p>
              <h2 className="section-title">3 transações reais</h2>
            </div>
            <a className="contract-link" href={getContractUrl(contractAddress)}>
              Contrato placeholder
            </a>
          </div>

          <div className="grid gap-4">
            {transactions.map((transaction, transactionIndex) => (
              <article className="transaction-row" key={transaction.hash}>
                <div className="transaction-index">
                  {(transactionIndex + 1).toString().padStart(2, "0")}
                </div>
                <div>
                  <span>{transaction.kind}</span>
                  <h3>{transaction.title}</h3>
                  <p>{transaction.description}</p>
                </div>
                <a href={getTransactionUrl(transaction.hash)}>CeloScan</a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
