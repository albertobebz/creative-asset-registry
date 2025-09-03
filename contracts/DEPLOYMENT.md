# 🚀 Deploy AssetRegistry to Polygon Amoy Testnet (POC)

## Why Amoy Testnet?
- **Free test MATIC** tokens available
- **No real money** at risk
- **Perfect for testing** your app
- **Easy deployment** process

## Prerequisites

1. **Test MATIC**: Get free tokens from faucet
2. **Private Key**: Your wallet's private key (without 0x prefix)
3. **RPC Access**: Free Mumbai RPC endpoint

## Step 1: Get Free Test MATIC

🚰 **Get free MATIC tokens:**
- [Polygon Faucet](https://faucet.polygon.technology/) - Official faucet (select "Polygon Amoy")
- [Alchemy Faucet](https://mumbai-faucet.alchemy.com/) - If using Alchemy
- [Chainlink Faucet](https://faucets.chain.link/) - Alternative option

**You need about 0.1 MATIC for deployment + testing**

## Step 2: Setup Environment

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your private key:
   ```bash
   PRIVATE_KEY=your_actual_private_key_here
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   ```

## Step 3: Deploy Contract

```bash
# Deploy to Mumbai testnet
npx hardhat run scripts/deploy-mumbai.ts --network mumbai
```

## Step 4: Update Frontend

1. Copy the deployed contract address from the output
2. Update `web/.env`:
   ```bash
   NEXT_PUBLIC_CONTRACT=YOUR_DEPLOYED_ADDRESS
   NEXT_PUBLIC_CHAIN_ID=80001
   ```

3. Restart your Next.js app:
   ```bash
   cd web
   npm run dev
   ```

## Expected Output

```
🚀 Deploying AssetRegistry to Polygon Mumbai Testnet...
📝 Deploying contracts with account: 0x...
💰 Account balance: 0.5 MATIC
⏳ Waiting for deployment confirmation...
✅ AssetRegistry deployed to: 0x...
📊 Transaction hash: 0x...
🔢 Block number: 12345678
⛽ Gas used: 1234567
📁 Contract data exported to: web/src/abi/AssetRegistry.json
```

## Free RPC Endpoints

- `https://rpc-mumbai.maticvigil.com` - Free, no API key needed
- `https://polygon-mumbai.g.alchemy.com/v2/your-api-key` - Alchemy (free tier)
- `https://polygon-mumbai.infura.io/v3/your-project-id` - Infura (free tier)

## Test Your App

1. **Switch to Amoy** in MetaMask (chainId: 80001)
2. **Connect wallet** to your app
3. **Try registering** an asset
4. **Check dashboard** for your assets
5. **Verify on** [Amoy Polygonscan](https://amoy.polygonscan.com)

## Troubleshooting

- **Insufficient funds**: Get more test MATIC from faucet
- **RPC errors**: Try different RPC endpoints
- **Network issues**: Make sure MetaMask is on Mumbai (chainId: 80001)

## Next Steps After Testing

1. ✅ **Test everything works** on Mumbai
2. 🚀 **Deploy to mainnet** when ready
3. 💰 **Get real MATIC** for mainnet deployment

## Security Notes

- **Testnet only**: No real money involved
- **Private key**: Still keep it secure (never commit to git)
- **Use test wallet**: Consider using a separate wallet for testing

🎯 **You're ready to deploy to Mumbai testnet! Much simpler for POC!**
