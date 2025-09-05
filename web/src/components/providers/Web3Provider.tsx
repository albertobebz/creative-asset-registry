'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

// Removed mainnet import - using only Sepolia for POC

// Custom Sepolia testnet configuration (compatible with MetaMask)
const sepoliaTestnet = {
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'SEP',
  },
  rpcUrls: {
    public: { http: ['https://ethereum-sepolia.publicnode.com', 'https://rpc.sepolia.org'] },
    default: { http: ['https://ethereum-sepolia.publicnode.com'] },
  },
  blockExplorers: {
    etherscan: { name: 'Sepolia Etherscan', url: 'https://sepolia.etherscan.io' },
    default: { name: 'Sepolia Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
} as const;

// Use RainbowKit's default config with only Sepolia for POC
const config = getDefaultConfig({
  appName: 'Creative Asset Registry',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [sepoliaTestnet], // Only Sepolia for POC
  ssr: false,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
