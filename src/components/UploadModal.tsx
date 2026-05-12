'use client';
import { useState, useCallback } from 'react';
import { X, Upload, File, CheckCircle2, Loader2 } from 'lucide-react';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (fileData: any) => void;
}

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const { colors } = useSPCTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const simulateUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onUploadComplete({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      updatedAt: new Date().toISOString().split('T')[0]
    });

    setUploading(false);
    setFile(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden bg-white rounded-4xl shadow-2xl border border-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Upload Protocol</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inject assets into system node</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8">
              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    relative group border-2 border-dashed rounded-3xl p-12
                    flex flex-col items-center justify-center gap-4 transition-all
                    ${isDragging 
                      ? 'border-emerald-500 bg-emerald-50/50 scale-[0.98]' 
                      : 'border-slate-100 bg-slate-50/30 hover:border-emerald-200 hover:bg-emerald-50/20'
                    }
                  `}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 border border-emerald-50">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">Drop files here or click to browse</p>
                    <p className="text-xs text-slate-400 mt-1">Maximum file size: 50MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="bg-slate-50 rounded-3xl p-6 flex items-center gap-4 border border-emerald-100/50">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                    <File className="w-6 h-6" />
                  </div>
                  <div className="grow overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                    <p className="text-[10px] font-black text-emerald-600/40 uppercase tracking-widest">
                      {(file.size / 1024).toFixed(1)} KB • Ready
                    </p>
                  </div>
                  <button onClick={() => setFile(null)} className="text-xs font-bold text-slate-400 hover:text-red-500">
                    Remove
                  </button>
                </div>
              )}

              {/* Action Button */}
              <button
                disabled={!file || uploading}
                onClick={simulateUpload}
                style={{ backgroundColor: file ? colors.primary : '#f1f5f9' }}
                className={`
                  w-full mt-8 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2
                  ${file ? 'text-white shadow-lg shadow-emerald-500/20 active:scale-95' : 'text-slate-400 cursor-not-allowed'}
                `}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Initialize Upload
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}