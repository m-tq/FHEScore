const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting FHEScore deployment to Sepolia...");
  console.log("⚠️  WARNING: This contract uses FHEVM features that are NOT compatible with Sepolia!");
  console.log("   Consider deploying to FHEVM-compatible networks instead.\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  if (balance < ethers.parseEther("0.1")) {
    console.log("⚠️  Warning: Low balance. You may need more ETH for deployment.");
  }

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "| Chain ID:", network.chainId.toString());

  try {
    // Deploy FHEScore contract
    console.log("\n📦 Deploying FHEScore contract...");
    const FHEScore = await ethers.getContractFactory("FHEScore");
    
    // Estimate gas
    const deploymentData = FHEScore.interface.encodeDeploy([]);
    const gasEstimate = await ethers.provider.estimateGas({
      data: deploymentData
    });
    console.log("⛽ Estimated gas:", gasEstimate.toString());

    const fheScore = await FHEScore.deploy();
    await fheScore.waitForDeployment();

    const contractAddress = await fheScore.getAddress();
    const deploymentTx = fheScore.deploymentTransaction();

    console.log("\n✅ Deployment successful!");
    console.log("📍 Contract address:", contractAddress);
    console.log("🔗 Transaction hash:", deploymentTx.hash);
    console.log("⛽ Gas used:", deploymentTx.gasLimit.toString());

    // Calculate deployment cost
    const gasPrice = deploymentTx.gasPrice || 0n;
    const deploymentCost = gasPrice * deploymentTx.gasLimit;
    console.log("💸 Deployment cost:", ethers.formatEther(deploymentCost), "ETH");

    // Save deployment info
    const deploymentInfo = {
      network: network.name,
      chainId: network.chainId.toString(),
      contractAddress: contractAddress,
      transactionHash: deploymentTx.hash,
      deployer: deployer.address,
      gasUsed: deploymentTx.gasLimit.toString(),
      gasPrice: gasPrice.toString(),
      deploymentCost: ethers.formatEther(deploymentCost),
      timestamp: new Date().toISOString(),
      blockNumber: deploymentTx.blockNumber
    };

    const deploymentPath = path.join(__dirname, "..", "deployment.json");
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("💾 Deployment info saved to:", deploymentPath);

    // Contract verification info
    console.log("\n🔍 To verify the contract on Etherscan, run:");
    console.log(`npx hardhat verify --network sepolia ${contractAddress}`);

    // Frontend configuration
    console.log("\n⚙️  Update your frontend .env file:");
    console.log(`REACT_APP_CONTRACT_ADDRESS=${contractAddress}`);
    console.log(`REACT_APP_NETWORK_ID=${network.chainId.toString()}`);

    console.log("\n🎉 Deployment completed successfully!");

  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error.message);
    
    if (error.message.includes("FHEVM") || error.message.includes("FHE")) {
      console.log("\n💡 This error is likely due to FHEVM incompatibility with Sepolia.");
      console.log("   Consider deploying to FHEVM-compatible networks:");
      console.log("   - Inco Testnet: npx hardhat run scripts/deploy.js --network incoTestnet");
      console.log("   - Zama Devnet: npx hardhat run scripts/deploy.js --network zamaDevnet");
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });