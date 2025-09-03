'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

export function NetworkManager() {
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { isConnected: walletConnected, address, chainId } = useAccount();
  const { switchChain, isPending: isWagmiSwitching } = useSwitchChain();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if we're connected to a supported network
  useEffect(() => {
    console.log('NetworkManager: chainId changed to:', chainId);
    if (chainId) {
      const isSupported = chainId === 80001; // Amoy testnet
      console.log('NetworkManager: isSupported:', isSupported);
      setIsConnected(isSupported);
    } else {
      console.log('NetworkManager: no chainId, setting isConnected to false');
      setIsConnected(false);
    }
  }, [chainId]);

  // Force show network switch if not on Amoy (for testing purposes)
  const forceShowNetworkSwitch = true;

  // Debug logging
  useEffect(() => {
    console.log('NetworkManager: walletConnected:', walletConnected, 'chainId:', chainId, 'isConnected:', isConnected);
  }, [walletConnected, chainId, isConnected]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const switchToAmoy = async () => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSwitching(true);
    setError(null);

    try {
      // Try to add the Amoy network to MetaMask first
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x13881', // 80001 in hex
              chainName: 'Mumbai Testnet', // Use the old name that MetaMask recognizes
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://rpc-mumbai.maticvigil.com'], // Use a more standard RPC
              blockExplorerUrls: ['https://mumbai.polygonscan.com'], // Use Mumbai explorer
            }],
          });
          
          // After adding, try to switch to it
          if (switchChain) {
            switchChain({ chainId: 80001 });
            return;
          }
        } catch (addError: unknown) {
          const error = addError as { code?: number; message?: string };
          console.log('Error adding chain:', error);
          if (error.code === 4001) {
            setError('User rejected adding the network');
          } else if (error.code === -32602) {
            // Chain already exists, try to switch
            if (switchChain) {
              switchChain({ chainId: 80001 });
              return;
            }
          } else {
            setError('Failed to add network: ' + (error.message || 'Unknown error'));
          }
        }
      }
    } catch (err: unknown) {
      const error = err as { code?: number; message?: string };
      
      if (error.code === 4001) {
        setError('User rejected the network switch');
      } else {
        setError(error.message || 'Failed to switch network');
      }
    } finally {
      setIsSwitching(false);
    }
  };



  // If wallet is not connected, show connection prompt
  if (!walletConnected) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Wallet Connection Required
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Please connect your wallet first using the &quot;Connect Wallet&quot; button in the top right corner.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If already connected to Amoy testnet, show success message
  if (isConnected && chainId === 80001) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-green-800">
              Connected to Amoy Testnet
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                You&apos;re now connected to the Amoy testnet. You can proceed with registering assets.
              </p>
              {address && (
                <p className="mt-1 text-xs text-green-600">
                  Wallet: {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Switch to Supported Network
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Your wallet is connected but you need to switch to a supported network to register assets.
              {chainId && (
                <span className="block mt-1">
                  Current network ID: {chainId}
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={switchToAmoy}
              disabled={isSwitching || isWagmiSwitching}
              className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {isSwitching || isWagmiSwitching ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Switching Network...
                </>
              ) : (
                'Switch to Amoy Testnet'
              )}
            </button>
            

          </div>
          {error && (
            <div className="mt-3 text-sm text-red-600">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
