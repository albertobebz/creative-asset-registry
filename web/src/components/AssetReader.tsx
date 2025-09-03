'use client';

import { useState } from 'react';
import { useAssetRegistration, useAssetExists } from '../hooks/useAssetRegistry';
import { formatAddress } from '../lib/web3';

export function AssetReader() {
  const [assetId, setAssetId] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  // Test hooks
  const { data: registration, isLoading: regLoading, error: regError } = useAssetRegistration(assetId || null);
  const { exists, isLoading: existsLoading, error: existsError } = useAssetExists(assetId || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setAssetId(inputValue.trim());
    }
  };

  const testWithSampleAsset = () => {
    // Use a sample asset ID for testing
    const sampleAssetId = '0x1234567890123456789012345678901234567890123456789012345678901234';
    setAssetId(sampleAssetId);
    setInputValue(sampleAssetId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Test Asset Reading
      </h3>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Asset ID (0x...)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Read Asset
          </button>
          <button
            type="button"
            onClick={testWithSampleAsset}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Test Sample
          </button>
        </div>
      </form>

      {/* Results */}
      {assetId && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Asset ID</h4>
            <p className="text-sm text-gray-600 font-mono break-all">
              {assetId}
            </p>
          </div>

          {/* Asset Exists Check */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Asset Exists</h4>
            {existsLoading ? (
              <p className="text-sm text-gray-500">Checking...</p>
            ) : existsError ? (
              <p className="text-sm text-red-600">Error: {existsError}</p>
            ) : exists !== null ? (
              <p className={`text-sm ${exists ? 'text-green-600' : 'text-red-600'}`}>
                {exists ? '✅ Asset exists on blockchain' : '❌ Asset not found'}
              </p>
            ) : (
              <p className="text-sm text-gray-500">No data</p>
            )}
          </div>

          {/* Registration Data */}
          {exists && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Registration Data</h4>
              {regLoading ? (
                <p className="text-sm text-gray-500">Loading registration...</p>
              ) : regError ? (
                <p className="text-sm text-red-600">Error: {regError}</p>
              ) : registration ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Owner:</span>{' '}
                    <span className="font-mono">{formatAddress(registration.owner)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Timestamp:</span>{' '}
                    <span>{new Date(Number(registration.timestamp) * 1000).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium">License Expires:</span>{' '}
                    <span>
                      {Number(registration.licenseExpiresAt) === 0 
                        ? 'No expiration' 
                        : new Date(Number(registration.licenseExpiresAt) * 1000).toLocaleString()
                      }
                    </span>
                  </div>
                  {registration.licenseNote && (
                    <div>
                      <span className="font-medium">License Note:</span>{' '}
                      <span>{registration.licenseNote}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No registration data</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">How to Test</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Enter an Asset ID (0x... format) to read blockchain data</li>
          <li>• Click &quot;Test Sample&quot; to try with a sample asset ID</li>
          <li>• The component will show if the asset exists and its registration data</li>
          <li>• This tests our smart contract reading hooks</li>
        </ul>
      </div>
    </div>
  );
}
