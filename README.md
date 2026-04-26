# GAITA

GAITA is a Proof of Ship project for Celo that turns financial reputation into an on-chain credit approval flow.

GAITA e um projeto Proof of Ship para Celo que transforma reputacao financeira em um fluxo de aprovacao de credito on-chain.

## For Users

### English

GAITA helps a credit seeker build a Web3 financial reputation and request credit through transparent smart contract rules.

What the current experience shows:

- A Web3 financial reputation landing page.
- A credit calculator with available credit, monthly payment, and interest rate.
- A four-step onboarding flow for the Seeker.
- Semantic reputation fields: `seekerName`, `emailAddress`, and `phoneNumber`.
- A simulated `VerificationCode` step.
- A fake `DigitalIdentity.onchainIdentity` generated during onboarding.
- A Proof of Ship section with contract and CeloScan transaction placeholders.

Important: contract address and transaction hashes are placeholders until the real Remix deploy is completed.

### Portugues

GAITA ajuda uma pessoa que busca credito, chamada Seeker, a construir reputacao financeira Web3 e solicitar credito por regras transparentes em smart contract.

O que a experiencia atual mostra:

- Uma landing page de reputacao financeira Web3.
- Uma calculadora de credito com valor disponivel, parcela mensal e taxa de juros.
- Um onboarding de 4 passos para o Seeker.
- Campos semanticos de reputacao: `seekerName`, `emailAddress` e `phoneNumber`.
- Uma etapa simulada de `VerificationCode`.
- Uma `DigitalIdentity.onchainIdentity` fake gerada durante o onboarding.
- Uma secao Proof of Ship com contrato e transacoes placeholder no CeloScan.

Importante: endereco do contrato e hashes de transacao ainda sao placeholders ate o deploy real pelo Remix.

## Domain Language

### English

- `Seeker`: the person looking for credit.
- `ReputationData`: the onboarding information used to start reputation analysis.
- `VerificationCode`: the simulated code used to validate the Seeker.
- `DigitalIdentity`: the generated Web3 identity reference.
- `CreditScore`: a value from 0 to 100.
- `CreditAmount`: the amount requested as credit.
- `CreditPool`: the aggregate that manages reputation and credit approval.

Business rules:

- Only the Owner can update credit scores.
- `CreditScore` must be between 0 and 100.
- A Seeker can request credit only with `CreditScore >= 50`.
- A Seeker cannot have duplicated active credit.

### Portugues

- `Seeker`: pessoa que busca credito.
- `ReputationData`: informacoes de onboarding usadas para iniciar a analise de reputacao.
- `VerificationCode`: codigo simulado usado para validar o Seeker.
- `DigitalIdentity`: referencia de identidade Web3 gerada.
- `CreditScore`: valor de 0 a 100.
- `CreditAmount`: valor solicitado como credito.
- `CreditPool`: agregado que gerencia reputacao e aprovacao de credito.

Regras de negocio:

- Somente o Owner pode atualizar scores.
- `CreditScore` deve estar entre 0 e 100.
- Um Seeker so pode solicitar credito com `CreditScore >= 50`.
- Um Seeker nao pode ter credito ativo duplicado.

## Technical Overview

### English

Stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Hardhat 3
- Viem
- Solidity
- Node Test Runner
- Vitest
- PWA manifest and service worker

Main files:

- `contracts/GaitaCreditPool.sol`: Solidity aggregate for credit approval.
- `test/GaitaCreditPool.ts`: contract tests written before the contract implementation.
- `app/page.tsx`: main landing page and Proof of Ship sections.
- `app/components/SeekerOnboardingForm.tsx`: interactive domain onboarding flow.
- `app/components/GaitaPwaRegistration.tsx`: service worker registration.
- `public/manifest.json`: PWA manifest.
- `public/sw.js`: service worker with `cacheStaticAssets()` and `fetchWithNetworkFallback()`.

### Portugues

Stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Hardhat 3
- Viem
- Solidity
- Node Test Runner
- Vitest
- Manifest PWA e service worker

Arquivos principais:

- `contracts/GaitaCreditPool.sol`: agregado Solidity para aprovacao de credito.
- `test/GaitaCreditPool.ts`: testes do contrato escritos antes da implementacao.
- `app/page.tsx`: landing page principal e secoes Proof of Ship.
- `app/components/SeekerOnboardingForm.tsx`: fluxo interativo de onboarding com linguagem de dominio.
- `app/components/GaitaPwaRegistration.tsx`: registro do service worker.
- `public/manifest.json`: manifest PWA.
- `public/sw.js`: service worker com `cacheStaticAssets()` e `fetchWithNetworkFallback()`.

