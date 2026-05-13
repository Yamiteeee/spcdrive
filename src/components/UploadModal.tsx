'use client';
import { useState } from 'react';
import { File as FileIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { Modal } from '@/components/ui/Modal';
import { Dropzone } from '@/components/ui/Dropzone';

interface UploadModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<any>;
}

export function UploadModal({ isOpen, isProcessing, onClose, onUpload }: UploadModalProps) {
  const { colors } = useSPCTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAction = async () => {
    if (!selectedFile) return;
    await onUpload(selectedFile);
    setSelectedFile(null);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Upload Protocol" 
      subtitle="Inject assets into system node"
    >
      <div className="p-8">
        {!selectedFile ? (
          <Dropzone 
            onFileSelect={setSelectedFile} 
            isDragging={isDragging} 
            setIsDragging={setIsDragging} 
          />
        ) : (
          <div className="bg-slate-50 rounded-3xl p-6 flex items-center gap-4 border border-emerald-100/50 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <FileIcon className="w-6 h-6" />
            </div>
            <div className="grow">
              <p className="text-sm font-bold truncate">{selectedFile.name}</p>
              <p className="text-[10px] text-slate-400 font-mono tracking-tighter">READY FOR INJECTION</p>
            </div>
            <button 
              disabled={isProcessing} onClick={() => setSelectedFile(null)} 
              className="text-xs font-bold text-red-400 hover:text-red-600 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}

        <button 
          disabled={!selectedFile || isProcessing} onClick={handleAction} 
          style={{ backgroundColor: selectedFile ? colors.primary : '#f1f5f9' }} 
          className={`w-full mt-8 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            selectedFile ? 'text-white shadow-lg active:scale-95 hover:brightness-110' : 'text-slate-400'
          } disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {isProcessing ? 'Processing...' : 'Initialize Upload'}
        </button>
      </div>
    </Modal>
  );
}