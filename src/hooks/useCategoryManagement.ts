'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useCategoryManagement() {
  const supabase = createClient();
  const [categories, setCategories] = useState<string[]>(['Not Categorized']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all categories from the database lookup table
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('repository_categories')
        .select('name')
        .order('name', { ascending: true });

      if (dbError) throw dbError;

      if (data) {
        // Map rows to an array of strings, ensuring 'Not Categorized' is always present
        const list = data.map((c) => c.name);
        if (!list.includes('Not Categorized')) {
          list.unshift('Not Categorized');
        }
        setCategories(list);
      }
    } catch (err: any) {
      console.error('Error fetching repo categories:', err);
      setError(err.message || 'Failed to sync categories.');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Create and commit a new category name to the database lookup table
  const addCategory = async (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return { success: false, error: 'Name cannot be empty.' };
    
    try {
      setError(null);
      const { error: dbError } = await supabase
        .from('repository_categories')
        .insert([{ name: trimmedName }]);

      if (dbError) throw dbError;

      // Refresh state from the database on success
      await fetchCategories();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding category:', err);
      const msg = err.code === '23505' ? 'Category already exists.' : err.message;
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Run initial pull on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refreshCategories: fetchCategories,
    addCategory,
  };
}