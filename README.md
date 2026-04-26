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
