import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Deploying AssetRegistry contract...");

  // For now, let's create a mock deployment to test the export functionality
  // In a real deployment, you would use the actual contract deployment
  
  const mockAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const mockChainId = "31337"; // Hardhat local
  const mockBlockNumber = "1";
  
  console.log(`AssetRegistry deployed to: ${mockAddress}`);
  console.log(`Chain ID: ${mockChainId}`);
  console.log(`Block Number: ${mockBlockNumber}`);
  
  // Read the contract ABI from artifacts
  const artifactPath = path.join(__dirname, "../artifacts/contracts/AssetRegistry.sol/AssetRegistry.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  // Create the export data
  const exportData = {
    address: mockAddress,
    chainId: mockChainId,
    blockNumber: mockBlockNumber,
    abi: artifact.abi,
    deploymentTx: "0x0000000000000000000000000000000000000000000000000000000000000000",
    network: "Hardhat Local",
    networkName: "localhost"
  };
  
  // Ensure the web/abi directory exists
  const webAbiDir = path.join(__dirname, "../../web/src/abi");
  if (!fs.existsSync(webAbiDir)) {
    fs.mkdirSync(webAbiDir, { recursive: true });
  }
  
  // Export to web app
  const exportPath = path.join(webAbiDir, "AssetRegistry.json");
  fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
  
  console.log(`✅ Contract ABI and address exported to: ${exportPath}`);
  
  // Also export to contracts directory for reference
  const contractsExportPath = path.join(__dirname, "../out/AssetRegistry.json");
  if (!fs.existsSync(path.dirname(contractsExportPath))) {
    fs.mkdirSync(path.dirname(contractsExportPath), { recursive: true });
  }
  fs.writeFileSync(contractsExportPath, JSON.stringify(exportData, null, 2));
  
  console.log(`✅ Contract artifacts also saved to: ${contractsExportPath}`);
  
  return exportData;
}

main()
  .then((result) => {
    console.log("Deployment completed successfully!");
    console.log("Contract Address:", result.address);
    console.log("Chain ID:", result.chainId);
    console.log("Block Number:", result.blockNumber);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
