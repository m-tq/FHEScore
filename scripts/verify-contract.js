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
  const networkName = deployment.network;

  console.log(`🔍 Verifying FHEScore contract on ${networkName}...`);
  console.log(`📍 Contract Address: ${contractAddress}`);

  try {
    // Verify the contract on Etherscan (if supported)
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // FHEScore constructor has no arguments
    });

    console.log("✅ Contract verified successfully!");
    
    // Update deployment file with verification status
    deployment.verified = true;
    deployment.verifiedAt = new Date().toISOString();
    
    fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
    console.log("📝 Deployment file updated with verification status");

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
      
      // Update deployment file
      deployment.verified = true;
      deployment.verifiedAt = new Date().toISOString();
      fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
      
    } else {
      console.error("❌ Verification failed:", error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });