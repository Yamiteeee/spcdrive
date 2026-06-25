'use client';

import { useState, useMemo } from 'react';
import { FileItem } from '@/types/dashboard';
import { useCategoryManagement } from '@/hooks/useCategoryManagement';
import { createClient } from '@/utils/supabase/client';
import JSZip from 'jszip';

interface UseFileBankProps {
  files: FileItem[];
  searchQuery: string;
  onUpdate: (id: string, updatedFile: any) => void | Promise<void>;
}

export function useFileBank({ files, searchQuery, onUpdate }: UseFileBankProps) {
  const supabase = createClient();

  // Core UI Control States
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);

  // Universal Document Viewer States
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textPreviewContent, setTextPreviewContent] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Row Selection States
  const [selectedFileIds, setSelectedFileIds] = useState<Record<string | number, boolean>>({});

  // Category Operations States
  const { categories, addCategory } = useCategoryManagement();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  
  // Drag and Drop States
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);

  // Filter Pointer State
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('ALL_ASSETS');

  // Reset Row Selections helper when changing folders
  const changeFilterCategory = (category: string) => {
    setActiveFilterCategory(category);
    setSelectedFileIds({});
  };

  // Category Generation Workflow Handler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    const res = await addCategory(newCategoryName);
    if (res.success) {
      setNewCategoryName('');
      setIsCreatingCategory(false);
    }
  };

  // Drag and Drop Event Action Routines
  const handleDragStart = (e: React.DragEvent, file: FileItem) => {
    e.dataTransfer.setData('text/plain', file.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFolderDrop = async (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    setDragOverCategory(null);
    const fileIdStr = e.dataTransfer.getData('text/plain');
    if (!fileIdStr) return;

    const targetFile = files.find((f: FileItem) => String(f.id) === fileIdStr);
    
    if (targetFile && targetFile.category !== targetCategory) {
      onUpdate(String(targetFile.id), { ...targetFile, category: targetCategory });
    }
  };

  // Dynamic Dataset Slicing Layer
 const filteredFiles = useMemo(() => {
    let result = files || [];
    
    // 🌟 FIX: Standardize checking against common formatting deviations for 'All Assets'
    const normalizedFilter = activeFilterCategory.trim().toUpperCase().replace('_', ' ');
    
    if (normalizedFilter !== 'ALL ASSETS') {
      result = result.filter((file: FileItem) => {
        const fileCat = file.category || 'Not Categorized';

        if (normalizedFilter === 'NOT CATEGORIZED') {
          return fileCat.toLowerCase() === 'not categorized' || fileCat.trim() === '';
        }

        return fileCat.toLowerCase() === activeFilterCategory.toLowerCase();
      });
    }

    if (searchQuery) {
      result = result.filter((file: FileItem) => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [files, activeFilterCategory, searchQuery]);

  // Isolate active targeting cluster items checking array indices
  const targetsForBulkDownload = useMemo(() => {
    const explicitlyChecked = filteredFiles.filter((f: FileItem) => selectedFileIds[f.id]);
    return explicitlyChecked.length > 0 ? explicitlyChecked : filteredFiles;
  }, [filteredFiles, selectedFileIds]);

  const allVisibleAreChecked = useMemo(() => {
    if (filteredFiles.length === 0) return false;
    return filteredFiles.every((f: FileItem) => selectedFileIds[f.id]);
  }, [filteredFiles, selectedFileIds]);

  // Selection Toggle Framework Actions
  const toggleSelectAll = () => {
    if (allVisibleAreChecked) {
      const nextSelection = { ...selectedFileIds };
      filteredFiles.forEach((f: FileItem) => { delete nextSelection[f.id]; });
      setSelectedFileIds(nextSelection);
    } else {
      const nextSelection = { ...selectedFileIds };
      filteredFiles.forEach((f: FileItem) => { nextSelection[f.id] = true; });
      setSelectedFileIds(nextSelection);
    }
  };

  const toggleSelectRow = (id: string | number) => {
    setSelectedFileIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Clean helper utility to extract clean relative path names for storage buckets
  const getRelativePath = (url: string) => {
    return url.includes('/assets/') ? url.split('/assets/')[1] : url;
  };

  // Safe Secure URL retrieval for isolated document streaming
  const handleOpenViewer = async (file: FileItem) => {
    if (!file.url) return;
    try {
      setIsPreviewLoading(true);
      setPreviewFile(file);
      setTextPreviewContent(null);

      const relativePath = getRelativePath(file.url);
      const { data } = await supabase.storage
        .from('assets')
        .createSignedUrl(relativePath, 300); // 5 min link window

      if (data?.signedUrl) {
        setPreviewUrl(data.signedUrl);

        // Optional pre-fetch pipeline for pure text rendering
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        const textExtensions = ['txt', 'json', 'md', 'csv', 'xml', 'js', 'ts', 'tsx', 'css', 'html'];
        if (textExtensions.includes(extension)) {
          const res = await fetch(data.signedUrl);
          if (res.ok) {
            const txt = await res.text();
            setTextPreviewContent(txt);
          }
        }
      } else {
        alert("Could not generate secure document preview stream.");
      }
    } catch (err) {
      // Console logging deleted
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleCloseViewer = () => {
    setPreviewFile(null);
    setPreviewUrl(null);
    setTextPreviewContent(null);
  };

  // Bulk ZIP Compilation Loop
  const handleBulkDownload = async () => {
    if (targetsForBulkDownload.length === 0) return;
    
    try {
      setIsBulkDownloading(true);
      const zip = new JSZip();

      for (const file of targetsForBulkDownload) {
        if (!file.url) continue;

        const relativePath = getRelativePath(file.url);
        const { data } = await supabase.storage
          .from('assets')
          .createSignedUrl(relativePath, 60);

        if (data?.signedUrl) {
          const response = await fetch(data.signedUrl);
          if (response.ok) {
            const blob = await response.blob();
            zip.file(file.name, blob);
          }
        }
      }

      const zipContent = await zip.generateAsync({ type: 'blob' });
      const zipUrl = window.URL.createObjectURL(zipContent);

      const timestamp = new Date().toISOString().split('T')[0];
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = zipUrl;
      downloadAnchor.download = `SPC_Archive_${activeFilterCategory}_${timestamp}.zip`;
      
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      
      document.body.removeChild(downloadAnchor);
      window.URL.revokeObjectURL(zipUrl);
      setSelectedFileIds({});

    } catch (err) {
      // Console logging deleted
      alert("Failed to build bulk bundle file archive.");
    } finally {
      setIsBulkDownloading(false);
    }
  };

  // Formatted state computations for direct access mapping
  const fileExtension = previewFile?.name.split('.').pop()?.toLowerCase() || '';
  const isOfficeDoc = ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'].includes(fileExtension);

  return {
    editingFile,
    setEditingFile,
    isBulkDownloading,
    previewFile,
    previewUrl,
    textPreviewContent,
    isPreviewLoading,
    selectedFileIds,
    categories,
    newCategoryName,
    setNewCategoryName,
    isCreatingCategory,
    setIsCreatingCategory,
    dragOverCategory,
    setDragOverCategory,
    activeFilterCategory,
    changeFilterCategory,
    filteredFiles,
    targetsForBulkDownload,
    allVisibleAreChecked,
    handleCreateCategory,
    handleDragStart,
    handleFolderDrop,
    toggleSelectAll,
    toggleSelectRow,
    handleOpenViewer,
    handleCloseViewer,
    handleBulkDownload,
    fileExtension,
    isOfficeDoc,
  };
}