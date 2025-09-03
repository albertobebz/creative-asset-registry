'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Mock verification data for testing
const mockVerificationData = {
  assetId: '0x1234567890123456789012345678901234567890123456789012345678901234',
  filename: 'sample-image.png',
  mime: 'image/png',
  size: 1024000,
  sha256Raw: 'a1b2c3d4e5f6...',
  owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  timestamp: 1703123456,
  txHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
  licenseExpiresAt: 1735680000,
  licenseNote: 'Creative Commons Attribution 4.0',
  blockNumber: 12345678,
  networkName: 'Polygon'
};

export function VerifyPageContent() {
  const searchParams = useSearchParams();
  const hashFromUrl = searchParams.get('hash');
  
  const [verificationMode, setVerificationMode] = useState<'hash' | 'upload'>('hash');
  const [verificationResult, setVerificationResult] = useState<typeof mockVerificationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hashFromUrl) {
      // Simulate verification with hash from URL
      setVerificationResult(mockVerificationData);
      setVerificationMode('hash');
    }
  }, [hashFromUrl]);

  const handleHashSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const hash = formData.get('hash') as string;
    
    if (hash) {
      // Simulate verification
      setVerificationResult(mockVerificationData);
      setError(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file processing and verification
      setVerificationResult(mockVerificationData);
      setError(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Verification Mode Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setVerificationMode('hash')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                verificationMode === 'hash'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Verify by Hash
            </button>
            <button
              onClick={() => setVerificationMode('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                verificationMode === 'upload'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Verify by File Upload
            </button>
          </nav>
        </div>

        <div className="p-6">
          {verificationMode === 'hash' ? (
            <form onSubmit={handleHashSubmit} className="space-y-4">
              <div>
                <label htmlFor="hash" className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Hash (0x...)
                </label>
                <input
                  type="text"
                  id="hash"
                  name="hash"
                  defaultValue={hashFromUrl || ''}
                  placeholder="0x1234567890..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Verify Asset
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  accept=".png,.jpg,.jpeg,.pdf,.json,.txt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-sm text-gray-500">
                Upload the file you want to verify. The system will compute its hash and check the blockchain.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Verification Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Results */}
      {verificationResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Asset Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Filename:</span> {verificationResult.filename}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {verificationResult.mime}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {(verificationResult.size / 1024 / 1024).toFixed(2)} MB
                </div>
                <div>
                  <span className="font-medium">SHA256:</span> {verificationResult.sha256Raw}
                </div>
              </div>
            </div>

            {/* Registration Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Registration Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Owner:</span> {verificationResult.owner}
                </div>
                <div>
                  <span className="font-medium">Registered:</span> {new Date(verificationResult.timestamp * 1000).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">License Expires:</span> {new Date(verificationResult.licenseExpiresAt * 1000).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">License Note:</span> {verificationResult.licenseNote}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Transaction Hash:</span>
                <p className="font-mono text-gray-600 break-all">{verificationResult.txHash}</p>
              </div>
              <div>
                <span className="font-medium">Block Number:</span>
                <p className="text-gray-600">{verificationResult.blockNumber.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium">Network:</span>
                <p className="text-gray-600">{verificationResult.networkName}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
