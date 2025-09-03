'use client';

import { useState } from 'react';
import { useAssetRegistration, useAssetExists, useRegisterAsset } from '../hooks/useAssetRegistry';
import { formatAddress, formatHash } from '../lib/web3';

export function SmartContractTester() {
  const [assetId, setAssetId] = useState<string>('');
  const [testMode, setTestMode] = useState<'read' | 'register'>('read');

  // Test asset ID for quick testing
  const testAssetId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🧪 Smart Contract Tester
      </h3>
      
      <div className="space-y-4">
        {/* Test Mode Selection */}
        <div className="flex space-x-2">
          <button
            onClick={() => setTestMode('read')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              testMode === 'read'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            📖 Read Contract
          </button>
          <button
            onClick={() => setTestMode('register')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              testMode === 'register'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ✍️ Register Asset
          </button>
        </div>

        {/* Asset ID Input */}
        <div>
          <label htmlFor="assetId" className="block text-sm font-medium text-gray-700 mb-2">
            Asset ID (32 bytes hex)
          </label>
          <div className="flex space-x-2">
            <input
              id="assetId"
              type="text"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              placeholder="0x1234..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setAssetId(testAssetId)}
              className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
            >
              Test ID
            </button>
          </div>
        </div>

        {/* Test Results */}
        {assetId && (
          <div className="space-y-4">
            {/* Asset Existence Check */}
            <AssetExistsChecker assetId={assetId} />
            
            {/* Asset Registration Data */}
            {testMode === 'read' && <AssetRegistrationReader assetId={assetId} />}
            
            {/* Asset Registration */}
            {testMode === 'register' && <AssetRegistrationWriter assetId={assetId} />}
          </div>
        )}
      </div>
    </div>
  );
}

// Component to check if asset exists
function AssetExistsChecker({ assetId }: { assetId: string }) {
  const { exists, isLoading, error } = useAssetExists(assetId);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Asset Existence Check</h4>
      
      {isLoading && (
        <div className="text-sm text-gray-600">Checking...</div>
      )}
      
      {error && (
        <div className="text-sm text-red-600">Error: {error}</div>
      )}
      
      {!isLoading && !error && exists !== null && (
        <div className={`text-sm ${exists ? 'text-green-600' : 'text-orange-600'}`}>
          {exists ? '✅ Asset exists on blockchain' : '❌ Asset does not exist'}
        </div>
      )}
    </div>
  );
}

// Component to read asset registration data
function AssetRegistrationReader({ assetId }: { assetId: string }) {
  const { data, isLoading, error, chainId } = useAssetRegistration(assetId);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Asset Registration Data</h4>
      
      {isLoading && (
        <div className="text-sm text-gray-600">Loading...</div>
      )}
      
      {error && (
        <div className="text-sm text-red-600">Error: {error}</div>
      )}
      
      {!isLoading && !error && data && (
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Owner:</span> {formatAddress(data.owner)}</div>
          <div><span className="font-medium">Timestamp:</span> {data.timestamp.toString()}</div>
          <div><span className="font-medium">License Expires:</span> {data.licenseExpiresAt.toString()}</div>
          <div><span className="font-medium">License Note:</span> {data.licenseNote || 'None'}</div>
          {chainId && (
            <div><span className="font-medium">Network:</span> {chainId === 1 ? 'Ethereum' : chainId === 137 ? 'Polygon' : `Chain ${chainId}`}</div>
          )}
        </div>
      )}
      
      {!isLoading && !error && !data && (
        <div className="text-sm text-gray-600">No registration data found</div>
      )}
    </div>
  );
}

// Component to register a new asset
function AssetRegistrationWriter({ assetId }: { assetId: string }) {
  const { registerAsset, isLoading, error, txHash, isSuccess, isConfirming } = useRegisterAsset();

  const handleRegister = () => {
    registerAsset(assetId);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Register New Asset</h4>
      
      <button
        onClick={handleRegister}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Register Asset'}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">Error: {error}</div>
      )}
      
      {txHash && (
        <div className="mt-2 text-sm text-blue-600">
          Transaction: {formatHash(txHash)}
        </div>
      )}
      
      {isConfirming && (
        <div className="mt-2 text-sm text-yellow-600">Confirming transaction...</div>
      )}
      
      {isSuccess && (
        <div className="mt-2 text-sm text-green-600">✅ Asset registered successfully!</div>
      )}
    </div>
  );
}
