'use client';

import { useState } from 'react';
import { FileItem } from '@/types/dashboard';

export function useUploadModal(onSuccess?: (file: FileItem) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const open = () => setIsOpen(true);
  
  // Guard clause to prevent users from closing the modal while a file is uploading
  const close = () => {
    if (!isProcessing) setIsOpen(false);
  };

  /**
   * Handles the modal upload lifecycle.
   * @param rawFile The physical file object from the HTML input element.
   * @param uploadAction The live async upload function provided by your data hooks.
   */
  const handleUpload = async (
    rawFile: File, 
    uploadAction: (file: File) => Promise<FileItem | void>
  ) => {
    try {
      setIsProcessing(true);

      // Execute the live Supabase storage and database upload function passed from the parent hook
      const uploadedFile = await uploadAction(rawFile);

      // If the action returned a valid database record, pass it up to update the UI tables
      if (uploadedFile && onSuccess) {
        onSuccess(uploadedFile);
      }

      // Automatically close the modal panel upon a successful upload transaction
      setIsOpen(false);
      return uploadedFile;
    } catch (err) {
      console.error('Modal execution lifecycle failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isOpen,
    isProcessing,
    open,
    close,
    handleUpload,
  };
}