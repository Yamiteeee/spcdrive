'use client';

import { useState } from 'react';
import { useDownloadHistory } from './useDownloadHistory';
import { createClient } from '@/utils/supabase/client';

export function useDownloadFile() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { recordDownloadEvent } = useDownloadHistory();
  const supabase = createClient();

  const downloadAsset = async (file: { name: string; url: string }) => {
    if (!file?.url) {
      alert("Error: This record does not contain an active storage path.");
      return;
    }

    try {
      setIsDownloading(true);

      // 1. Extract the relative storage path from the public URL
      let relativePath = file.url;
      if (file.url.includes('/assets/')) {
        relativePath = file.url.split('/assets/')[1];
      }

      console.log("Requesting secure download stream token for path:", relativePath);

      // 2. Request the temporary secure download link from Supabase
      const { data, error } = await supabase.storage
        .from('assets')
        .createSignedUrl(relativePath, 60, {
          download: true, // Forces file saving instead of previewing
        });

      if (error || !data?.signedUrl) {
        throw new Error(error?.message || "Could not generate authentication download token.");
      }

      // 3. Programmatically execute the file save dialog box
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = data.signedUrl;
      downloadAnchor.download = file.name;
      
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      // 4. Fire and forget the background event tracking call
      // The state lock in useDownloadHistory will prevent multi-write cloning!
      await recordDownloadEvent(file.name);

    } catch (err: any) {
      console.error("Download pipeline execution aborted:", err);
      alert(`Download Failed: ${err.message || 'System could not verify cloud asset routing.'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadAsset,
    isDownloading
  };
}