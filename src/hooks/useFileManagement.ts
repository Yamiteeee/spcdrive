'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileItem } from '@/types/dashboard';
import { createClient } from '@/utils/supabase/client';

export function useFileManagement() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true); // Start as true so the loading spinner catches the initial mount fetch
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Helper utility to format file size as a string matching your original UI specification
  const formatFileSize = (bytes: number): string => {
    if (bytes > 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // 1. INITIAL FETCH LOGIC: Automatically loads items from your Supabase table on load/refresh
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('files')
        .select('*')
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Translate database rows back into front-end FileItem contracts
      const clientFormattedFiles: FileItem[] = (data || []).map((dbFile: any) => ({
        id: dbFile.id,
        name: dbFile.name,
        size: dbFile.size,
        type: dbFile.type,
        category: dbFile.category_name || 'Not Categorized', // 🌟 Added data field parse translation mapping
        url: dbFile.storage_path,
        updatedAt: dbFile.updated_at
      }));

      setFiles(clientFormattedFiles);
    } catch (err: any) {
      console.error('Failed to load file index from database:', err);
      setError(err.message || 'Failed to retrieve persistent cloud directory files.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Execute the database pull automatically whenever this hook boots up
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // 2. UPLOAD FILE: Uploads to Supabase Storage, registers row to database, appends to state
  // 🌟 SIGNATURE UPGRADED: Accepts incoming category metadata context assignment strings
  const uploadFile = async (browserFile: File, category: string = 'Not Categorized') => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user session found.');

      const fileExt = browserFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // A. Stream raw asset bytes into your Storage Bucket
      const { error: storageError } = await supabase.storage
        .from('assets')
        .upload(filePath, browserFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) throw storageError;

      // B. Grab your public downloadable link url
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      // C. Structure payload matching your strict PostgreSQL layout
      const newFileRow = {
        name: browserFile.name,
        size: formatFileSize(browserFile.size), 
        type: browserFile.name.split('.').pop()?.toUpperCase() || 'BIN',
        category_name: category, // 🌟 Assign targeted folder node location pointer 
        storage_path: publicUrl,
        uploaded_by: user.id
      };

      const { data: insertedData, error: dbError } = await supabase
        .from('files')
        .insert([newFileRow])
        .select()
        .single();

      if (dbError) throw dbError;

      // D. Adapt database row structure back into a valid client FileItem object contract
      const clientFormattedFile: FileItem = {
        id: insertedData.id,
        name: insertedData.name,
        size: insertedData.size, 
        type: insertedData.type,
        category: insertedData.category_name || 'Not Categorized', // 🌟 Attached validation parse logic
        url: insertedData.storage_path,
        updatedAt: insertedData.updated_at
      };

      setFiles(prev => [clientFormattedFile, ...prev]);
    } catch (err: any) {
      console.error('File registration failed:', err);
      setError(err.message || 'Failed to complete file upload lifecycle.');
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE FILE: Erases metadata row from PostgreSQL
  const deleteFile = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (err: any) {
      console.error('File deletion failed:', err);
      setError(err.message || 'Failed to execute database removal command.');
    } finally {
      setLoading(false);
    }
  };

  // 4. UPDATE FILE: Updates metadata attributes (e.g., renaming a file)
  const updateFile = async (id: string, updates: Partial<FileItem>) => {
    try {
      setLoading(true);
      setError(null);

      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.type) dbUpdates.type = updates.type;
      if (updates.size) dbUpdates.size = updates.size;
      if (updates.url) dbUpdates.storage_path = updates.url;
      if (updates.category) dbUpdates.category_name = updates.category; // 🌟 Enable on-the-fly categorization modifications

      const { data: updatedData, error: dbError } = await supabase
        .from('files')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (dbError) throw dbError;

      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        name: updatedData.name,
        size: updatedData.size,
        type: updatedData.type,
        category: updatedData.category_name || 'Not Categorized', // 🌟 Synchronize state modifications locally
        url: updatedData.storage_path,
        updatedAt: updatedData.updated_at
      } : f));

    } catch (err: any) {
      console.error('File update transaction aborted:', err);
      setError(err.message || 'Failed to execute modification updates on data record.');
    } finally {
      setLoading(false);
    }
  };

  return { 
    files, 
    setFiles, 
    loading, 
    error, 
    uploadFile, 
    deleteFile, 
    updateFile,
    refreshFiles: fetchFiles // Expose refresh callback trigger capability up to UI views
  };
}