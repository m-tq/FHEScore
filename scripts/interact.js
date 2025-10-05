const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Load deployment information
  const deploymentPath = path.join(__dirname, "..", "deployment.json");
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ Deployment file not found. Please deploy the contract first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const contractAddress = deployment.address;

  console.log(`🔗 Connecting to FHEScore contract at: ${contractAddress}`);

  // Get contract instance
  const FHEScore = await hre.ethers.getContractFactory("FHEScore");
  const contract = FHEScore.attach(contractAddress);

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log(`👤 Using account: ${signer.address}`);

  try {
    console.log("\n📊 Reading contract configuration...");
    
    // Read public constants
    const repayWeight = await contract.REPAY_WEIGHT();
    const defaultPenalty = await contract.DEFAULT_PENALTY();
    const stakingWeight = await contract.STAKING_WEIGHT();
    const governanceWeight = await contract.GOVERNANCE_WEIGHT();
    const tradingWeight = await contract.TRADING_WEIGHT();

    console.log("⚙️ Contract Configuration:");
    console.log(`   Repay Weight: +${repayWeight}`);
    console.log(`   Default Penalty: -${defaultPenalty}`);
    console.log(`   Staking Weight: +${stakingWeight}`);
    console.log(`   Governance Weight: +${governanceWeight}`);
    console.log(`   Trading Weight: +${tradingWeight}`);

    // Check if user is registered
    console.log("\n👤 Checking user registration...");
    const isRegistered = await contract.isUserRegistered(signer.address);
    console.log(`   User registered: ${isRegistered}`);

    if (isRegistered) {
      // Check if score is calculated
      const hasScore = await contract.hasCalculatedScore(signer.address);
      console.log(`   Score calculated: ${hasScore}`);
    }

    console.log("\n✅ Contract interaction completed successfully!");

  } catch (error) {
    console.error("❌ Contract interaction failed:", error.message);
    process.exit(1);
  }
}

// Helper function to demonstrate registration (commented out for safety)
async function demonstrateRegistration() {
  console.log("\n📝 Demonstrating user registration...");
  
  // Uncomment and modify as needed for testing
  /*
  try {
    const tx = await contract.registerUser();
    console.log(`   Transaction hash: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`   ✅ User registered in block: ${receipt.blockNumber}`);
  } catch (error) {
    console.error("   ❌ Registration failed:", error.message);
  }
  */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });