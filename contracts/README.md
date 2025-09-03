# Creative Asset Registry - Smart Contracts

This directory contains the smart contracts for the Creative Asset Registry, built with Hardhat and Solidity.

## Overview

The `AssetRegistry` contract provides:
- **Asset Registration**: Register creative assets with unique identifiers
- **Ownership Management**: Transfer assets between addresses
- **License Management**: Set and update license information
- **Pausable Operations**: Emergency pause functionality for contract owner

## Contract Functions

### Core Functions
- `registerAsset(bytes32 assetId)` - Register a new asset
- `getRegistration(bytes32 assetId)` - Get asset registration details
- `verifyOwner(bytes32 assetId)` - Verify asset ownership
- `transferAsset(bytes32 assetId, address newOwner)` - Transfer asset ownership
- `setLicense(bytes32 assetId, uint64 expiresAt, string note)` - Set license information

### Admin Functions
- `pause()` - Pause all write operations
- `unpause()` - Resume all operations

### View Functions
- `assetExists(bytes32 assetId)` - Check if asset is registered

## Events

- `AssetRegistered(assetId, owner, timestamp)` - Emitted when asset is registered
- `AssetTransferred(assetId, from, to)` - Emitted when asset is transferred
- `LicenseSet(assetId, expiresAt, note)` - Emitted when license is set/updated

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env with your RPC URL and private key
   ```

3. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

## Testing

Run the comprehensive test suite:

```bash
npx hardhat test
```

Tests cover:
- ✅ Asset registration and duplicate prevention
- ✅ Ownership transfer and validation
- ✅ License management and expiration
- ✅ Pausable functionality
- ✅ Access control and security
- ✅ Event emission
- ✅ Edge cases and error handling

## Deployment

### Local Development
```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

### Polygon Mumbai Testnet
```bash
npx hardhat run scripts/deploy.ts --network mumbai
```

### Deployment Output
After successful deployment, the script will:
1. Deploy the contract to the specified network
2. Export contract ABI and address to `/web/src/abi/AssetRegistry.json`
3. Save deployment artifacts to `/contracts/out/AssetRegistry.json`

## Contract Addresses

### Mumbai Testnet
- **Contract**: `AssetRegistry`
- **Network**: Polygon Mumbai (Chain ID: 80001)
- **Explorer**: [Mumbai Polygonscan](https://mumbai.polygonscan.com/)

## Gas Optimization

The contract is optimized for gas efficiency:
- Uses Solidity 0.8.20 with optimizer enabled
- Efficient storage patterns
- Minimal external calls
- Optimized for common operations

## Security Features

- **OpenZeppelin Contracts**: Battle-tested security patterns
- **Access Control**: Only owner can pause/unpause
- **Input Validation**: Comprehensive parameter checks
- **Reentrancy Protection**: Safe external calls
- **Pausable Operations**: Emergency stop capability

## Development

### Adding New Functions
1. Add function to `AssetRegistry.sol`
2. Add corresponding tests in `test/AssetRegistry.test.ts`
3. Update deployment script if needed
4. Test thoroughly before deployment

### Contract Verification
```bash
npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS
```

## Troubleshooting

### Common Issues
- **Compilation Errors**: Ensure Solidity version compatibility
- **Deployment Failures**: Check RPC URL and private key
- **Test Failures**: Verify Hardhat configuration

### Getting Help
- Check Hardhat documentation: https://hardhat.org/
- Review OpenZeppelin contracts: https://docs.openzeppelin.com/
- Polygon Mumbai faucet: https://faucet.polygon.technology/

## License

MIT License - see LICENSE file for details.
