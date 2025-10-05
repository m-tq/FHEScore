# FHEScore 🔐

**Private Credit Scoring System using Fully Homomorphic Encryption (FHEVM)**

FHEScore is a revolutionary credit scoring system that leverages FHEVM (Fully Homomorphic Encryption Virtual Machine) to provide completely private and secure credit scoring. Users can build their credit scores by submitting encrypted activity data, with all computations happening on encrypted data without ever revealing sensitive information.

## 🌟 Features

- **🔒 Complete Privacy**: All user data is encrypted using FHEVM, ensuring privacy even during computation
- **📊 Comprehensive Scoring**: Multiple activity types contribute to your credit score
- **🔍 Zero-Knowledge Verification**: Prove creditworthiness without revealing your exact score
- **🌐 Decentralized**: Built on blockchain technology for transparency and immutability
- **🎯 Real-time Updates**: Dynamic score calculation based on latest activities
- **🛡️ Secure**: Military-grade encryption protects all sensitive data

## 🏗️ Architecture

### Smart Contract (`FHEScore.sol`)
- **Encrypted Data Storage**: All user activities stored as encrypted `euint32` values
- **Private Computation**: Score calculations performed on encrypted data
- **Access Control**: Users can only decrypt their own data
- **Threshold Verification**: Privacy-preserving score verification

### Frontend Application
- **React-based UI**: Modern, responsive user interface
- **FHEVM Integration**: Seamless encryption/decryption using Relayer SDK
- **Wallet Connection**: MetaMask integration for blockchain interaction
- **Real-time Updates**: Live status updates and transaction monitoring

## 📋 Activity Types & Scoring

| Activity Type | Weight | Impact | Description |
|---------------|--------|--------|-------------|
| 💰 Loan Repayment | +100 | High Positive | Each successful loan repayment |
| ❌ Loan Default | -200 | High Negative | Each loan default |
| 🏦 Staking | +50 | Medium Positive | Per day of staking activity |
| 🗳️ Governance | +30 | Low Positive | Per governance vote participation |
| 📈 Trading | +20 | Low Positive | Per unit of trading volume |

**Verification Threshold**: 700 points (configurable)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FHEScore
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Deploy and run**
   ```bash
   # Deploy everything (contract + frontend setup)
   npm run deploy:all
   
   # Start the frontend
   cd frontend && npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Connect your MetaMask wallet
   - Start building your credit score!

## 🔧 Development

### Local Development Setup

1. **Start local blockchain**
   ```bash
   npx hardhat node
   ```

2. **Deploy contract**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Setup frontend**
   ```bash
   node scripts/setup-frontend.js
   ```

4. **Run tests**
   ```bash
   npx hardhat test
   ```

### Docker Development

```bash
# Start all services (FHEVM node, relayer, frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 Usage Guide

### 1. User Registration
- Connect your MetaMask wallet
- Click "Register Now" to initialize your encrypted data
- Confirm the transaction

### 2. Submit Activities
- Choose activity type (Repayment, Staking, etc.)
- Enter the activity value
- Submit encrypted data to the blockchain

### 3. Calculate Score
- Click "Calculate Score" to compute your credit score
- All calculations happen on encrypted data

### 4. View Your Score
- Click "Decrypt & View Score" to see your private score
- View detailed activity breakdown

### 5. Verify Creditworthiness
- Use "Verify Score Threshold" for zero-knowledge proof
- Prove you meet requirements without revealing exact score

## 🌐 Network Configuration

### Sepolia Testnet
```bash
# Deploy to Sepolia
HARDHAT_NETWORK=sepolia npm run deploy:all

# Verify contract
npx hardhat run scripts/verify-contract.js --network sepolia
```

### Local Development
```bash
# Start local node
npx hardhat node

# Deploy locally
npm run deploy:all
```

## 🔐 Security Features

- **End-to-End Encryption**: Data encrypted before leaving your browser
- **Zero-Knowledge Proofs**: Verify creditworthiness without data exposure
- **Access Control**: Only you can decrypt your personal data
- **Immutable Records**: Blockchain ensures data integrity
- **Private Computation**: Calculations on encrypted data

## 🛠️ Available Scripts

### Root Directory
- `npm run compile` - Compile smart contracts
- `npm run test` - Run contract tests
- `npm run deploy` - Deploy contract only
- `npm run deploy:all` - Full deployment process
- `npm run verify` - Verify contract on Etherscan
- `npm run interact` - Test contract interaction

### Frontend Directory
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run frontend tests
- `npm run start:sepolia` - Start with Sepolia config
- `npm run start:localhost` - Start with local config

## 📁 Project Structure

```
FHEScore/
├── contracts/           # Smart contracts
│   └── FHEScore.sol    # Main contract
├── scripts/            # Deployment & utility scripts
│   ├── deploy.js       # Contract deployment
│   ├── deploy-all.js   # Complete deployment
│   ├── verify-contract.js
│   ├── interact.js     # Contract interaction
│   └── setup-frontend.js
├── test/               # Contract tests
│   └── FHEScore.test.js
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom hooks
│   │   ├── utils/      # Utility functions
│   │   └── App.js      # Main app component
│   └── public/
├── hardhat.config.js   # Hardhat configuration
├── docker-compose.yml  # Docker setup
└── README.md          # This file
```

## 🔍 API Reference

### Smart Contract Functions

#### User Management
- `registerUser()` - Initialize user with encrypted zeros
- `isUserRegistered(address)` - Check registration status
- `hasCalculatedScore(address)` - Check if score calculated

#### Activity Submission
- `submitActivity(activityType, encryptedInputs)` - Submit encrypted activity
- `getUserActivities(user)` - Get encrypted activity counts

#### Score Management
- `calculateScore()` - Calculate encrypted credit score
- `getScore(user)` - Get encrypted score for decryption
- `verifyScore(user)` - Zero-knowledge score verification

### Frontend Hooks

#### `useFHEVM()`
```javascript
const { fhevm, encryptValue, decryptValue, isReady } = useFHEVM();
```

#### `useWallet()`
```javascript
const { 
  account, 
  isConnected, 
  connectWallet, 
  switchToSepolia 
} = useWallet();
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Community**: Join our Discord for discussions

## 🙏 Acknowledgments

- **Zama**: For FHEVM technology enabling private computation
- **OpenZeppelin**: For secure smart contract libraries
- **Hardhat**: For excellent development framework
- **React**: For the frontend framework

---

**Built with ❤️ using FHEVM for a more private future**