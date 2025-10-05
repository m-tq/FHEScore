const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying FHEScore contract...");

  // Get the contract factory
  const FHEScore = await ethers.getContractFactory("FHEScore");

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const fheScore = await FHEScore.deploy();
  
  // Wait for deployment to complete
  await fheScore.waitForDeployment();
  
  const contractAddress = await fheScore.getAddress();
  console.log("✅ FHEScore deployed to:", contractAddress);

  // Log deployment details
  console.log("\n📋 Deployment Summary:");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", network.name);
  console.log("Deployer:", (await ethers.getSigners())[0].address);

  // Verify contract constants
  console.log("\n⚙️ Contract Configuration:");
  console.log("REPAY_WEIGHT:", await fheScore.REPAY_WEIGHT());
  console.log("DEFAULT_PENALTY:", await fheScore.DEFAULT_PENALTY());
  console.log("STAKING_WEIGHT:", await fheScore.STAKING_WEIGHT());
  console.log("GOVERNANCE_WEIGHT:", await fheScore.GOVERNANCE_WEIGHT());
  console.log("TRADING_WEIGHT:", await fheScore.TRADING_WEIGHT());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: network.name,
    deploymentTime: new Date().toISOString(),
    deployer: (await ethers.getSigners())[0].address
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n💾 Deployment info saved to deployment.json");
  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });