# FHEScore Contract Deployment Guide

## ⚠️ Important Notice

The FHEScore contract uses **FHEVM (Fully Homomorphic Encryption Virtual Machine)** features, which are **NOT compatible** with standard Ethereum networks like Sepolia, Mainnet, or Polygon.

## Deployment Options

### Option 1: Deploy to FHEVM-Compatible Networks (Recommended)

For full FHE functionality, deploy to:
- **Inco Network Testnet** (chainId: 9090)
- **Zama Devnet** (chainId: 8009)

### Option 2: Deploy to Sepolia (Requires Contract Modification)

To deploy on Sepolia, you must first modify the contract to remove FHEVM dependencies.

## Prerequisites

1. **Node.js** and **npm** installed
2. **Hardhat** development environment
3. **Wallet with testnet ETH**:
   - For Sepolia: Get ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
   - For Inco: Get test tokens from Inco faucet
   - For Zama: Get test tokens from Zama faucet

## Step-by-Step Deployment

### 1. Set Up Environment Variables

Edit the `.env` file with your credentials:

```bash
# For Sepolia deployment
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_without_0x_prefix

# For FHEVM networks
INCO_TESTNET_RPC_URL=https://testnet.inco.org
ZAMA_DEVNET_RPC_URL=https://devnet.zama.ai

# Optional: For contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**🔒 Security Note**: Never commit the `.env` file to version control!

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Contracts

```bash
npx hardhat compile
```

### 4. Deploy Contract

#### For FHEVM Networks (Recommended):

```bash
# Deploy to Inco Testnet
npx hardhat run scripts/deploy.js --network incoTestnet

# Deploy to Zama Devnet
npx hardhat run scripts/deploy.js --network zamaDevnet
```

#### For Sepolia (After Contract Modification):

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Verify Deployment

After successful deployment, you'll see output like:

```
FHEScore deployed to: 0x1234567890123456789012345678901234567890
Transaction hash: 0xabcdef...
Gas used: 2,500,000
Deployment cost: 0.05 ETH
```

### 6. Update Frontend Configuration

Update your frontend `.env` file:

```bash
REACT_APP_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
REACT_APP_NETWORK_ID=11155111  # For Sepolia
# REACT_APP_NETWORK_ID=9090    # For Inco
# REACT_APP_NETWORK_ID=8009    # For Zama
```

### 7. Verify Contract (Optional)

For Sepolia:
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Troubleshooting

### Common Issues:

1. **"Insufficient funds"**: Ensure your wallet has enough testnet ETH
2. **"Invalid private key"**: Check your private key format (no 0x prefix)
3. **"Network not found"**: Verify RPC URL and network configuration
4. **"FHEVM not supported"**: Use FHEVM-compatible networks for full functionality

### Gas Estimation:

- **Sepolia**: ~2-3M gas (~0.04-0.06 ETH at 20 gwei)
- **FHEVM Networks**: Varies by network

## Next Steps

1. Test contract functions using Hardhat console
2. Update frontend to connect to deployed contract
3. Test end-to-end functionality
4. Consider mainnet deployment (for FHEVM networks only)

## Support

- Hardhat Documentation: https://hardhat.org/docs
- Inco Network: https://docs.inco.org
- Zama Documentation: https://docs.zama.ai