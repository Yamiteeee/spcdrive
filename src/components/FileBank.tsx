'use client';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { useState, useMemo } from 'react';

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  updatedAt: string;
}

export function FileBank({ role, files }: { role: 'admin' | 'user', files: FileItem[] }) {
  const { colors } = useSPCTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtering for performance
  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, files]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="relative group max-w-md">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg 
            className={`w-4 h-4 transition-colors ${searchQuery ? 'text-emerald-500' : 'text-zinc-400'}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="SEARCH REPOSITORY..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-100/50 border border-zinc-200 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-zinc-600"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <th className="pb-4 pl-4">File Name</th>
              <th className="pb-4">Size</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="relative">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <tr key={file.id} className="group bg-zinc-50/50 hover:bg-white border border-zinc-100 transition-all duration-300">
                  <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-zinc-100 group-hover:border-emerald-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-200/50 flex items-center justify-center text-zinc-500 font-bold text-[9px] border border-zinc-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        {file.type}
                      </div>
                      <span className="text-sm font-bold text-zinc-900 tracking-tight">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-mono text-zinc-500 border-y border-zinc-100 group-hover:border-emerald-200/50">
                    {file.size}
                  </td>
                  <td className="py-4 border-y border-zinc-100 group-hover:border-emerald-200/50">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">
                        Secure
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-right pr-4 rounded-r-2xl border-y border-r border-zinc-100 group-hover:border-emerald-200/50">
                    <div className="flex justify-end gap-1">
                      <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors group/btn">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      
                      {role === 'admin' && (
                        <>
                          <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                             </svg>
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">
                    No files matching "{searchQuery}"
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}