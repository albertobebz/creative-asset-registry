'use client';

import { jsPDF } from 'jspdf';
import { AssetData } from '../hooks/useAssetRegistry';

interface BlockchainCertificateProps {
  asset: AssetData;
  onDownload: () => void;
}

export function generateAssetJSON(asset: AssetData): void {
  const assetData = {
    certificate: {
      title: "Creative Asset Registry - Asset Metadata",
      version: "1.0",
      generatedAt: new Date().toISOString(),
      generatedBy: "Creative Asset Registry"
    },
    asset: {
      filename: asset.filename,
      mimeType: asset.mime,
      size: asset.size,
      sizeFormatted: `${(asset.size / 1024).toFixed(2)} KB`,
      sha256Hash: asset.assetId,
      registration: {
        owner: asset.registration.owner,
        timestamp: asset.registration.timestamp.toString(),
        timestampFormatted: new Date(Number(asset.registration.timestamp)).toISOString(),
        licenseExpiresAt: asset.registration.licenseExpiresAt.toString(),
        licenseNote: asset.registration.licenseNote
      },
      blockchain: {
        network: "Sepolia Testnet",
        chainId: 11155111,
        transactionHash: asset.txHash,
        transactionUrl: `https://sepolia.etherscan.io/tx/${asset.txHash}`,
        contractAddress: "0x1111111111111111111111111111111111111111" // This would be your actual contract address
      },
      verification: {
        instructions: "This JSON file contains the complete metadata for a creative asset registered on the Ethereum Sepolia blockchain.",
        verificationSteps: [
          "1. Verify the transaction hash on Etherscan",
          "2. Confirm the asset ID matches the SHA256 hash of your file",
          "3. Check the registration timestamp",
          "4. Validate the blockchain network (Sepolia Testnet)"
        ],
        blockchainExplorer: "https://sepolia.etherscan.io",
        apiEndpoints: {
          etherscan: `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${asset.txHash}&apikey=YourApiKey`
        }
      }
    }
  };

  // Create and download the JSON file
  const jsonString = JSON.stringify(assetData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `asset-metadata-${asset.filename.replace(/\.[^/.]+$/, '')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateBlockchainCertificate(asset: AssetData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = '#4F46E5'; // Indigo
  const secondaryColor = '#6B7280'; // Gray
  
  // Header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('BLOCKCHAIN CERTIFICATE', pageWidth / 2, 25, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Proof of Creative Asset Registration', pageWidth / 2, 35, { align: 'center' });
  
  // Certificate content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF REGISTRATION', pageWidth / 2, 60, { align: 'center' });
  
  // Asset details section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const startY = 80;
  const lineHeight = 8;
  let currentY = startY;
  
  // Asset Information
  doc.setFont('helvetica', 'bold');
  doc.text('Asset Information:', 20, currentY);
  currentY += lineHeight;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`File Name: ${asset.filename}`, 20, currentY);
  currentY += lineHeight;
  
  doc.text(`File Type: ${asset.mime}`, 20, currentY);
  currentY += lineHeight;
  
  doc.text(`File Size: ${(asset.size / 1024).toFixed(2)} KB`, 20, currentY);
  currentY += lineHeight * 2;
  
  // Blockchain Information
  doc.setFont('helvetica', 'bold');
  doc.text('Blockchain Information:', 20, currentY);
  currentY += lineHeight;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Network: Sepolia Testnet`, 20, currentY);
  currentY += lineHeight;
  
  doc.text(`Asset ID (SHA256): ${asset.assetId}`, 20, currentY);
  currentY += lineHeight;
  
  doc.text(`Transaction Hash: ${asset.txHash}`, 20, currentY);
  currentY += lineHeight;
  
  // Format registration date
  const registrationDate = new Date(Number(asset.registration.timestamp));
  doc.text(`Registration Date: ${registrationDate.toLocaleDateString()} ${registrationDate.toLocaleTimeString()}`, 20, currentY);
  currentY += lineHeight * 2;
  
  // Verification section
  doc.setFont('helvetica', 'bold');
  doc.text('Verification:', 20, currentY);
  currentY += lineHeight;
  
  doc.setFont('helvetica', 'normal');
  doc.text('This certificate proves that the above file has been registered on the', 20, currentY);
  currentY += lineHeight;
  doc.text('Ethereum Sepolia blockchain with the unique hash shown above.', 20, currentY);
  currentY += lineHeight;
  doc.text('The registration is immutable and can be verified on the blockchain.', 20, currentY);
  currentY += lineHeight * 2;
  
  // Verification URLs
  doc.setFont('helvetica', 'bold');
  doc.text('Verify on Blockchain:', 20, currentY);
  currentY += lineHeight;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryColor);
  doc.text(`Transaction: https://sepolia.etherscan.io/tx/${asset.txHash}`, 20, currentY);
  currentY += lineHeight;
  
  // QR Code placeholder (we'll add a simple text representation)
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('QR Code for Verification:', 20, currentY);
  currentY += lineHeight;
  
  // Simple QR representation (in a real app, you'd use a QR library)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  const qrSize = 30;
  const qrX = pageWidth - 50;
  const qrY = currentY - 5;
  
  // Draw a simple border for QR code
  doc.rect(qrX, qrY, qrSize, qrSize);
  doc.setFontSize(8);
  doc.text('QR', qrX + qrSize/2 - 2, qrY + qrSize/2 + 1);
  
  // Footer
  const footerY = pageHeight - 30;
  doc.setDrawColor(secondaryColor);
  doc.line(20, footerY, pageWidth - 20, footerY);
  
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor);
  doc.text('Generated by Creative Asset Registry', pageWidth / 2, footerY + 10, { align: 'center' });
  doc.text(`Certificate ID: ${asset.assetId.slice(0, 16)}...`, pageWidth / 2, footerY + 20, { align: 'center' });
  
  // Download the PDF
  const fileName = `blockchain-certificate-${asset.filename.replace(/\.[^/.]+$/, '')}.pdf`;
  doc.save(fileName);
}

export function AssetJSONDownload({ asset, onDownload }: BlockchainCertificateProps) {
  const handleDownload = () => {
    generateAssetJSON(asset);
    onDownload();
  };

  return (
    <button
      onClick={handleDownload}
      className="text-gray-900 hover:text-gray-700 cursor-pointer inline-flex items-center px-2 py-1 rounded-md hover:bg-gray-100 transition-all duration-200 hover:scale-105"
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      JSON
    </button>
  );
}

export default function BlockchainCertificate({ asset, onDownload }: BlockchainCertificateProps) {
  const handleDownload = () => {
    generateBlockchainCertificate(asset);
    onDownload();
  };

  return (
    <button
      onClick={handleDownload}
      className="text-gray-900 hover:text-gray-700 cursor-pointer inline-flex items-center px-2 py-1 rounded-md hover:bg-gray-100 transition-all duration-200 hover:scale-105"
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      PDF
    </button>
  );
}
