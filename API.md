# FHEScore API Documentation 📚

This document provides comprehensive API documentation for the FHEScore smart contract and frontend utilities.

## 🔗 Smart Contract API

### Contract Address & ABI

The contract ABI is available in `frontend/src/utils/contract.js` and includes all function signatures and events.

### 📊 Public Constants

#### Scoring Weights
```solidity
uint32 public constant REPAY_WEIGHT = 100;      // +100 points per repayment
uint32 public constant DEFAULT_PENALTY = 200;   // -200 points per default
uint32 public constant STAKING_WEIGHT = 50;     // +50 points per staking day
uint32 public constant GOVERNANCE_WEIGHT = 30;  // +30 points per governance vote
uint32 public constant TRADING_WEIGHT = 20;     // +20 points per trading unit
```

#### Activity Types
```solidity
enum ActivityType {
    REPAY,      // 0 - Loan repayment
    DEFAULT,    // 1 - Loan default
    STAKING,    // 2 - Staking activity
    GOVERNANCE, // 3 - Governance participation
    TRADING     // 4 - Trading volume
}
```

### 👤 User Management Functions

#### `registerUser()`
Initializes a new user with encrypted zero values for all activities.

```solidity
function registerUser() external
```

**Requirements:**
- User must not be already registered
- Transaction must be sent by the user themselves

**Events:**
```solidity
event UserRegistered(address indexed user, uint256 timestamp);
```

**Gas Cost:** ~200,000 gas

---

#### `isUserRegistered(address user)`
Checks if a user is registered in the system.

```solidity
function isUserRegistered(address user) external view returns (bool)
```

**Parameters:**
- `user`: Address to check registration status

**Returns:**
- `bool`: True if user is registered, false otherwise

---

#### `hasCalculatedScore(address user)`
Checks if a user has calculated their credit score.

```solidity
function hasCalculatedScore(address user) external view returns (bool)
```

**Parameters:**
- `user`: Address to check score calculation status

**Returns:**
- `bool`: True if score has been calculated, false otherwise

### 📈 Activity Management Functions

#### `submitActivity(ActivityType activityType, bytes calldata encryptedValue)`
Submits an encrypted activity value to update user's credit profile.

```solidity
function submitActivity(
    ActivityType activityType, 
    bytes calldata encryptedValue
) external
```

**Parameters:**
- `activityType`: Type of activity (0-4, see ActivityType enum)
- `encryptedValue`: Encrypted activity value using FHEVM

**Requirements:**
- User must be registered
- Encrypted value must be valid FHEVM ciphertext

**Events:**
```solidity
event ActivitySubmitted(
    address indexed user, 
    ActivityType activityType, 
    uint256 timestamp
);
```

**Gas Cost:** ~150,000 gas

---

#### `getUserActivities(address user)`
Returns encrypted activity counts for a user.

```solidity
function getUserActivities(address user) external view returns (
    euint32 repayCount,
    euint32 defaultCount,
    euint32 stakingDays,
    euint32 governanceVotes,
    euint32 tradingVolume
)
```

**Parameters:**
- `user`: Address to get activities for

**Returns:**
- Encrypted activity counts for all activity types

**Access Control:**
- Only the user themselves can call this function for their data

### 🧮 Score Management Functions

#### `calculateScore()`
Calculates the user's credit score based on submitted activities.

```solidity
function calculateScore() external
```

**Requirements:**
- User must be registered
- User must have submitted at least one activity

**Events:**
```solidity
event ScoreCalculated(address indexed user, uint256 timestamp);
```

**Gas Cost:** ~300,000 gas

**Calculation Formula:**
```
score = (repayCount * REPAY_WEIGHT) + 
        (stakingDays * STAKING_WEIGHT) + 
        (governanceVotes * GOVERNANCE_WEIGHT) + 
        (tradingVolume * TRADING_WEIGHT) - 
        (defaultCount * DEFAULT_PENALTY)

// Ensure score is not negative
if (score < 0) score = 0
```

---

#### `getScore(address user)`
Returns the encrypted credit score for a user.

```solidity
function getScore(address user) external view returns (euint32)
```

**Parameters:**
- `user`: Address to get score for

**Returns:**
- `euint32`: Encrypted credit score

**Access Control:**
- Only the user themselves can call this function for their data

---

#### `verifyScore(address user)`
Performs zero-knowledge verification if user's score meets the threshold.

```solidity
function verifyScore(address user) external view returns (bool)
```

**Parameters:**
- `user`: Address to verify score for

**Returns:**
- `bool`: True if score >= verification threshold, false otherwise

**Privacy:**
- Does not reveal the actual score value
- Provides cryptographic proof of creditworthiness

### ⚙️ Administrative Functions

#### `updateVerificationThreshold(bytes calldata encryptedThreshold)`
Updates the minimum score threshold for verification (admin only).

```solidity
function updateVerificationThreshold(bytes calldata encryptedThreshold) external onlyOwner
```

**Parameters:**
- `encryptedThreshold`: New encrypted threshold value

**Access Control:**
- Only contract owner can call this function

## 🎨 Frontend API

### React Hooks

#### `useFHEVM()`
Custom hook for FHEVM operations.

```javascript
const { fhevm, encryptValue, decryptValue, isReady, error } = useFHEVM();
```

**Returns:**
- `fhevm`: FHEVM instance
- `encryptValue(value, type, contractAddress, userAddress)`: Encrypt function
- `decryptValue(handle, type, contractAddress, userAddress)`: Decrypt function
- `isReady`: Boolean indicating if FHEVM is ready
- `error`: Error state if initialization failed

