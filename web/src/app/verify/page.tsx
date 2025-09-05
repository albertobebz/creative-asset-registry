'use client';

import { Suspense } from 'react';
import { VerifyPageContent } from './VerifyPageContent';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyPageContent />
        </Suspense>
      </div>
    </div>
  );
}
