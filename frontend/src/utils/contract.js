import { ethers } from 'ethers';

// Contract ABI - This would typically be imported from a generated file
export const FHESCORE_ABI = [
  // Events
  "event ActivitySubmitted(address indexed user, uint8 activityType)",
  "event ScoreCalculated(address indexed user)",
  "event ScoreVerified(address indexed user, bool result)",
  
  // View functions
  "function registeredUsers(address) view returns (bool)",
  "function hasCalculatedScore(address user) view returns (bool)",
  "function getScore() view returns (uint256)",
  "function getUserActivities() view returns (uint256, uint256, uint256, uint256, uint256)",
  "function verifyScore(address user) view returns (uint256)",
  
  // State changing functions
  "function registerUser()",
  "function submitActivity(uint8 activityType, uint256 encryptedValue, bytes calldata inputProof)",
  "function calculateScore()",
  "function updateVerificationThreshold(uint256 newThreshold, bytes calldata inputProof)",
  
  // Constants
  "function REPAY_WEIGHT() view returns (uint32)",
  "function DEFAULT_PENALTY() view returns (uint32)",
  "function STAKING_WEIGHT() view returns (uint32)",
  "function GOVERNANCE_WEIGHT() view returns (uint32)",
  "function TRADING_WEIGHT() view returns (uint32)"
];

// Activity types enum
export const ACTIVITY_TYPES = {
  REPAY: 0,
  DEFAULT: 1,
  STAKING: 2,
  GOVERNANCE: 3,
  TRADING: 4
};

export const ACTIVITY_NAMES = {
  [ACTIVITY_TYPES.REPAY]: 'Loan Repayment',
  [ACTIVITY_TYPES.DEFAULT]: 'Loan Default',
  [ACTIVITY_TYPES.STAKING]: 'Staking Activity',
  [ACTIVITY_TYPES.GOVERNANCE]: 'Governance Participation',
  [ACTIVITY_TYPES.TRADING]: 'Trading Volume'
};

// Default contract address (should be updated after deployment)
export const DEFAULT_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

/**
 * Create a contract instance
 * @param {string} contractAddress - The contract address
 * @param {Object} signerOrProvider - Ethers signer or provider
 * @returns {Object} Contract instance
 */
export const createContractInstance = (contractAddress, signerOrProvider) => {
  return new ethers.Contract(contractAddress, FHESCORE_ABI, signerOrProvider);
};

/**
 * Get contract configuration (weights and penalties)
 * @param {Object} contract - Contract instance
 * @returns {Object} Contract configuration
 */
export const getContractConfig = async (contract) => {
  try {
    const [repayWeight, defaultPenalty, stakingWeight, governanceWeight, tradingWeight] = await Promise.all([
      contract.REPAY_WEIGHT(),
      contract.DEFAULT_PENALTY(),
      contract.STAKING_WEIGHT(),
      contract.GOVERNANCE_WEIGHT(),
      contract.TRADING_WEIGHT()
    ]);

    return {
      repayWeight: Number(repayWeight),
      defaultPenalty: Number(defaultPenalty),
      stakingWeight: Number(stakingWeight),
      governanceWeight: Number(governanceWeight),
      tradingWeight: Number(tradingWeight)
    };
  } catch (error) {
    console.error('Failed to get contract configuration:', error);
    throw error;
  }
};

/**
 * Check if user is registered
 * @param {Object} contract - Contract instance
 * @param {string} userAddress - User address
 * @returns {boolean} Registration status
 */
export const isUserRegistered = async (contract, userAddress) => {
  try {
    return await contract.registeredUsers(userAddress);
  } catch (error) {
    console.error('Failed to check user registration:', error);
    throw error;
  }
};

/**
 * Check if user has calculated their score
 * @param {Object} contract - Contract instance
 * @param {string} userAddress - User address
 * @returns {boolean} Score calculation status
 */
export const hasUserCalculatedScore = async (contract, userAddress) => {
  try {
    return await contract.hasCalculatedScore(userAddress);
  } catch (error) {
    console.error('Failed to check score calculation status:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} contract - Contract instance
 * @returns {Object} Transaction result
 */
export const registerUser = async (contract) => {
  try {
    const tx = await contract.registerUser();
    return await tx.wait();
  } catch (error) {
    console.error('Failed to register user:', error);
    throw error;
  }
};

/**
 * Submit encrypted activity
 * @param {Object} contract - Contract instance
 * @param {number} activityType - Type of activity (0-4)
 * @param {Object} encryptedInputs - Encrypted inputs from FHEVM
 * @returns {Object} Transaction result
 */
export const submitActivity = async (contract, activityType, encryptedInputs) => {
  try {
    const tx = await contract.submitActivity(
      activityType,
      encryptedInputs.handles[0],
      encryptedInputs.inputProof
    );
    return await tx.wait();
  } catch (error) {
    console.error('Failed to submit activity:', error);
    throw error;
  }
};

/**
 * Calculate user's credit score
 * @param {Object} contract - Contract instance
 * @returns {Object} Transaction result
 */
export const calculateScore = async (contract) => {
  try {
    const tx = await contract.calculateScore();
    return await tx.wait();
  } catch (error) {
    console.error('Failed to calculate score:', error);
    throw error;
  }
};

/**
 * Get user's encrypted score
 * @param {Object} contract - Contract instance
 * @returns {string} Encrypted score handle
 */
export const getUserScore = async (contract) => {
  try {
    return await contract.getScore();
  } catch (error) {
    console.error('Failed to get user score:', error);
    throw error;
  }
};

/**
 * Get user's encrypted activities
 * @param {Object} contract - Contract instance
 * @returns {Array} Array of encrypted activity handles
 */
export const getUserActivities = async (contract) => {
  try {
    const activities = await contract.getUserActivities();
    return {
      repayCount: activities[0],
      defaultCount: activities[1],
      stakingDuration: activities[2],
      governanceCount: activities[3],
      tradingVolume: activities[4]
    };
  } catch (error) {
    console.error('Failed to get user activities:', error);
    throw error;
  }
};

/**
 * Verify if user's score meets threshold
 * @param {Object} contract - Contract instance
 * @param {string} userAddress - User address to verify
 * @returns {string} Encrypted verification result
 */
export const verifyUserScore = async (contract, userAddress) => {
  try {
    return await contract.verifyScore(userAddress);
  } catch (error) {
    console.error('Failed to verify user score:', error);
    throw error;
  }
};

/**
 * Format transaction error for user display
 * @param {Error} error - Transaction error
 * @returns {string} Formatted error message
 */
export const formatTransactionError = (error) => {
  if (error.code === 'ACTION_REJECTED') {
    return 'Transaction was rejected by user';
  }
  
  if (error.code === 'INSUFFICIENT_FUNDS') {
    return 'Insufficient funds for transaction';
  }
  
  if (error.reason) {
    return error.reason;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};