## Smart Contract

### English

`GaitaCreditPool.sol` exposes:

- `creditScore(address seekerAddress)`
- `hasActiveCredit(address seekerAddress)`
- `updateScore(address seekerAddress, uint8 creditScore)`
- `requestCredit(uint256 creditAmount)`

Events:

- `ScoreUpdated(address indexed seekerAddress, uint8 creditScore, address indexed updatedBy)`
- `CreditApproved(address indexed seekerAddress, uint256 creditAmount, uint8 creditScore)`

### Portugues

`GaitaCreditPool.sol` expoe:

- `creditScore(address seekerAddress)`
- `hasActiveCredit(address seekerAddress)`
- `updateScore(address seekerAddress, uint8 creditScore)`
- `requestCredit(uint256 creditAmount)`

Eventos:

- `ScoreUpdated(address indexed seekerAddress, uint8 creditScore, address indexed updatedBy)`
- `CreditApproved(address indexed seekerAddress, uint256 creditAmount, uint8 creditScore)`

## Getting Started

### English

Install dependencies:

```bash
pnpm install
```

Run the app:

```bash
pnpm dev
```

Run contract tests and frontend test command:

```bash
pnpm test
```

Run only contract tests:

```bash
pnpm test:contracts
```

Run lint:

```bash
pnpm lint
```

Build:

```bash
pnpm build
```

### Portugues

Instalar dependencias:

```bash
pnpm install
```

Rodar a aplicacao:

```bash
pnpm dev
```

Rodar testes de contrato e comando de testes do frontend:

```bash
pnpm test
```

Rodar apenas testes de contrato:

```bash
pnpm test:contracts
```

Rodar lint:

```bash
pnpm lint
```

Gerar build:

```bash
pnpm build
```

## Celo Deployment

### English

The project is configured for two Celo networks in `hardhat.config.ts`:

| Network | Chain ID | RPC URL | Explorer |
| --- | ---: | --- | --- |
| Celo Sepolia | `11142220` | `https://forno.celo-sepolia.celo-testnet.org` | `https://celo-sepolia.blockscout.com` |
| Celo Mainnet | `42220` | `https://forno.celo.org` | `https://celoscan.io` |

The npm package `@celo/hardhat-plugin` is not published in the public npm registry. This project uses the native Hardhat 3 HTTP network configuration with Viem, which is enough to deploy to Celo Sepolia and Celo Mainnet.

Create your local `.env`:

```bash
cp .env.example .env
```

Then set:

```bash
PRIVATE_KEY=0xyour_private_key_without_quotes
```

Do not commit `.env`.

Deploy to Celo Sepolia:

```bash
pnpm deploy:sepolia
```

Interact with the Celo Sepolia deployment:

```bash
pnpm interact:sepolia
```

Deploy to Celo Mainnet:

```bash
pnpm deploy:celo
```

Interact with the Celo Mainnet deployment:

```bash
pnpm interact:celo
```

Generated deployment files are saved under `deployments/`:

- `contract-address-celoSepolia.json`
- `transaction-hashes-celoSepolia.json`
- `contract-address-celo.json`
- `transaction-hashes-celo.json`

These files are ignored by Git because they are environment-specific outputs.

### Portugues

O projeto esta configurado para duas redes Celo em `hardhat.config.ts`:

| Rede | Chain ID | RPC URL | Explorer |
| --- | ---: | --- | --- |
| Celo Sepolia | `11142220` | `https://forno.celo-sepolia.celo-testnet.org` | `https://celo-sepolia.blockscout.com` |
| Celo Mainnet | `42220` | `https://forno.celo.org` | `https://celoscan.io` |

O pacote npm `@celo/hardhat-plugin` nao esta publicado no registry publico do npm. Este projeto usa a configuracao HTTP nativa do Hardhat 3 com Viem, que e suficiente para deploy na Celo Sepolia e na Celo Mainnet.

Crie seu `.env` local:

```bash
cp .env.example .env
```

Depois configure:

```bash
PRIVATE_KEY=0xsua_private_key_sem_aspas
```

Nao commite o `.env`.

Deploy na Celo Sepolia:

```bash
pnpm deploy:sepolia
```

Interagir com o contrato na Celo Sepolia:

```bash
pnpm interact:sepolia
```

Deploy na Celo Mainnet:

```bash
pnpm deploy:celo
```

