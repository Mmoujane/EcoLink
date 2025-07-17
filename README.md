# EcoLink: Linking Local Impact to Global Value

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=ethereum&logoColor=white)](https://ethereum.org/)
[![Solidity](https://img.shields.io/badge/Solidity-e6e6e6?logo=solidity&logoColor=black)](https://soliditylang.org/)

> A Web3-powered platform that rewards individuals in underserved regions for verifiable eco-friendly actions, connecting local environmental stewardship to global carbon credit markets.

## 🌍 Overview

EcoLink addresses the critical gap between small-scale environmental contributors and global carbon markets. While the voluntary carbon market is expected to grow from $2 billion to over $50 billion by 2030, communities in low-income or rural areas remain excluded from these financial benefits despite their vital role in climate action.

Our platform leverages blockchain technology to:
- **Track and authenticate** sustainable activities
- **Issue tokenized proof** of environmental impact
- **Connect verified actions** to global carbon credit buyers
- **Enable financial inclusion** through environmental stewardship

## 🚀 Key Features

### 🔐 Decentralized Verification
- Community-based validation system
- Weighted voting mechanism (Verifiers + Governors)
- Transparent on-chain governance

### 💰 Token Economics
- **EcoToken (ECO)**: Capped-supply utility token
- Reward system for verified environmental actions
- Staking mechanism for validators

### 📱 Mobile-First Design
- Accessible interface for low-resource environments
- Step-by-step guidance for action submission
- Real-time reward tracking

### 🌱 Environmental Impact
- Reforestation projects
- Clean energy adoption
- Sustainable agriculture
- Ecosystem conservation

## 🏗️ Technical Architecture

### Smart Contracts

```
├── EcoToken (ERC20)
│   ├── Utility token for rewards and governance
│   ├── Staking functionality
│   └── Capped supply model
│
├── EcoActionNFT (ERC721)
│   ├── Certifies verified eco-actions
│   ├── Metadata storage
│   └── Proof hash integration
│
└── EcoRewardSystem
    ├── User registration
    ├── Proposal management
    ├── Voting mechanism
    └── Reward distribution
```

### Integration Points
- **IPFS**: Decentralized storage for proof assets
- **Event System**: Real-time UI updates
- **View Functions**: Proposal tracking and user activity

## 👥 User Roles

### 🛡️ Protectors
- Register for free
- Submit environmental action proposals
- Earn ECO tokens + NFT badges for approved actions

### ✅ Verifiers
- Stake 50 ECO tokens
- Vote on proposal validity
- Receive proportional rewards

### 🏛️ Governors
- Pre-assigned trusted validators
- Double-weighted voting power
- Governance incentives

## 🔄 Workflow

1. **Registration**: Users register as Protectors
2. **Staking**: Verifiers stake ECO tokens
3. **Submission**: Protectors submit proposals with IPFS proof
4. **Voting**: 7-day voting window with weighted consensus
5. **Execution**: Approved proposals trigger rewards and NFT minting

## 📊 Business Model

### Value Creation
- Converts local environmental actions into verifiable digital assets
- Bridges small-scale contributions to global sustainability financing
- Creates inclusive, data-rich foundation for carbon markets

### Value Proposition
- **For Communities**: Access to previously inaccessible carbon markets
- **For Buyers**: Transparently verified carbon credits with social co-benefits
- **For Ecosystem**: Democratized environmental finance

### Revenue Streams
- Transaction fees on carbon credit sales
- Staking utility within token ecosystem
- Marketplace facilitation services

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ecolink.git
cd ecolink

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Compile smart contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Core Functions

```solidity
// Register as a Protector
function registerProtector() external

// Stake tokens to become a Verifier
function stakeToVerify() external

// Submit environmental action proposal
function submitProposal(string memory ipfsHash) external

// Vote on proposals (Verifiers)
function vote(uint256 proposalId, bool support) external

// Governor voting (enhanced weight)
function governorVote(uint256 proposalId, bool support) external

// Execute approved proposals
function executeProposal(uint256 proposalId) external
```

## 🌐 Social Impact

### Financial Inclusion
- Creates new revenue streams for underserved communities
- Enables participation in global carbon markets
- Tokenized income from environmental stewardship

### Community Engagement
- Leverages existing social trust networks
- Promotes collective responsibility
- Builds local environmental awareness

### SDG Alignment
- **SDG 1**: Poverty reduction through tokenized income
- **SDG 13**: Climate action through verified environmental activities
- **SDG 8**: Economic inclusion and sustainable livelihoods

## ⚖️ Legal Considerations

### Regulatory Compliance
- Tokenized carbon credits may be classified as financial instruments
- Compliance with MiFID II (EU) and securities laws (US)
- Anti-money laundering and KYC requirements

### Environmental Standards
- Adherence to additionality, permanence, and double-counting prevention
- Alignment with core carbon accounting principles
- Integration with existing certification frameworks

### Data Protection
- GDPR compliance for personal data processing
- Secure handling of geospatial and user data
- Clear consent mechanisms

## 🏆 Team

- **Tobias Stampfli** - University of Zürich (Market Analysis, Legal)
- **Reza Toorajipour** - Stanford University (Business Model, Token Economics)
- **Marwan Moujane** - INPT Morocco (Technical Implementation, Governance)
- **Oshai Naidoo** - University of Cape Town (Project Design, Social Mechanisms)

*Summer School: Deep Dive into Blockchain 2025*

**EcoLink** - Transforming local environmental action into global value through blockchain technology.

*"By linking sustainability with financial inclusion, we aspire to convert positive real-world actions into tangible, blockchain-based economic opportunities."*
