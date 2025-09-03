// Network configurations (simplified for POC)

// Get contract details from our exported ABI
import contractData from '../abi/AssetRegistry.json';

// Contract configuration
export const contractConfig = {
  address: contractData.address as `0x${string}`,
  abi: contractData.abi,
  chainId: contractData.chainId,
};

// Network configurations (simplified for POC)
export const networks = {
  polygon: {
    name: 'Polygon',
    chainId: 137,
    chainIdHex: '0x89',
    rpcUrl: 'https://polygon-rpc.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  mainnet: {
    name: 'Ethereum',
    chainId: 1,
    chainIdHex: '0x1',
    rpcUrl: 'https://ethereum.publicnode.com',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://etherscan.io'],
  },
};
// Helper functions
export function getExplorerUrl(network: keyof typeof networks) {
  return networks[network].blockExplorerUrls[0];
}

export function getAddressExplorerUrl(address: string, network: keyof typeof networks = 'polygon') {
  return `${getExplorerUrl(network)}/address/${address}`;
}

export function getTransactionExplorerUrl(txHash: string, network: keyof typeof networks = 'polygon') {
  return `${getExplorerUrl(network)}/tx/${txHash}`;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatHash(hash: string): string {
  if (!hash) return '';
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