**Example Usage:**
```javascript
// Encrypt a value
const encryptedInputs = await encryptValue(100, 'uint32', contractAddress, userAddress);

// Decrypt a value
const decryptedScore = await decryptValue(encryptedHandle, 'uint32', contractAddress, userAddress);
```

---

#### `useWallet()`
Custom hook for wallet management.

```javascript
const { 
  provider, 
  signer, 
  account, 
  chainId, 
  isConnected, 
  isConnecting, 
  error,
  connectWallet,
  disconnectWallet,
  switchToSepolia
} = useWallet();
```

**Functions:**
- `connectWallet()`: Connect MetaMask wallet
- `disconnectWallet()`: Disconnect wallet
- `switchToSepolia()`: Switch to Sepolia network

### Utility Functions

#### Contract Interaction Utilities

Located in `frontend/src/utils/contract.js`:

```javascript
// User management
await registerUser(contract);
const isRegistered = await isUserRegistered(contract, userAddress);
const hasScore = await hasUserCalculatedScore(contract, userAddress);

// Activity submission
await submitActivity(contract, activityType, encryptedInputs);

// Score management
await calculateScore(contract);
const encryptedScore = await getEncryptedScore(contract, userAddress);
const verificationResult = await verifyScore(contract, userAddress);

// Configuration
const config = await getContractConfig(contract);
```

## 🔐 Encryption/Decryption Flow

### Encryption Process

1. **Create Encrypted Input**
   ```javascript
   const encryptedInputs = await fhevm.encryptValue(
     value,           // Plain value to encrypt
     'uint32',        // Data type
     contractAddress, // Contract address
     userAddress      // User address
   );
   ```

2. **Submit to Contract**
   ```javascript
   const tx = await contract.submitActivity(activityType, encryptedInputs);
   await tx.wait();
   ```

### Decryption Process

1. **Get Encrypted Handle**
   ```javascript
   const encryptedScore = await contract.getScore(userAddress);
   ```

2. **Decrypt Value**
   ```javascript
   const decryptedScore = await fhevm.decryptValue(
     encryptedScore,  // Encrypted handle
     'uint32',        // Data type
     contractAddress, // Contract address
     userAddress      // User address
   );
   ```

## 📡 Events

### Contract Events

#### `UserRegistered`
```solidity
event UserRegistered(address indexed user, uint256 timestamp);
```

#### `ActivitySubmitted`
```solidity
event ActivitySubmitted(
    address indexed user, 
    ActivityType activityType, 
    uint256 timestamp
);
```

#### `ScoreCalculated`
```solidity
event ScoreCalculated(address indexed user, uint256 timestamp);
```

#### `VerificationThresholdUpdated`
```solidity
event VerificationThresholdUpdated(uint256 timestamp);
```

### Event Listening

```javascript
// Listen for user registration
contract.on("UserRegistered", (user, timestamp) => {
  console.log(`User ${user} registered at ${new Date(timestamp * 1000)}`);
});

// Listen for activity submissions
contract.on("ActivitySubmitted", (user, activityType, timestamp) => {
  console.log(`User ${user} submitted activity type ${activityType}`);
});
```

## ⚠️ Error Handling

### Common Error Codes

| Error | Description | Solution |
|-------|-------------|----------|
| `UserNotRegistered` | User must register first | Call `registerUser()` |
| `UserAlreadyRegistered` | User already exists | Skip registration |
| `ScoreNotCalculated` | Score must be calculated | Call `calculateScore()` |
| `InvalidActivityType` | Invalid activity type | Use valid ActivityType enum |
| `EncryptionFailed` | FHEVM encryption error | Check FHEVM connection |
| `DecryptionFailed` | FHEVM decryption error | Verify user permissions |

### Error Handling Example

```javascript
try {
  await registerUser(contract);
} catch (error) {
  if (error.message.includes("UserAlreadyRegistered")) {
    console.log("User is already registered");
  } else {
    console.error("Registration failed:", error.message);
  }
}
```

## 🔧 Configuration

### Network Configuration

```javascript
const networks = {
  localhost: {
    chainId: 31337,
    rpcUrl: "http://localhost:8545",
    relayerUrl: "http://localhost:8080"
  },
  sepolia: {
    chainId: 11155111,
    rpcUrl: process.env.SEPOLIA_RPC_URL,
    relayerUrl: "https://relayer.sepolia.zama.ai"
  }
};
```

### Contract Configuration

```javascript
const contractConfig = {
  address: process.env.REACT_APP_CONTRACT_ADDRESS,
  abi: FHEScoreABI,
  weights: {
    repay: 100,
    default: 200,
    staking: 50,
    governance: 30,
    trading: 20
  }
};
```

## 📊 Gas Costs

| Operation | Estimated Gas | USD Cost (20 gwei) |
|-----------|---------------|---------------------|
| User Registration | ~200,000 | ~$1.20 |
| Submit Activity | ~150,000 | ~$0.90 |
| Calculate Score | ~300,000 | ~$1.80 |
| Verify Score | ~50,000 | ~$0.30 |
| Get Score | ~30,000 | ~$0.18 |

*Gas costs are estimates and may vary based on network conditions*

## 🔗 Integration Examples

### Basic Integration

```javascript
import { useFHEVM, useWallet } from './hooks';
import { registerUser, submitActivity } from './utils/contract';

function MyComponent() {
  const { account, isConnected } = useWallet();
  const { fhevm, encryptValue } = useFHEVM();
  
  const handleSubmitActivity = async () => {
    const encryptedValue = await encryptValue(5, 'uint32', contractAddress, account);
    await submitActivity(contract, 0, encryptedValue); // Submit repayment activity
  };
  
  return (
    <div>
      {isConnected ? (
        <button onClick={handleSubmitActivity}>Submit Activity</button>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
```

---

**For more examples and advanced usage, see the main README.md and component implementations.**