'use client';

import { useState, useEffect, useCallback } from 'react';
import { DownloadLog } from '@/types/dashboard';
import { createClient } from '@/utils/supabase/client';

export function useDownloadHistory() {
  const [logs, setLogs] = useState<DownloadLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🛡️ ADD THIS STATE TO ACT AS A TRANSACTION LOCK:
  const [isRecording, setIsRecording] = useState(false);

  const supabase = createClient();

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('download_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(`[${fetchError.code}]: ${fetchError.message}`);
      }

      const formattedLogs: DownloadLog[] = (data || []).map((log: any) => {
        let displayDate = 'PENDING';
        try {
          if (log.created_at) {
            displayDate = new Date(log.created_at).toISOString().split('T')[0];
          }
        } catch (e) {
          console.error("Timestamp parse failure:", e);
        }

        return {
          id: log.id ? Number(log.id) : Math.random(),
          user: String(log.user_name || 'System Agent'),
          file: String(log.file_name || 'Asset Package'),
          ip: String(log.ip_address || '127.0.0.1'),
          timestamp: displayDate,
          status: log.status === 'failed' ? 'failed' : 'verified'
        };
      });

      setLogs(formattedLogs);
    } catch (err: any) {
      console.error('Audit trail ledger sync aborted:', err);
      setError(err.message || 'Failed to synchronize live security logs.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const recordDownloadEvent = async (fileName: string) => {
    try {
      if (!fileName) return;

      // 🛡️ TRIPLE LOG GUARD: If a log record is already processing, reject duplicate calls!
      if (isRecording) {
        console.log("Database write locked. Dropping duplicate log event.");
        return;
      }
      
      // Lock the transaction channel instantly
      setIsRecording(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      const currentUserName = profile?.name || user.email || 'Authorized Operator';

      let clientIp = '127.0.0.1';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        clientIp = ipData.ip;
      } catch { /* Fallback silently */ }

      const { error: insertError } = await supabase
        .from('download_logs')
        .insert([{
          user_name: currentUserName,
          file_name: fileName,
          ip_address: clientIp,
          status: 'verified'
        }]);

      if (insertError) throw insertError;
      
      // Pull fresh data from the DB so the user interface updates instantly
      await fetchLogs();
    } catch (err) {
      console.error('Failed to register file download event transaction:', err);
    } finally {
      // Release the transaction lock once everything finishes saving
      setIsRecording(false);
    }
  };

  return {
    logs,
    loading,
    error,
    refreshLogs: fetchLogs,
    recordDownloadEvent
  };
}