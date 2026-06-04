import { useEffect, useState } from 'react';
import { FileItem } from '@/types/dashboard';

interface UseDocViewerProps {
  previewFile: FileItem | null;
  previewUrl: string | null;
  isOfficeDoc: boolean;
}

export function useDocViewer({ previewFile, previewUrl, isOfficeDoc }: UseDocViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Handle client-side mounting guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset iframe loader state whenever a new target document is opened
  useEffect(() => {
    if (previewFile) {
      setIframeLoading(true);
    }
  }, [previewFile]);

  // Lock body viewport scrolling to isolate interaction states
  useEffect(() => {
    if (previewFile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [previewFile]);

  // Compute the parsed public-facing Google Web Docs preview proxy target
  const officePreviewUrl = isOfficeDoc && previewUrl
    ? `https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`
    : null;

  return {
    mounted,
    iframeLoading,
    officePreviewUrl,
    setIframeLoading,
  };
}