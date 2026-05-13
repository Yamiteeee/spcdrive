'use client';
import { Upload } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
}

export function Dropzone({ onFileSelect, isDragging, setIsDragging }: DropzoneProps) {
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
  };

  return (
    <div 
      onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} 
      className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center gap-4 transition-all ${
        isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50/30'
      }`}
    >
      <Upload className="w-8 h-8 text-emerald-500" />
      <p className="text-sm font-bold">Drop file or click to browse</p>
      <input 
        type="file" className="absolute inset-0 opacity-0 cursor-pointer" 
        onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} 
      />
    </div>
  );
}