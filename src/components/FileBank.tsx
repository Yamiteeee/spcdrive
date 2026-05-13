'use client';
import { Download, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { FileItem } from '@/types/dashboard';
import { Table } from '@/components/ui/Table';
import { SearchInput } from '@/components/ui/SearchInput';

interface FileBankProps {
  role: 'admin' | 'user';
  files: FileItem[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export function FileBank({ role, files, searchQuery, setSearchQuery }: FileBankProps) {
  const columns = [
    {
      header: 'File Name',
      render: (file: FileItem) => (
        <div className="flex items-center gap-3 pl-4">
          <div className="w-8 h-8 rounded-lg bg-zinc-200/50 flex items-center justify-center text-zinc-500 font-bold text-[9px] border border-zinc-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            {file.type}
          </div>
          <span className="text-sm font-bold text-zinc-900 tracking-tight">{file.name}</span>
        </div>
      )
    },
    {
      header: 'Size',
      render: (file: FileItem) => <span className="text-xs font-mono text-zinc-500">{file.size}</span>
    },
    {
      header: 'Status',
      render: () => (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Secure</span>
        </div>
      )
    },
    {
      header: 'Actions',
      align: 'right' as const,
      render: (file: FileItem) => (
        <div className="flex justify-end gap-1 pr-4">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors">
            <Download className="w-4 h-4" />
          </motion.button>
          
          {role === 'admin' && (
            <>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors">
                <Edit2 className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1, color: '#ef4444' }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-red-50 rounded-lg text-zinc-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SearchInput 
        value={searchQuery} 
        onChange={setSearchQuery} 
        placeholder="SEARCH REPOSITORY..." 
        className="max-w-md"
      />
      
      <Table 
        data={files} 
        columns={columns} 
        emptyMessage={`No files matching "${searchQuery}"`}
      />
    </div>
  );
}