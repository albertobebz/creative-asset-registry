# Creative Asset Registry

A decentralized creative asset registry that provides tamper-proof registration of creative files on the blockchain with certificate generation.

## 🎯 Project Overview

The Creative Asset Registry allows users to:
- **Register creative assets** on-chain with unique identifiers
- **Verify asset ownership** and registration details
- **Transfer asset ownership** between addresses
- **Manage licensing** with expiration dates and notes
- **Generate certificates** (PDF + JSON) with QR codes for verification

## 🏗️ Architecture

This is a monorepo with two main components:

```
creative-asset-registry/
├── contracts/          # Smart contracts (Hardhat + Solidity)
│   ├── contracts/      # Solidity source files
│   ├── scripts/        # Deployment scripts
│   ├── test/           # Contract tests
│   └── hardhat.config.ts
└── web/                # Next.js frontend application
    ├── src/
    │   ├── app/        # Next.js App Router pages
    │   └── abi/        # Contract ABI (auto-generated)
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or other Web3 wallet
- Polygon Mumbai testnet MATIC (get from [faucet](https://faucet.polygon.technology/))

### 1. Clone and Install
```bash
git clone <repository-url>
cd creative-asset-registry
npm install
cd contracts && npm install
```

### 2. Environment Setup
```bash
# Contracts
cd contracts
cp env.example .env
# Edit .env with your RPC URL and private key

# Web App
cd ../web
cp env.example .env.local
# Edit .env.local with your configuration
```

### 3. Deploy Smart Contract
```bash
cd contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.ts --network mumbai
```

### 4. Start Web Application
```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📋 Smart Contract

### AssetRegistry Contract
- **Network**: Polygon Mumbai (Chain ID: 80001)
- **Functions**:
  - `registerAsset(bytes32 assetId)` - Register new asset
  - `getRegistration(bytes32 assetId)` - Get asset details
  - `verifyOwner(bytes32 assetId)` - Verify ownership
  - `transferAsset(bytes32 assetId, address newOwner)` - Transfer ownership
  - `setLicense(bytes32 assetId, uint64 expiresAt, string note)` - Set license

### Security Features
- OpenZeppelin contracts (Ownable, Pausable)
- Access control and input validation
- Emergency pause functionality
- Reentrancy protection

## 🌐 Web Application

### Pages
- **`/register`** - Upload and register creative assets
- **`/dashboard`** - View your registered assets
- **`/verify`** - Verify asset registration by hash or file upload

### Features
- File upload with size and type validation
- Web3 wallet integration (Wagmi + RainbowKit)
- Real-time blockchain interaction
- Certificate generation (PDF + JSON)
- QR code verification

### Technology Stack
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + RainbowKit + Ethers v6
- **Blockchain**: Polygon Mumbai testnet

## 🔧 Configuration

### Environment Variables

#### Contracts (.env)
```bash
RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

#### Web App (.env.local)
```bash
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_CONTRACT=deployed_contract_address
RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
CONFIRMATIONS=2
MAX_FILE_SIZE_MB=100
ALLOWLIST_MIME=image/png,image/jpeg,application/pdf,application/json,text/plain
```

## 📁 File Processing

### Supported File Types
- **Images**: PNG, JPEG (EXIF/ICC stripped, deterministic encoding)
- **Documents**: PDF, JSON, TXT
- **Maximum Size**: 100 MB

### Canonicalization
- **Images**: Strip metadata, re-encode as deterministic PNG
- **Text/JSON**: UTF-8 normalization, RFC8785 key sorting
- **Hashing**: SHA256 (off-chain) + Keccak256 (on-chain assetId)

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

Tests cover:
- Asset registration and duplicate prevention
- Ownership transfer and validation
- License management
- Pausable functionality
- Access control and security

### Frontend Tests
```bash
cd web
npm test
```

## 🚀 Deployment

### Smart Contract
```bash
cd contracts

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.ts --network mumbai

# Verify on Polygonscan
npx hardhat verify --network mumbai DEPLOYED_ADDRESS
```

### Web Application
```bash
cd web

# Build for production
npm run build

# Deploy to Vercel, Netlify, or your preferred platform
```

## 📚 API Reference

### Certificate Endpoints
- `POST /api/certificates` - Generate certificates after registration
- `GET /api/certificates/:assetId.json` - Get certificate JSON
- `GET /api/certificates/:assetId.pdf` - Get certificate PDF

### Rate Limiting
- Certificate generation: 60 requests per minute

## 🔍 Verification

### Public Verification
- Visit `/verify?hash=0x...` with asset hash
- Upload file for automatic verification
- View ownership, timestamp, and transaction details

### Certificate Verification
- QR codes link to verification page
- PDF includes transaction hash and asset ID
- JSON contains complete registration data

## 🛠️ Development

### Adding New Features
1. **Smart Contract**: Add functions to `AssetRegistry.sol`
2. **Tests**: Update test suite in `test/AssetRegistry.test.ts`
3. **Frontend**: Create new pages in `web/src/app/`
4. **API**: Add endpoints in `web/src/app/api/`

### Code Style
- **Solidity**: Follow OpenZeppelin patterns
- **TypeScript**: Use strict mode and proper typing
- **React**: Functional components with hooks
- **CSS**: Tailwind utility classes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

## 🔗 Links

- **Polygon Mumbai**: [https://mumbai.polygonscan.com/](https://mumbai.polygonscan.com/)
- **Hardhat**: [https://hardhat.org/](https://hardhat.org/)
- **Next.js**: [https://nextjs.org/](https://nextjs.org/)
- **Wagmi**: [https://wagmi.sh/](https://wagmi.sh/)
- **OpenZeppelin**: [https://docs.openzeppelin.com/](https://docs.openzeppelin.com/)
