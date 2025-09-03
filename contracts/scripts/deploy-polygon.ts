import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Deploying AssetRegistry to Polygon Mainnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC");

  // Deploy the contract
  const AssetRegistry = await ethers.getContractFactory("AssetRegistry");
  const assetRegistry = await AssetRegistry.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await assetRegistry.waitForDeployment();
  
  const address = await assetRegistry.getAddress();
  const deploymentTx = assetRegistry.deploymentTransaction();
  const receipt = await deploymentTx?.wait();
  
  console.log("✅ AssetRegistry deployed to:", address);
  console.log("📊 Transaction hash:", deploymentTx?.hash);
  console.log("🔢 Block number:", receipt?.blockNumber);
  console.log("⛽ Gas used:", receipt?.gasUsed?.toString());

  // Export contract data for frontend
  const contractData = {
    address: address,
    chainId: 137, // Polygon mainnet
    blockNumber: receipt?.blockNumber || 0,
    abi: JSON.parse(assetRegistry.interface.formatJson()),
    deploymentTx: deploymentTx?.hash,
    deployer: deployer.address,
    network: "Polygon Mainnet"
  };

  // Create web/src/abi directory if it doesn't exist
  const abiDir = path.join(__dirname, "../../web/src/abi");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  // Write contract data to frontend
  const outputPath = path.join(abiDir, "AssetRegistry.json");
  fs.writeFileSync(outputPath, JSON.stringify(contractData, null, 2));
  
  console.log("📁 Contract data exported to:", outputPath);
  console.log("🎯 Next steps:");
  console.log("   1. Copy the contract address above");
  console.log("   2. Update your .env file with NEXT_PUBLIC_CONTRACT=" + address);
  console.log("   3. Test the contract on Polygonscan:", `https://polygonscan.com/address/${address}`);
  console.log("   4. Try registering an asset from your app!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
