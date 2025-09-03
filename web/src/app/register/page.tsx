'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterAsset } from '../../hooks/useAssetRegistry';
import { NetworkManager } from '../../components/NetworkManager';
import { formatHash } from '../../lib/web3';

export default function RegisterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [assetId, setAssetId] = useState<string>('');
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const router = useRouter();
  const { registerAsset, isLoading, error: contractError, txHash, isSuccess } = useRegisterAsset();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileValidation(file);
    }
  };

  const handleFileValidation = (file: File) => {
    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    // Validate MIME type
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'application/pdf',
      'application/json',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('File type not supported. Please use PNG, JPEG, PDF, JSON, or TXT files.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setAssetId('');
    setSha256Hash('');
  };

  // Drag and drop handlers
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileValidation(file);
    }
  };

  // Compute SHA256 hash of file
  const computeFileHash = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          resolve(hashHex);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Simple canonicalization for text-based files
  const canonicalizeFile = async (file: File): Promise<ArrayBuffer> => {
    if (file.type === 'text/plain' || file.type === 'application/json') {
      const text = await file.text();
      // For text files: normalize line endings to LF, ensure UTF-8
      const canonicalText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const uint8Array = new TextEncoder().encode(canonicalText);
      return uint8Array.buffer as ArrayBuffer;
    }
    // For other files, return as-is (in real implementation, you'd process images/PDFs)
    return await file.arrayBuffer();
  };

  // Compute keccak256 hash (simplified - in real implementation use proper library)
  const computeKeccak256 = async (data: ArrayBuffer): Promise<string> => {
    // This is a simplified version - in production you'd use a proper keccak256 library
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // Simulate keccak256 by adding a prefix (this is just for demo)
    return '0x' + hashHex.slice(0, 64);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      console.log('Starting file processing...');
      
      // Step 1: Compute SHA256 hash
      setUploadProgress(20);
      console.log('Computing SHA256 hash...');
      const sha256 = await computeFileHash(selectedFile);
      setSha256Hash(sha256);
      console.log('SHA256 computed:', sha256);
      setUploadProgress(40);

      // Step 2: Canonicalize file
      setUploadProgress(60);
      console.log('Canonicalizing file...');
      const canonicalData = await canonicalizeFile(selectedFile);
      setUploadProgress(80);

      // Step 3: Compute asset ID (keccak256)
      setUploadProgress(90);
      console.log('Computing asset ID...');
      const keccak256Hash = await computeKeccak256(canonicalData);
      setAssetId(keccak256Hash);
      console.log('Asset ID computed:', keccak256Hash);
      setUploadProgress(100);

      // Step 4: Register on blockchain
      console.log('Calling registerAsset with:', keccak256Hash);
      await registerAsset(keccak256Hash);
      console.log('registerAsset called successfully');
      
    } catch (err) {
      console.error('Error during upload:', err);
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setIsUploading(false);
    }
  };

  // Handle successful registration
  if (isSuccess && txHash) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Asset Registered Successfully!
            </h1>
            <div className="space-y-4 mb-8 text-left bg-gray-50 p-4 rounded-lg">
              <div><span className="font-medium">Asset ID:</span> {formatHash(assetId)}</div>
              <div><span className="font-medium">SHA256:</span> {formatHash(sha256Hash)}</div>
              <div><span className="font-medium">Transaction:</span> {formatHash(txHash)}</div>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
              >
                View in Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700"
              >
                Register Another Asset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Register Creative Asset
            </h1>
            <p className="text-gray-600">
              Upload your creative file to register it on the blockchain
            </p>
          </div>

          {/* Network Setup Helper */}
          <NetworkManager />

          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragOver 
                  ? 'border-indigo-400 bg-indigo-50' 
                  : 'border-gray-300 hover:border-indigo-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                {isDragOver ? (
                  <svg className="mx-auto h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-lg font-medium text-indigo-600 hover:text-indigo-500">
                      {isDragOver ? 'Drop file here' : 'Choose a file'}
                    </span>
                    <span className="text-gray-500">
                      {isDragOver ? '' : ' or drag and drop'}
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".png,.jpg,.jpeg,.pdf,.json,.txt"
                    onChange={handleFileSelect}
                  />
                </div>
                
                <p className="text-sm text-gray-500">
                  PNG, JPEG, PDF, JSON, or TXT up to 100MB
                </p>
              </div>
            </div>

            {/* Selected File Display */}
            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {uploadProgress < 100 ? 'Processing file...' : 'Registering on blockchain...'}
                </p>
              </div>
            )}

            {/* Error Display */}
            {(error || contractError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error || contractError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            {selectedFile && !isUploading && (
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registering on Blockchain...' : 'Register Asset on Blockchain'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
