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

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

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
      const error = err as { message?: string };
      setError(error.message || 'Failed to register asset');
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
