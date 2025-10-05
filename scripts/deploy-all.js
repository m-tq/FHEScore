const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting complete FHEScore deployment process...\n");

  const network = process.env.HARDHAT_NETWORK || "localhost";
  console.log(`🌐 Target Network: ${network}`);

  try {
    // Step 1: Deploy the contract
    console.log("📋 Step 1: Deploying FHEScore contract...");
    execSync(`npx hardhat run scripts/deploy.js --network ${network}`, { 
      stdio: "inherit",
      cwd: process.cwd()
    });
    console.log("✅ Contract deployment completed\n");

    // Step 2: Setup frontend configuration
    console.log("📋 Step 2: Setting up frontend configuration...");
    execSync("node scripts/setup-frontend.js", { 
      stdio: "inherit",
      cwd: process.cwd()
    });
    console.log("✅ Frontend setup completed\n");

    // Step 3: Verify contract (only for testnets/mainnet)
    if (network !== "localhost" && network !== "hardhat") {
      console.log("📋 Step 3: Verifying contract on Etherscan...");
      try {
        execSync(`npx hardhat run scripts/verify-contract.js --network ${network}`, { 
          stdio: "inherit",
          cwd: process.cwd()
        });
        console.log("✅ Contract verification completed\n");
      } catch (error) {
        console.log("⚠️ Contract verification failed (this is optional)\n");
      }
    } else {
      console.log("📋 Step 3: Skipping verification for local network\n");
    }

    // Step 4: Test contract interaction
    console.log("📋 Step 4: Testing contract interaction...");
    execSync(`npx hardhat run scripts/interact.js --network ${network}`, { 
      stdio: "inherit",
      cwd: process.cwd()
    });
    console.log("✅ Contract interaction test completed\n");

    // Step 5: Install frontend dependencies
    console.log("📋 Step 5: Installing frontend dependencies...");
    const frontendPath = path.join(process.cwd(), "frontend");
    if (fs.existsSync(frontendPath)) {
      execSync("npm install", { 
        stdio: "inherit",
        cwd: frontendPath
      });
      console.log("✅ Frontend dependencies installed\n");
    }

    // Final summary
    console.log("🎉 FHEScore deployment completed successfully!");
    console.log("\n📋 Deployment Summary:");
    
    // Read deployment info
    const deploymentPath = path.join(process.cwd(), "deployment.json");
    if (fs.existsSync(deploymentPath)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
      console.log(`   📍 Contract Address: ${deployment.address}`);
      console.log(`   🌐 Network: ${deployment.network}`);
      console.log(`   👤 Deployer: ${deployment.deployer}`);
      console.log(`   ⏰ Deployed: ${new Date(deployment.timestamp).toLocaleString()}`);
      console.log(`   ✅ Verified: ${deployment.verified || false}`);
    }

    console.log("\n🚀 Next Steps:");
    console.log("1. cd frontend");
    console.log("2. npm start");
    console.log("3. Open http://localhost:3000 in your browser");
    console.log("4. Connect your MetaMask wallet");
    console.log("5. Start building your private credit score!");

  } catch (error) {
    console.error("❌ Deployment process failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });