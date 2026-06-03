'use client';

import { useState } from 'react';
import { File as FileIcon, CheckCircle2, Loader2, X, FolderKanban } from 'lucide-react';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { Modal } from '@/components/ui/Modal';
import { Dropzone } from '@/components/ui/Dropzone';

interface UploadModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onUpload: (files: File[], category: string) => Promise<any>;
  categories: string[]; // 🌟 NEW: Accepting live dashboard categories directly through props
}

export function UploadModal({ isOpen, isProcessing, onClose, onUpload, categories }: UploadModalProps) {
  const { colors, radius } = useSPCTheme();
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [chosenCategory, setChosenCategory] = useState<string>('Not Categorized'); 

  const handleFileIncoming = (incoming: File | File[] | FileList) => {
    if (!incoming) return;
    
    let fileArray: File[] = [];
    if (incoming instanceof File) {
      fileArray = [incoming];
    } else if (incoming instanceof FileList) {
      fileArray = Array.from(incoming);
    } else if (Array.isArray(incoming)) {
      fileArray = incoming;
    }
    
    setSelectedFiles((prev) => [...prev, ...fileArray]);
  };

  const handleAction = async () => {
    if (selectedFiles.length === 0) return;
    // Passes the chosen category up to your layout hook execution script
    await onUpload(selectedFiles, chosenCategory);
    setSelectedFiles([]); 
    setChosenCategory('Not Categorized'); // Reset to default layout state
  };

  const removeFileFromQueue = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Upload Protocol" 
      subtitle="Inject collective bulk assets into system nodes"
    >
      <div className="p-8">
        {selectedFiles.length === 0 ? (
          <Dropzone 
            onFileSelect={handleFileIncoming} 
            isDragging={isDragging} 
            setIsDragging={setIsDragging} 
          />
        ) : (
          <div className="space-y-4">
            {/* Multi-File Live Preview Stacked Container Scroll Area */}
            <div className="space-y-3 max-h-55 overflow-y-auto pr-1 custom-scrollbar">
              {selectedFiles.map((file, idx) => (
                <div 
                  key={`${file.name}-${idx}`}
                  className="p-4 flex items-center gap-4 border animate-in fade-in zoom-in-95"
                  style={{ 
                    backgroundColor: `${colors.background}80`,
                    borderColor: `${colors.primary}20`,
                    borderRadius: radius.base 
                  }}
                >
                  <div 
                    className="w-10 h-10 flex items-center justify-center text-white shadow-md shrink-0"
                    style={{ backgroundColor: colors.primary, borderRadius: '0.5rem' }}
                  >
                    <FileIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="grow overflow-hidden text-left">
                    <p className="text-sm font-bold truncate" style={{ color: colors.textMain }}>
                      {file.name}
                    </p>
                    <p 
                      className="text-[9px] font-mono tracking-tighter uppercase opacity-60"
                      style={{ color: colors.primary }}
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • READY
                    </p>
                  </div>

                  <button 
                    disabled={isProcessing} 
                    onClick={() => removeFileFromQueue(idx)} 
                    className="p-1 rounded opacity-60 hover:opacity-100 disabled:opacity-30 transition-opacity"
                    style={{ color: colors.danger }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Helper workflow indicator to stack more items into the staging cache */}
            {!isProcessing && (
              <label 
                className="block text-center border border-dashed py-2.5 text-xs font-bold cursor-pointer hover:bg-neutral-100/5 transition-colors uppercase tracking-widest mb-2"
                style={{ borderColor: colors.border, color: colors.textMuted, borderRadius: radius.base }}
              >
                + Add more assets to queue
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={(e) => e.target.files && handleFileIncoming(e.target.files)} 
                />
              </label>
            )}

            {/* THE DYNAMIC CATEGORY DROPDOWN CONTROL BAR */}
            <div 
              className="p-4 border flex flex-col gap-2 text-left"
              style={{ backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.base }}
            >
              <label className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: colors.textMuted }}>
                <FolderKanban className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                Assign Collective Repository Destination
              </label>
              
              <select
                disabled={isProcessing}
                value={chosenCategory}
                onChange={(e) => setChosenCategory(e.target.value)}
                className="w-full bg-transparent border p-2.5 text-xs font-bold uppercase tracking-tight focus:outline-none focus:ring-1"
                style={{ 
                  borderColor: colors.border, 
                  color: colors.textMain,
                  borderRadius: radius.base,
                  backgroundColor: colors.background
                }}
              >
                {/* 🌟 Formulate options straight out of the parent dashboard props stream */}
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-neutral-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Global Action Workflow Button Link */}
        <button 
          disabled={selectedFiles.length === 0 || isProcessing} 
          onClick={handleAction} 
          className="w-full mt-6 py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: selectedFiles.length > 0 ? colors.primary : colors.border,
            color: selectedFiles.length > 0 ? '#ffffff' : colors.textMuted,
            borderRadius: radius.base 
          }}
        >
          {isProcessing ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          {isProcessing 
            ? `Injecting Batch Assets...` 
            : selectedFiles.length > 0 
              ? `Initialize Upload (${selectedFiles.length} Assets -> ${chosenCategory})`
              : 'Initialize Upload'
          }
        </button>
      </div>
    </Modal>
  );
}