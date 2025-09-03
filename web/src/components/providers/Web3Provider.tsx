'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

import { mainnet } from 'wagmi/chains';

// Custom Amoy testnet configuration (compatible with MetaMask)
const amoyTestnet = {
  id: 80001,
  name: 'Mumbai Testnet', // Use name MetaMask recognizes
  network: 'mumbai',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    public: { http: ['https://rpc-mumbai.maticvigil.com'] },
    default: { http: ['https://rpc-mumbai.maticvigil.com'] },
  },
  blockExplorers: {
    etherscan: { name: 'Mumbai Polygonscan', url: 'https://mumbai.polygonscan.com' },
    default: { name: 'Mumbai Polygonscan', url: 'https://mumbai.polygonscan.com' },
  },
  testnet: true,
} as const;

// Use RainbowKit's default config with both networks
const config = getDefaultConfig({
  appName: 'Creative Asset Registry',
  projectId: 'CREATIVE_ASSET_REGISTRY',
  chains: [mainnet, amoyTestnet], // Include both networks
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