Interagir com o contrato na Celo Mainnet:

```bash
pnpm interact:celo
```

Os arquivos gerados ficam em `deployments/`:

- `contract-address-celoSepolia.json`
- `transaction-hashes-celoSepolia.json`
- `contract-address-celo.json`
- `transaction-hashes-celo.json`

Esses arquivos sao ignorados pelo Git porque sao saidas especificas de cada ambiente.

## MetaMask and CELO

### English

Add Celo Sepolia manually in MetaMask:

- Network name: `Celo Sepolia`
- RPC URL: `https://forno.celo-sepolia.celo-testnet.org`
- Chain ID: `11142220`
- Currency symbol: `CELO`
- Block explorer: `https://celo-sepolia.blockscout.com`

Add Celo Mainnet manually in MetaMask:

- Network name: `Celo Mainnet`
- RPC URL: `https://forno.celo.org`
- Chain ID: `42220`
- Currency symbol: `CELO`
- Block explorer: `https://celoscan.io`

To get testnet CELO, use a Celo Sepolia faucet:

- `https://faucet.celo.org/celo-sepolia`
- `https://cloud.google.com/application/web3/faucet/celo/sepolia`

For Celo Mainnet, buy CELO on a supported exchange or bridge assets into Celo using a production bridge. Mainnet CELO has real value; test all flows on Celo Sepolia before using Mainnet.

### Portugues

Adicionar Celo Sepolia manualmente na MetaMask:

- Nome da rede: `Celo Sepolia`
- RPC URL: `https://forno.celo-sepolia.celo-testnet.org`
- Chain ID: `11142220`
- Simbolo da moeda: `CELO`
- Block explorer: `https://celo-sepolia.blockscout.com`

Adicionar Celo Mainnet manualmente na MetaMask:

- Nome da rede: `Celo Mainnet`
- RPC URL: `https://forno.celo.org`
- Chain ID: `42220`
- Simbolo da moeda: `CELO`
- Block explorer: `https://celoscan.io`

Para pegar CELO de testnet, use um faucet da Celo Sepolia:

- `https://faucet.celo.org/celo-sepolia`
- `https://cloud.google.com/application/web3/faucet/celo/sepolia`

Para Celo Mainnet, compre CELO em uma exchange suportada ou envie ativos para a Celo usando uma bridge de producao. CELO em mainnet tem valor real; teste todo o fluxo na Celo Sepolia antes de usar Mainnet.

## Proof of Ship

### English

The Proof of Ship section currently uses placeholders:

- deployed contract address
- deploy transaction hash
- `updateScore()` transaction hash
- `requestCredit()` transaction hash

After the real Celo deployment, replace the placeholders in `app/page.tsx`.

### Portugues

A secao Proof of Ship usa placeholders neste momento:

- endereco do contrato publicado
- hash da transacao de deploy
- hash da transacao `updateScore()`
- hash da transacao `requestCredit()`

Depois do deploy real na Celo, substitua os placeholders em `app/page.tsx`.

## PWA

### English

GAITA includes basic PWA support:

- `public/manifest.json`
- `public/sw.js`
- SVG app icons
- iOS web app metadata
- service worker registration from the app layout

The manifest includes semantic project fields:

- `gaitaManifest`
- `gaitaThemeColor`
- `gaitaShortName`

### Portugues

GAITA inclui suporte basico a PWA:

- `public/manifest.json`
- `public/sw.js`
- icones SVG do app
- metadados iOS para web app
- registro do service worker no layout da aplicacao

O manifest inclui campos semanticos do projeto:

- `gaitaManifest`
- `gaitaThemeColor`
- `gaitaShortName`

## Current Status

### English

Implemented:

- TDD contract tests.
- `GaitaCreditPool.sol`.
- Landing page inspired by the previous GAITA visual identity.
- Interactive Seeker onboarding.
- Proof of Ship placeholder section.
- PWA manifest and service worker.

Pending:

- Real Celo deployment.
- Replacement of contract and transaction placeholders.
- Optional frontend tests for onboarding behavior.

### Portugues

Implementado:

- Testes TDD do contrato.
- `GaitaCreditPool.sol`.
- Landing page inspirada na identidade visual anterior do GAITA.
- Onboarding interativo do Seeker.
- Secao Proof of Ship com placeholders.
- Manifest PWA e service worker.

Pendente:

- Deploy real na Celo.
- Substituicao dos placeholders de contrato e transacoes.
- Testes opcionais de frontend para o comportamento do onboarding.
