# FHEScore Deployment Guide 🚀

This guide provides detailed instructions for deploying FHEScore to different networks and environments.

## 📋 Prerequisites

### Required Software
- Node.js 18+ and npm
- Git
- MetaMask wallet with test ETH

### Required Accounts & Keys
- Ethereum wallet private key
- Etherscan API key (for contract verification)
- RPC endpoint URLs for target networks

## ⚙️ Environment Configuration

### 1. Create Environment File

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here

# Contract Verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Deployment Configuration
FHESCORE_CONTRACT_ADDRESS=  # Will be filled after deployment

# Frontend Configuration
REACT_APP_CONTRACT_ADDRESS=  # Will be filled automatically
REACT_APP_NETWORK_ID=11155111  # Sepolia network ID
```

### 3. Security Best Practices

⚠️ **Important Security Notes:**
- Never commit your `.env` file to version control
- Use a dedicated deployment wallet, not your main wallet
- Ensure your private key has sufficient ETH for deployment
- Keep your Etherscan API key secure

## 🌐 Network Deployment Options

### Option 1: Local Development Network

Perfect for development and testing.

```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy to local network
npm run deploy:all

# Start frontend
cd frontend && npm start
```

**Network Details:**
- Network ID: 31337
- RPC URL: http://localhost:8545
- No gas fees required
- Fast deployment and testing

### Option 2: Sepolia Testnet

Recommended for testing before mainnet deployment.

```bash
# Ensure you have Sepolia ETH in your wallet
# Get free Sepolia ETH from: https://sepoliafaucet.com/

# Deploy to Sepolia
HARDHAT_NETWORK=sepolia npm run deploy:all

# Verify contract (optional)
npx hardhat run scripts/verify-contract.js --network sepolia
```

**Network Details:**
- Network ID: 11155111
- RPC URL: Configure in .env
- Requires test ETH
- Public testnet environment

### Option 3: Docker Development Environment

Complete isolated environment with FHEVM node.

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Deploy to Docker network
HARDHAT_NETWORK=localhost npm run deploy:all
```

## 📝 Step-by-Step Deployment Process

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Step 2: Compile Contracts

```bash
# Compile smart contracts
npm run compile

# Run tests to ensure everything works
npm run test
```

### Step 3: Deploy Contract

Choose your deployment method:

#### Quick Deployment (Recommended)
```bash
# Deploy everything with one command
npm run deploy:all
```

#### Manual Deployment
```bash
# Deploy contract only
npm run deploy

# Setup frontend configuration
node scripts/setup-frontend.js

# Verify contract (testnet/mainnet only)
npm run verify
```

### Step 4: Verify Deployment

```bash
# Test contract interaction
npm run interact

# Check deployment details
cat deployment.json
```

### Step 5: Start Frontend

```bash
cd frontend
npm start
```

Open `http://localhost:3000` and test the application.

## 🔧 Deployment Scripts Reference

### Core Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Deploy Contract | `npm run deploy` | Deploy FHEScore contract only |
| Full Deployment | `npm run deploy:all` | Complete deployment process |
| Verify Contract | `npm run verify` | Verify on Etherscan |
| Test Interaction | `npm run interact` | Test contract functions |
| Setup Frontend | `node scripts/setup-frontend.js` | Configure frontend |

### Network-Specific Commands

```bash
# Local deployment
npx hardhat run scripts/deploy.js --network localhost

# Sepolia deployment
npx hardhat run scripts/deploy.js --network sepolia

# With specific gas settings
npx hardhat run scripts/deploy.js --network sepolia --gas-price 20000000000
```

## 📊 Deployment Verification Checklist

After deployment, verify these items:

### ✅ Smart Contract Verification
- [ ] Contract deployed successfully
- [ ] Contract verified on Etherscan (if applicable)
- [ ] All contract functions accessible
- [ ] Contract constants configured correctly

### ✅ Frontend Verification
- [ ] Frontend builds without errors
- [ ] Contract address configured correctly
- [ ] Network ID matches deployment network
- [ ] Wallet connection works
- [ ] FHEVM integration functional

### ✅ Integration Testing
- [ ] User registration works
- [ ] Activity submission successful
- [ ] Score calculation functional
- [ ] Score decryption works
- [ ] Verification process operational

## 🐛 Troubleshooting

### Common Deployment Issues

#### Issue: "Insufficient funds for gas"
**Solution:**
```bash
# Check wallet balance
npx hardhat run scripts/check-balance.js --network sepolia

# Get test ETH from faucet
# https://sepoliafaucet.com/
```

#### Issue: "Contract verification failed"
**Solution:**
```bash
# Check Etherscan API key
echo $ETHERSCAN_API_KEY

# Retry verification
npx hardhat run scripts/verify-contract.js --network sepolia
```

#### Issue: "Frontend can't connect to contract"
**Solution:**
```bash
# Regenerate frontend config
node scripts/setup-frontend.js

# Check contract address in deployment.json
cat deployment.json

# Verify network configuration
cat frontend/.env
```

#### Issue: "FHEVM not working"
**Solution:**
```bash
# For local development, ensure FHEVM relayer is running
docker-compose up fhevm-relayer

# Check relayer URL in frontend config
grep RELAYER frontend/.env
```

### Gas Optimization

If deployment costs are high:

```bash
# Deploy with optimized gas settings
HARDHAT_NETWORK=sepolia npx hardhat run scripts/deploy.js --gas-price 10000000000

# Check current gas prices
npx hardhat run scripts/check-gas-price.js --network sepolia
```

## 🔄 Updating Deployment

### Contract Updates

```bash
# Deploy new version
npm run deploy

# Update frontend configuration
node scripts/setup-frontend.js

# Verify new contract
npm run verify
```

### Frontend Updates

```bash
# Rebuild frontend
cd frontend && npm run build

# Restart development server
npm start
```

## 📈 Production Deployment Considerations

### Security Checklist
- [ ] Use hardware wallet for mainnet deployment
- [ ] Audit smart contract code
- [ ] Test thoroughly on testnet first
- [ ] Set up monitoring and alerts
- [ ] Prepare incident response plan

### Performance Optimization
- [ ] Optimize contract gas usage
- [ ] Configure CDN for frontend
- [ ] Set up load balancing
- [ ] Monitor transaction costs
- [ ] Implement caching strategies

### Monitoring Setup
- [ ] Set up Etherscan alerts
- [ ] Monitor contract events
- [ ] Track user adoption metrics
- [ ] Monitor gas usage patterns
- [ ] Set up error tracking

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Consult the main README.md for additional information
4. Open an issue on GitHub with deployment details

---

**Happy Deploying! 🚀**