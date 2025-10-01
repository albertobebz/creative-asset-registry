'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useUserAssets } from '../../hooks/useAssetRegistry';
import BlockchainCertificate, { AssetJSONDownload } from '../../components/BlockchainCertificate';
import toast from 'react-hot-toast';

// Assets are now loaded dynamically from localStorage and blockchain

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const { chainId } = useAccount();
  const { assets, isLoading } = useUserAssets();

  // Sort assets based on selected sort order
  const sortedAssets = [...assets].sort((a, b) => {
    const timestampA = Number(a.registration.timestamp) || 0;
    const timestampB = Number(b.registration.timestamp) || 0;
    
    if (sortOrder === 'recent') {
      return timestampB - timestampA; // Most recent first
    } else {
      return timestampA - timestampB; // Oldest first
    }
  });


  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);


  // Assets are now loaded automatically by the useUserAssets hook

  // Get network name based on chainId - only Sepolia supported for POC
  const getNetworkName = () => {
    if (!mounted) return 'Loading...';
    switch (chainId) {
      case 11155111:
        return 'Sepolia';
      default:
        return 'Not Connected';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  const getExplorerUrl = (txHash: string) => {
    // TODO: Use real blockchain explorer URL
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  };

  const formatDate = (dateString: string) => {
    // Use consistent date formatting to avoid hydration mismatch
    if (!mounted) return 'Loading...';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTimestamp = (timestamp: string | number | bigint) => {
    if (!mounted) return 'Loading...';
    
    const numTimestamp = Number(timestamp);
    
    // The timestamps from localStorage are already in milliseconds (Date.now())
    // So we don't need to multiply by 1000
    const date = new Date(numTimestamp);
    
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Assets
              </h1>
              <p className="text-xl text-gray-600">
                Manage your registered creative assets
              </p>
            </div>
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Register New Asset
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">{sortedAssets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Licensed Assets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedAssets.filter(asset => asset.registration.licenseExpiresAt && Number(asset.registration.licenseExpiresAt) > 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Network</p>
                <p className="text-2xl font-bold text-gray-900">{getNetworkName()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Registered Assets</h2>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort-order" className="text-sm font-medium text-gray-700 hidden sm:block">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'recent' | 'oldest')}
                    className="block w-40 px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none bg-white"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your assets...</p>
            </div>
          ) : sortedAssets.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assets yet</h3>
              <p className="text-gray-600 mb-6">Start by registering your first creative asset</p>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Register Asset
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAssets.map((asset) => (
                    <tr key={asset.assetId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{asset.filename}</div>
                            <div className="text-sm text-gray-500">
                              <a 
                                href={getExplorerUrl(asset.txHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                View Transaction
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900 font-mono">
                            {asset.assetId}
                          </span>
                          <button
                            onClick={() => copyToClipboard(asset.assetId)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy Asset ID"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 4h8a2 2 0 012 2v2a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(asset.registration.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {asset.registration.licenseExpiresAt && Number(asset.registration.licenseExpiresAt) > 0 ? (
                          <div className="text-sm">
                            <div className="text-green-600 font-medium">Licensed</div>
                            <div className="text-gray-500">{formatTimestamp(asset.registration.licenseExpiresAt)}</div>
                            {asset.registration.licenseNote && (
                              <div className="text-xs text-gray-400 mt-1">{asset.registration.licenseNote}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No License</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <BlockchainCertificate 
                          asset={asset} 
                          onDownload={() => toast.success(`Blockchain certificate downloaded for ${asset.filename}`)} 
                        />
                        <AssetJSONDownload 
                          asset={asset} 
                          onDownload={() => toast.success(`Asset metadata downloaded for ${asset.filename}`)} 
                        />
                        <Link
                          href={`/verify?hash=${asset.assetId}`}
                          className="text-green-600 hover:text-green-900 cursor-pointer inline-flex items-center px-2 py-1 rounded-md hover:bg-green-50 transition-all duration-200 hover:scale-105"
                        >
                          Verify
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
