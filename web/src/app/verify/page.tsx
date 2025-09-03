'use client';

import { Suspense } from 'react';
import { VerifyPageContent } from './VerifyPageContent';
import { AssetReader } from '../../components/AssetReader';
import { SmartContractTester } from '../../components/SmartContractTester';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Verify Creative Assets
          </h1>
          <p className="text-lg text-gray-600">
            Verify the authenticity and ownership of creative assets on the blockchain
          </p>
        </div>

        {/* Smart Contract Tester - NEW! */}
        <SmartContractTester />

        {/* Asset Reader for Testing Hooks */}
        <AssetReader />

        {/* Main Verify Content */}
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyPageContent />
        </Suspense>
      </div>
    </div>
  );
}
