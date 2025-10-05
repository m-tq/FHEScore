// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, ebool, externalEuint32, externalEbool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHEScore - Private Credit Score System
 * @dev A privacy-preserving credit scoring system using FHEVM
 * Users can submit encrypted activity data and get encrypted scores
 * without revealing sensitive information
 */
contract FHEScore is SepoliaConfig {
    
    // Events
    event ActivitySubmitted(address indexed user, uint8 activityType);
    event ScoreCalculated(address indexed user);
    event ScoreVerified(address indexed user, bool result);
    
    // Activity types
    enum ActivityType {
        REPAY,          // 0 - Loan repayment
        DEFAULT,        // 1 - Loan default
        STAKING,        // 2 - Staking activity
        GOVERNANCE,     // 3 - Governance participation
        TRADING         // 4 - Trading volume
    }
    
    // User data structure
    struct UserData {
        euint32 totalScore;
        euint32 repayCount;
        euint32 defaultCount;
        euint32 stakingDuration;
        euint32 governanceCount;
        euint32 tradingVolume;
        bool hasScore;
    }
    
    // Mappings
    mapping(address => UserData) private userData;
    mapping(address => bool) public registeredUsers;
    
    // Score weights (public for transparency)
    uint32 public constant REPAY_WEIGHT = 100;
    uint32 public constant DEFAULT_PENALTY = 200;
    uint32 public constant STAKING_WEIGHT = 50;
    uint32 public constant GOVERNANCE_WEIGHT = 30;
    uint32 public constant TRADING_WEIGHT = 20;
    
    // Minimum score threshold for verification
    euint32 private verificationThreshold;
    
    constructor() {
        // Set verification threshold to 700 (encrypted)
        verificationThreshold = FHE.asEuint32(700);
        FHE.allowThis(verificationThreshold);
    }
    
    /**
     * @dev Register a new user in the system
     */
    function registerUser() external {
        require(!registeredUsers[msg.sender], "User already registered");
        
        // Initialize user data with encrypted zeros
        userData[msg.sender] = UserData({
            totalScore: FHE.asEuint32(0),
            repayCount: FHE.asEuint32(0),
            defaultCount: FHE.asEuint32(0),
            stakingDuration: FHE.asEuint32(0),
            governanceCount: FHE.asEuint32(0),
            tradingVolume: FHE.asEuint32(0),
            hasScore: false
        });
        
        // Grant permissions
        FHE.allowThis(userData[msg.sender].totalScore);
        FHE.allowThis(userData[msg.sender].repayCount);
        FHE.allowThis(userData[msg.sender].defaultCount);
        FHE.allowThis(userData[msg.sender].stakingDuration);
        FHE.allowThis(userData[msg.sender].governanceCount);
        FHE.allowThis(userData[msg.sender].tradingVolume);
        
        registeredUsers[msg.sender] = true;
    }
    
    /**
     * @dev Submit encrypted activity data
     * @param activityType Type of activity (0-4)
     * @param encryptedValue Encrypted value for the activity
     * @param inputProof Proof for the encrypted input
     */
    function submitActivity(
        uint8 activityType,
        externalEuint32 encryptedValue,
        bytes calldata inputProof
    ) external {
        require(registeredUsers[msg.sender], "User not registered");
        require(activityType <= 4, "Invalid activity type");
        
        euint32 value = FHE.fromExternal(encryptedValue, inputProof);
        UserData storage user = userData[msg.sender];
        
        if (activityType == uint8(ActivityType.REPAY)) {
            user.repayCount = FHE.add(user.repayCount, value);
            FHE.allowThis(user.repayCount);
        } else if (activityType == uint8(ActivityType.DEFAULT)) {
            user.defaultCount = FHE.add(user.defaultCount, value);
            FHE.allowThis(user.defaultCount);
        } else if (activityType == uint8(ActivityType.STAKING)) {
            user.stakingDuration = FHE.add(user.stakingDuration, value);
            FHE.allowThis(user.stakingDuration);
        } else if (activityType == uint8(ActivityType.GOVERNANCE)) {
            user.governanceCount = FHE.add(user.governanceCount, value);
            FHE.allowThis(user.governanceCount);
        } else if (activityType == uint8(ActivityType.TRADING)) {
            user.tradingVolume = FHE.add(user.tradingVolume, value);
            FHE.allowThis(user.tradingVolume);
        }
        
        emit ActivitySubmitted(msg.sender, activityType);
    }
    
    /**
     * @dev Calculate the user's credit score based on all activities
     */
    function calculateScore() external {
        require(registeredUsers[msg.sender], "User not registered");
        
        UserData storage user = userData[msg.sender];
        
        // Calculate positive score components
        euint32 repayScore = FHE.mul(user.repayCount, FHE.asEuint32(REPAY_WEIGHT));
        euint32 stakingScore = FHE.mul(user.stakingDuration, FHE.asEuint32(STAKING_WEIGHT));
        euint32 governanceScore = FHE.mul(user.governanceCount, FHE.asEuint32(GOVERNANCE_WEIGHT));
        euint32 tradingScore = FHE.mul(user.tradingVolume, FHE.asEuint32(TRADING_WEIGHT));
        
        // Calculate penalty from defaults
        euint32 defaultPenalty = FHE.mul(user.defaultCount, FHE.asEuint32(DEFAULT_PENALTY));
        
        // Sum positive components
        euint32 positiveScore = FHE.add(repayScore, stakingScore);
        positiveScore = FHE.add(positiveScore, governanceScore);
        positiveScore = FHE.add(positiveScore, tradingScore);
        
        // Subtract penalty (ensuring no underflow by using conditional logic)
        ebool hasPenalty = FHE.gt(defaultPenalty, positiveScore);
        user.totalScore = FHE.select(hasPenalty, FHE.asEuint32(0), FHE.sub(positiveScore, defaultPenalty));
        
        FHE.allowThis(user.totalScore);
        user.hasScore = true;
        
        emit ScoreCalculated(msg.sender);
    }
    
    /**
     * @dev Get user's encrypted score (only the user can decrypt it)
     * @return The encrypted credit score
     */
    function getScore() external returns (euint32) {
        require(registeredUsers[msg.sender], "User not registered");
        require(userData[msg.sender].hasScore, "Score not calculated yet");
        
        // Grant permission to the user to decrypt their score
        FHE.allow(userData[msg.sender].totalScore, msg.sender);
        return userData[msg.sender].totalScore;
    }
    
    /**
     * @dev Verify if user's score meets the threshold without revealing the actual score
     * @param user Address of the user to verify
     * @return Encrypted boolean indicating if score >= threshold
     */
    function verifyScore(address user) external returns (ebool) {
        require(registeredUsers[user], "User not registered");
        require(userData[user].hasScore, "Score not calculated yet");
        
        ebool meetsThreshold = FHE.ge(userData[user].totalScore, verificationThreshold);
        FHE.allow(meetsThreshold, msg.sender);
        return meetsThreshold;
    }
    
    /**
     * @dev Get user's activity counts (encrypted)
     * @return repayCount, defaultCount, stakingDuration, governanceCount, tradingVolume
     */
    function getUserActivities() external returns (
        euint32,
        euint32,
        euint32,
        euint32,
        euint32
    ) {
        require(registeredUsers[msg.sender], "User not registered");
        
        UserData storage user = userData[msg.sender];
        
        // Grant permissions to the user
        FHE.allow(user.repayCount, msg.sender);
        FHE.allow(user.defaultCount, msg.sender);
        FHE.allow(user.stakingDuration, msg.sender);
        FHE.allow(user.governanceCount, msg.sender);
        FHE.allow(user.tradingVolume, msg.sender);
        
        return (
            user.repayCount,
            user.defaultCount,
            user.stakingDuration,
            user.governanceCount,
            user.tradingVolume
        );
    }
    
    /**
     * @dev Check if user has calculated their score
     * @param user Address to check
     * @return Boolean indicating if score exists
     */
    function hasCalculatedScore(address user) external view returns (bool) {
        return userData[user].hasScore;
    }
    
    /**
     * @dev Update verification threshold (only contract owner in a real implementation)
     * @param newThreshold New threshold value
     * @param inputProof Proof for the encrypted input
     */
    function updateVerificationThreshold(
        externalEuint32 newThreshold,
        bytes calldata inputProof
    ) external {
        // In a production environment, add access control here
        verificationThreshold = FHE.fromExternal(newThreshold, inputProof);
        FHE.allowThis(verificationThreshold);
    }
}