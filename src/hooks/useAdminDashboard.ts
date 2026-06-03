'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileItem } from '@/types/dashboard';
import { createClient } from '@/utils/supabase/client';

type DashboardView = 'files' | 'users' | 'history';

export function useAdminDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>('files');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // 1. Fetch live file entries matching your exact DB columns and frontend types
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('files')
        .select('*')
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Map database fields to perfectly match your frontend FileItem specifications
      const mappedFiles: FileItem[] = (data || []).map((dbFile: any) => ({
        id: dbFile.id,
        name: dbFile.name,
        size: String(dbFile.size), 
        type: dbFile.type,
        category: dbFile.category_name || 'Not Categorized', // 🌟 Added data field parsing mapping
        url: dbFile.storage_path,   // This matches your newly added 'url' property!
        updatedAt: dbFile.updated_at 
      }));

      setFiles(mappedFiles);
    } catch (err: any) {
      console.error('Error loading files:', err);
      setError(err.message || 'Failed to retrieve files from server.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (activeView === 'files') {
      fetchFiles();
    }
  }, [activeView, fetchFiles]);

  // 2. Handle file uploads mapping fields directly to your DB Schema
  // 🌟 SIGNATURE UPGRADED: Accepts target category context parameters from page handlers
  const handleUploadComplete = async (fileToUpload: File, category: string = 'Not Categorized') => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated session found.');

      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // A. Upload physical asset raw bytes to Supabase storage bucket
      const { error: storageError } = await supabase.storage
        .from('assets')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) throw storageError;

      // B. Retrieve public path link asset
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      // C. Map to your exact database schema columns
      const newFileRow = {
        name: fileToUpload.name,
        size: String(fileToUpload.size), 
        type: fileToUpload.type || fileExt || 'unknown',
        category_name: category, // 🌟 Assign dynamically selected category value
        storage_path: publicUrl,
        uploaded_by: user.id
      };

      const { data: insertedData, error: dbError } = await supabase
        .from('files')
        .insert([newFileRow])
        .select()
        .single();

      if (dbError) throw dbError;

      // D. Map back to client view specification accurately
      const clientFormattedFile: FileItem = {
        id: insertedData.id,
        name: insertedData.name,
        size: String(insertedData.size), 
        type: insertedData.type,
        category: insertedData.category_name || 'Not Categorized', // 🌟 Attached validation parsing logic
        url: insertedData.storage_path, // This matches your newly added 'url' property!
        updatedAt: insertedData.updated_at 
      };

      setFiles((prev) => [clientFormattedFile, ...prev]);
      setIsUploadOpen(false);

    } catch (err: any) {
      console.error('Upload lifecycle error details:', err);
      setError(err.message || 'Critical file upload failure.');
    } finally {
      setLoading(false);
    }
  };

  const setView = (view: DashboardView) => setActiveView(view);
  const toggleUpload = (state: boolean) => setIsUploadOpen(state);

  return {
    files,
    activeView,
    isUploadOpen,
    loading,
    error,
    setView,
    toggleUpload,
    handleUploadComplete,
    refreshFiles: fetchFiles
  };
}