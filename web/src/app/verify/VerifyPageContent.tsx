'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function VerifyPageContent() {
  const searchParams = useSearchParams();
  const hashFromUrl = searchParams.get('hash');
  
  const [verificationMode, setVerificationMode] = useState<'hash' | 'upload'>('hash');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hashFromUrl) {
      setVerificationMode('hash');
    }
  }, [hashFromUrl]);

  const handleHashSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const hash = formData.get('hash') as string;
    
    if (hash) {
      setIsVerifying(true);
      setError(null);
      
      // Simulate API call
      setTimeout(() => {
        setVerificationResult({
          assetId: hash,
          status: 'verified',
          message: 'Asset found on blockchain'
        });
        setIsVerifying(false);
      }, 1500);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsVerifying(true);
      setError(null);
      
      // Simulate file processing
      setTimeout(() => {
        setVerificationResult({
          filename: file.name,
          status: 'verified',
          message: 'File verified on blockchain'
        });
        setIsVerifying(false);
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify Creative Assets</h1>
        <p className="text-lg text-gray-600">Verify the authenticity and ownership of registered creative assets on the blockchain</p>
      </div>

      {/* Verification Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Verify by Hash */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify by Hash</h2>
            <p className="text-gray-600">Enter an asset hash to verify its registration</p>
          </div>
          
          <form onSubmit={handleHashSubmit} className="space-y-4">
            <div>
              <label htmlFor="hash" className="block text-sm font-medium text-gray-700 mb-2">
                Asset Hash
              </label>
              <input
                type="text"
                id="hash"
                name="hash"
                defaultValue={hashFromUrl || ''}
                placeholder="0x1234567890abcdef..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                'Verify Asset'
              )}
            </button>
          </form>
        </div>

        {/* Verify by File Upload */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify by File</h2>
            <p className="text-gray-600">Upload a file to verify its registration</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Choose File
              </label>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                accept=".png,.jpg,.jpeg,.pdf,.json,.txt,.doc,.docx"
                disabled={isVerifying}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              type="button"
              disabled={isVerifying}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Verify File'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Verification Failed</h3>
              <p className="mt-1 text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Verification Results */}
      {verificationResult && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful</h2>
            <p className="text-lg text-gray-600 mb-6">{verificationResult.message}</p>
            
            <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="text-left space-y-3">
                {verificationResult.assetId && (
                  <div>
                    <span className="font-semibold text-gray-700">Asset ID:</span>
                    <p className="font-mono text-sm text-gray-600 break-all mt-1">{verificationResult.assetId}</p>
                  </div>
                )}
                {verificationResult.filename && (
                  <div>
                    <span className="font-semibold text-gray-700">Filename:</span>
                    <p className="text-gray-600 mt-1">{verificationResult.filename}</p>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
