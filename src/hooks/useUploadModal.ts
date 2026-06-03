'use client';

import { useState } from 'react';
import { FileItem } from '@/types/dashboard';

export function useUploadModal(onSuccess?: (file: FileItem) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 🌟 BULK STATS TRACKING
  const [bulkQueueSize, setBulkQueueSize] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  const open = () => {
    setIsOpen(true);
    setBulkQueueSize(0);
    setProcessedCount(0);
  };
  
  // Prevent users from dismissing the overlay layer during active transfers
  const close = () => {
    if (!isProcessing) setIsOpen(false);
  };

  /**
   * Handles individual or batch simultaneous file processing cycles.
   * @param rawFiles Array of file payloads extracted from drag-and-drop or file input frames.
   * @param uploadAction The live async single upload function provided by your file context engine.
   */
  const handleBulkUpload = async (
    rawFiles: File[], 
    uploadAction: (file: File) => Promise<FileItem | void>
  ) => {
    if (rawFiles.length === 0) return;

    try {
      setIsProcessing(true);
      setBulkQueueSize(rawFiles.length);
      setProcessedCount(0);

      // Map out all uploads to resolve concurrently using Promise.allSettled
      const uploadPromises = rawFiles.map(async (file) => {
        try {
          const uploadedFile = await uploadAction(file);
          
          // Increment tracking counter for progress indicators
          setProcessedCount((prev) => prev + 1);

          if (uploadedFile && onSuccess) {
            onSuccess(uploadedFile);
          }
          return uploadedFile;
        } catch (singleFileError) {
          console.error(`Failed to dispatch transfer payload for ${file.name}:`, singleFileError);
          throw singleFileError;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      
      // Calculate any rejected operations if you want to notify users later
      const failures = results.filter(r => r.status === 'rejected');
      
      if (failures.length > 0) {
        console.warn(`${failures.length} files out of ${rawFiles.length} failed security/storage processing checks.`);
      }

      // Automatically wrap up overlay session view on complete resolution
      setIsOpen(false);
    } catch (err) {
      console.error('Bulk modal pipeline processing error:', err);
    } finally {
      setIsProcessing(false);
      setBulkQueueSize(0);
      setProcessedCount(0);
    }
  };

  return {
    isOpen,
    isProcessing,
    bulkQueueSize,
    processedCount,
    open,
    close,
    handleBulkUpload,
  };
}