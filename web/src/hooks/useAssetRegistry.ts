'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractConfig } from '../lib/web3';
// Network configurations

// Types for our asset data
export interface AssetRegistration {
  owner: string;
  timestamp: bigint;
  licenseExpiresAt: bigint;
  licenseNote: string;
}

export interface AssetData {
  assetId: string;
  filename: string;
  mime: string;
  size: number;
  sha256Raw: string;
  txHash: string;
  registration: AssetRegistration;
}

// Hook for reading asset registration data
export function useAssetRegistration(assetId: string | null) {
  const [data, setData] = useState<AssetRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isConnected, chainId } = useAccount();

  // Read contract data with explicit chain configuration
  const {
    data: contractData,
    isPending,
    error: contractError,
    refetch
  } = useReadContract({
    ...contractConfig,
    functionName: 'getRegistration',
    args: assetId ? [assetId as `0x${string}`] : undefined,
    query: {
      enabled: !!assetId && isConnected,
    },
    // Force chain configuration
    chainId: chainId || 1,
  });

  // Process the contract data
  useEffect(() => {
    if (contractData && Array.isArray(contractData)) {
      const [owner, timestamp, licenseExpiresAt, licenseNote] = contractData;
      
      setData({
        owner: owner as string,
        timestamp: timestamp as bigint,
        licenseExpiresAt: licenseExpiresAt as bigint,
        licenseNote: licenseNote as string,
      });
      setError(null);
    } else if (contractError) {
      setError(contractError.message);
      setData(null);
    }
    
    setIsLoading(isPending);
  }, [contractData, contractError, isPending]);

  return {
    data,
    isLoading,
    error,
    refetch,
    chainId,
  };
}

// Hook for checking if an asset exists
export function useAssetExists(assetId: string | null) {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isConnected, chainId } = useAccount();

  const {
    data: contractData,
    isPending,
    error: contractError,
  } = useReadContract({
    ...contractConfig,
    functionName: 'assetExists',
    args: assetId ? [assetId as `0x${string}`] : undefined,
    query: {
      enabled: !!assetId && isConnected,
    },
    // Force chain configuration
    chainId: chainId || 1,
  });

  useEffect(() => {
    if (contractData !== undefined) {
      setExists(contractData as boolean);
      setError(null);
    } else if (contractError) {
      setError(contractError.message);
      setExists(null);
    }
    
    setIsLoading(isPending);
  }, [contractData, contractError, isPending]);

  return {
    exists,
    isLoading,
    error,
  };
}

// Hook for registering a new asset
export function useRegisterAsset() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { isConnected, chainId } = useAccount();

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash,
    chainId: chainId || 1,
  });

  // Debug logging for transaction receipt
  useEffect(() => {
    if (hash) {
      console.log('Transaction receipt states:', {
        hash,
        isConfirming,
        isSuccess,
        receiptError,
        chainId
      });
    }
  }, [hash, isConfirming, isSuccess, receiptError, chainId]);

  const registerAsset = async (assetId: string) => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!assetId || assetId.length !== 66 || !assetId.startsWith('0x')) {
      setError('Invalid asset ID format. Must be 32 bytes hex string starting with 0x');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      writeContract({
        ...contractConfig,
        functionName: 'registerAsset',
        args: [assetId as `0x${string}`],
        // Force chain configuration
        chainId: chainId || 1,
      });
    } catch (err: unknown) {
      const error = err as { message?: string; code?: string; reason?: string };
      console.log('Contract error details:', error);
      
      let errorMessage = 'Failed to register asset';
      
      // Check for specific error types
      if (error.message) {
        if (error.message.includes('insufficient funds') || 
            error.message.includes('insufficient balance') ||
            error.message.includes('gas required exceeds allowance')) {
          errorMessage = 'Transaction failed — insufficient funds for gas. Please add Sepolia ETH to your wallet.';
        } else if (error.message.includes('user rejected') || 
                   error.message.includes('User denied')) {
          errorMessage = 'Transaction cancelled by user';
        } else if (error.message.includes('revert')) {
          errorMessage = 'Transaction failed — smart contract reverted. Please check the contract state.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Update state when transaction hash is available
  useEffect(() => {
    if (hash) {
      setTxHash(hash);
    }
  }, [hash]);

  // Update loading state
  useEffect(() => {
    setIsLoading(isPending || isConfirming);
  }, [isPending, isConfirming]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
    }
  }, [isSuccess]);

  return {
    registerAsset,
    isLoading,
    error,
    txHash,
    isSuccess,
    isConfirming,
  };
}
