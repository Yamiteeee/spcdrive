'use client';

import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileCode, FileText, X, Loader2 } from 'lucide-react';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { FileItem } from '@/types/dashboard';
import { useDocViewer } from '@/hooks/useDocViewer'; // 🌟 Import the new custom hook

interface DocViewerModalProps {
  previewFile: FileItem | null;
  previewUrl: string | null;
  isPreviewLoading: boolean;
  isOfficeDoc: boolean;
  fileExtension: string;
  textPreviewContent: string | null;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
}

export function DocViewerModal({
  previewFile,
  previewUrl,
  isPreviewLoading,
  isOfficeDoc,
  fileExtension,
  textPreviewContent,
  onClose,
  onDownload,
}: DocViewerModalProps) {
  const { colors, radius } = useSPCTheme();
  
  // 🌟 Consume layout state from separated context hook
  const { 
    mounted, 
    iframeLoading, 
    officePreviewUrl, 
    setIframeLoading 
  } = useDocViewer({ previewFile, previewUrl, isOfficeDoc });

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {previewFile && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0"
            style={{ zIndex: 9998, backgroundColor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Modal Panel Layer */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
            style={{ zIndex: 9999 }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col w-full max-w-5xl border shadow-2xl overflow-hidden pointer-events-auto"
              style={{
                height: '85vh',
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: radius.base,
              }}
            >
              {/* Header Area */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b select-none shrink-0"
                style={{ borderColor: colors.border }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 shrink-0" style={{ color: colors.primary }} />
                  <span
                    className="text-xs font-bold font-mono tracking-tight line-clamp-1 truncate"
                    style={{ color: colors.textMain }}
                  >
                    {previewFile.name} ({previewFile.size})
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:opacity-70 transition-opacity"
                  style={{ color: colors.textMuted }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Viewport Container Box */}
              <div className="relative flex-1 min-h-0 bg-neutral-900 overflow-hidden">
                {isPreviewLoading && (
                  <div
                    className="absolute inset-0 flex flex-col gap-3 items-center justify-center text-xs font-mono font-bold uppercase z-10"
                    style={{ color: colors.textMuted }}
                  >
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: colors.primary }} />
                    Streaming raw buffers securely...
                  </div>
                )}

                {!isPreviewLoading && previewUrl && (
                  <div className="w-full h-full flex flex-col">

                    {/* Office Document - Rendered via Google Doc Viewer Sandbox Iframe */}
                    {isOfficeDoc && officePreviewUrl && (
                      <div 
                        className="w-full bg-[#1a1a1a] relative overflow-hidden"
                        style={{ height: 'calc(85vh - 45px)' }}
                      >
                        {iframeLoading && (
                          <div 
                            className="absolute inset-0 flex flex-col gap-3 items-center justify-center bg-neutral-900 text-xs font-mono font-bold uppercase z-20"
                            style={{ color: colors.textMuted }}
                          >
                            <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.primary }} />
                            <span>Generating preview cache...</span>
                          </div>
                        )}
                        
                        <iframe
                          src={officePreviewUrl}
                          title={previewFile.name}
                          className="w-full h-full absolute inset-0 border-none bg-white"
                          sandbox="allow-scripts allow-same-origin allow-popups"
                          onLoad={() => setIframeLoading(false)}
                          style={{ 
                            display: 'block',
                            width: '100%', 
                            height: '100%' 
                          }}
                        />
                      </div>
                    )}

                    {/* Standard Images Content Viewport Display Engine */}
                    {!isOfficeDoc && ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(fileExtension.toLowerCase()) && (
                      <div className="w-full h-full flex items-center justify-center p-6 bg-neutral-950/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt={previewFile.name}
                          className="max-w-full max-h-[calc(85vh-80px)] object-contain select-none"
                          style={{ borderRadius: radius.base }}
                        />
                      </div>
                    )}

                    {/* Embedded PDF Documents */}
                    {!isOfficeDoc && fileExtension === 'pdf' && (
                      <iframe
                        src={`${previewUrl}#toolbar=0`}
                        title={previewFile.name}
                        className="w-full h-full border-none bg-neutral-900"
                        style={{ height: 'calc(85vh - 45px)' }}
                      />
                    )}

                    {/* Standard Text Content Previews */}
                    {!isOfficeDoc && textPreviewContent !== null && (
                      <pre
                        className="w-full h-full overflow-auto p-4 font-mono text-xs text-left leading-relaxed select-text"
                        style={{ color: colors.textMain, backgroundColor: 'rgba(0,0,0,0.25)', height: 'calc(85vh - 45px)' }}
                      >
                        {textPreviewContent}
                      </pre>
                    )}

                    {/* Audio Assets */}
                    {!isOfficeDoc && ['mp3', 'wav', 'ogg', 'm4a'].includes(fileExtension) && (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <div
                          className="p-8 border w-full max-w-md bg-neutral-950/60"
                          style={{ borderRadius: radius.base, borderColor: colors.border }}
                        >
                          <audio controls src={previewUrl} className="w-full focus:outline-none" autoPlay />
                        </div>
                      </div>
                    )}

                    {/* Video Previews */}
                    {!isOfficeDoc && ['mp4', 'webm', 'ogv'].includes(fileExtension) && (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <video
                          controls
                          src={previewUrl}
                          className="max-w-full max-h-full"
                          style={{ borderRadius: radius.base }}
                          autoPlay
                        />
                      </div>
                    )}

                    {/* Binary Format Fallback Layout */}
                    {!isOfficeDoc &&
                      !['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'pdf', 'mp3', 'wav', 'ogg', 'm4a', 'mp4', 'webm', 'ogv'].includes(fileExtension) &&
                      textPreviewContent === null && (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center p-6">
                          <div
                            className="w-12 h-12 flex items-center justify-center border"
                            style={{
                              borderColor: colors.border,
                              borderRadius: '1rem',
                              backgroundColor: `${colors.textMuted}05`,
                            }}
                          >
                            <FileCode className="w-6 h-6 opacity-60" style={{ color: colors.primary }} />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <h4
                              className="text-xs font-bold uppercase tracking-wider"
                              style={{ color: colors.textMain }}
                            >
                              No Inline Preview Available
                            </h4>
                            <p className="text-[11px] leading-normal" style={{ color: colors.textMuted }}>
                              Binary type formats (<span className="font-mono">{fileExtension}</span>) must be retrieved locally to be viewed.
                            </p>
                          </div>
                          <button
                            onClick={() => onDownload(previewFile)}
                            className="flex items-center gap-2 px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95"
                            style={{
                              backgroundColor: colors.primary,
                              borderColor: colors.primary,
                              color: '#fff',
                              borderRadius: radius.base,
                            }}
                          >
                            <Download className="w-3.5 h-3.5" /> Download Item
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}