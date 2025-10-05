const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Setting up frontend configuration...");

  // Load deployment information
  const deploymentPath = path.join(__dirname, "..", "deployment.json");
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ Deployment file not found. Please deploy the contract first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const contractAddress = deployment.address;
  const networkName = deployment.network;

  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🌐 Network: ${networkName}`);

  // Determine network ID
  let networkId;
  switch (networkName) {
    case "sepolia":
      networkId = "11155111";
      break;
    case "localhost":
    case "hardhat":
      networkId = "31337";
      break;
    default:
      networkId = "1"; // mainnet default
  }

  // Create frontend environment file
  const frontendEnvPath = path.join(__dirname, "..", "frontend", ".env");
  const envContent = `# FHEScore Frontend Configuration
# Generated automatically by setup-frontend.js

# Contract Configuration
REACT_APP_CONTRACT_ADDRESS=${contractAddress}
REACT_APP_NETWORK_ID=${networkId}

# Network Configuration
REACT_APP_NETWORK_NAME=${networkName}

# FHEVM Configuration
REACT_APP_FHEVM_ENABLED=true

# Development Configuration
REACT_APP_DEBUG=false
`;

  fs.writeFileSync(frontendEnvPath, envContent);
  console.log("✅ Frontend .env file created");

  // Create a config.json file for the frontend
  const frontendConfigPath = path.join(__dirname, "..", "frontend", "src", "config.json");
  const configContent = {
    contract: {
      address: contractAddress,
      network: networkName,
      networkId: networkId
    },
    fhevm: {
      enabled: true,
      relayerUrl: networkName === "localhost" ? "http://localhost:8080" : undefined
    },
    ui: {
      appName: "FHEScore",
      version: "1.0.0",
      description: "Private Credit Scoring with FHEVM"
    },
    deployment: {
      timestamp: deployment.timestamp,
      deployer: deployment.deployer,
      verified: deployment.verified || false
    }
  };

  fs.writeFileSync(frontendConfigPath, JSON.stringify(configContent, null, 2));
  console.log("✅ Frontend config.json file created");

  // Update package.json scripts if needed
  const frontendPackagePath = path.join(__dirname, "..", "frontend", "package.json");
  if (fs.existsSync(frontendPackagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(frontendPackagePath, "utf8"));
    
    // Add environment-specific start scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      "start:sepolia": "REACT_APP_NETWORK_NAME=sepolia npm start",
      "start:localhost": "REACT_APP_NETWORK_NAME=localhost npm start",
      "build:production": "REACT_APP_DEBUG=false npm run build"
    };

    fs.writeFileSync(frontendPackagePath, JSON.stringify(packageJson, null, 2));
    console.log("✅ Frontend package.json updated with network scripts");
  }

  console.log("\n🎉 Frontend setup completed!");
  console.log("\n📋 Next steps:");
  console.log("1. cd frontend");
  console.log("2. npm install");
  console.log("3. npm start");
  console.log("\n🔗 Your contract is deployed at:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });