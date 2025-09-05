import { createPublicClient, createWalletClient, http, formatEther, parseEther } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Deploying AssetRegistry to Sepolia Testnet...");

  // Check for private key
  if (!process.env.PRIVATE_KEY) {
    throw new Error("Please set PRIVATE_KEY in your .env file");
  }

  // Create account from private key (add 0x prefix if not present)
  const privateKey = process.env.PRIVATE_KEY!.startsWith('0x') 
    ? process.env.PRIVATE_KEY as `0x${string}`
    : `0x${process.env.PRIVATE_KEY}` as `0x${string}`;
  
  const account = privateKeyToAccount(privateKey);
  console.log("📝 Deploying contracts with account:", account.address);

  // Create clients
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org"),
  });

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org"),
  });

  // Get account balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log("💰 Account balance:", formatEther(balance), "ETH");

  // Read contract bytecode and ABI
  const artifactPath = path.join(__dirname, "../artifacts/contracts/AssetRegistry.sol/AssetRegistry.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  console.log("⏳ Deploying contract...");
  
  // Deploy the contract
  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode.object as `0x${string}`,
    args: [], // No constructor arguments
  });

  console.log("📊 Transaction hash:", hash);
  console.log("⏳ Waiting for deployment confirmation...");

  // Wait for transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  if (!receipt.contractAddress) {
    throw new Error("Contract deployment failed - no contract address in receipt");
  }

  console.log("✅ AssetRegistry deployed to:", receipt.contractAddress);
  console.log("🔢 Block number:", receipt.blockNumber);
  console.log("⛽ Gas used:", receipt.gasUsed.toString());

  // Export contract data for frontend
  const contractData = {
    address: receipt.contractAddress,
    chainId: 11155111, // Sepolia testnet
    blockNumber: Number(receipt.blockNumber), // Convert BigInt to number
    abi: artifact.abi,
    deploymentTx: hash,
    deployer: account.address,
    network: "Sepolia Testnet"
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
  console.log("   2. Update your .env file with NEXT_PUBLIC_CONTRACT=" + receipt.contractAddress);
  console.log("   3. Test the contract on Sepolia Etherscan: https://sepolia.etherscan.io/address/" + receipt.contractAddress);
  console.log("   4. Restart your Next.js app: cd web && npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
