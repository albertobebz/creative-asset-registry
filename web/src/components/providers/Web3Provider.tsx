'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

import { mainnet } from 'wagmi/chains';

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
    public: { http: ['https://rpc.sepolia.org'] },
    default: { http: ['https://rpc.sepolia.org'] },
  },
  blockExplorers: {
    etherscan: { name: 'Sepolia Etherscan', url: 'https://sepolia.etherscan.io' },
    default: { name: 'Sepolia Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
} as const;

// Use RainbowKit's default config with both networks
const config = getDefaultConfig({
  appName: 'Creative Asset Registry',
  projectId: 'CREATIVE_ASSET_REGISTRY',
  chains: [mainnet, sepoliaTestnet], // Include both networks
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
