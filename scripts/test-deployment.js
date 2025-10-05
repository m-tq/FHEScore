const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing deployment configuration...\n");

  // Check if we have a valid private key
  const accounts = await ethers.getSigners();
  if (accounts.length === 0) {
    console.log("❌ No accounts configured. Please set PRIVATE_KEY in .env file");
    console.log("   Example: PRIVATE_KEY=your_64_character_private_key_without_0x_prefix");
    return;
  }

  const [deployer] = accounts;
  console.log("✅ Deployer account:", deployer.address);

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("✅ Network:", network.name || "unknown", "| Chain ID:", network.chainId.toString());

  try {
    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("✅ Account balance:", ethers.formatEther(balance), "ETH");

    if (balance === 0n) {
      console.log("⚠️  Warning: Account has no ETH. You'll need testnet ETH to deploy.");
      if (network.chainId === 11155111n) {
        console.log("   Get Sepolia ETH from: https://sepoliafaucet.com/");
      }
    }

    // Test contract compilation
    console.log("\n📦 Testing contract compilation...");
    const FHEScore = await ethers.getContractFactory("FHEScore");
    console.log("✅ Contract compiled successfully");

    // Estimate deployment gas
    const deploymentData = FHEScore.interface.encodeDeploy([]);
    const gasEstimate = await ethers.provider.estimateGas({
      data: deploymentData,
      from: deployer.address
    });
    console.log("✅ Estimated deployment gas:", gasEstimate.toString());

    // Estimate cost
    const feeData = await ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice || 20000000000n; // 20 gwei fallback
    const estimatedCost = gasPrice * gasEstimate;
    console.log("✅ Estimated deployment cost:", ethers.formatEther(estimatedCost), "ETH");

    console.log("\n🎉 Configuration test passed!");
    console.log("\n📋 To deploy, run:");
    console.log("   npx hardhat run scripts/deploy-sepolia.js --network sepolia");

  } catch (error) {
    console.error("\n❌ Configuration test failed:");
    console.error(error.message);

    if (error.message.includes("FHEVM") || error.message.includes("FHE")) {
      console.log("\n💡 FHEVM Compatibility Issue Detected:");
      console.log("   The FHEScore contract uses FHEVM features that are not supported on Sepolia.");
      console.log("   Consider these alternatives:");
      console.log("   1. Deploy to FHEVM-compatible networks (Inco, Zama)");
      console.log("   2. Modify the contract to remove FHEVM dependencies for Sepolia");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });