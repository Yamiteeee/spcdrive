'use client';
import { useSPCTheme } from '@/providers/ThemeProvider';

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  updatedAt: string;
}

export function FileBank({ role, files }: { role: 'admin' | 'user', files: FileItem[] }) {
  const { colors } = useSPCTheme();

  return (
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
        <tbody>
          {files.map((file) => (
            <tr key={file.id} className="group bg-zinc-50 hover:bg-white border border-zinc-100 transition-all">
              <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-zinc-100 group-hover:border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-[10px]">
                    {file.type}
                  </div>
                  <span className="text-sm font-bold text-zinc-900 tracking-tight">{file.name}</span>
                </div>
              </td>
              <td className="py-4 text-xs font-mono text-zinc-500 border-y border-zinc-100 group-hover:border-emerald-100">
                {file.size}
              </td>
              <td className="py-4 border-y border-zinc-100 group-hover:border-emerald-100">
                <span className="text-[9px] font-black uppercase px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                  Secure
                </span>
              </td>
              <td className="py-4 text-right pr-4 rounded-r-2xl border-y border-r border-zinc-100 group-hover:border-emerald-100">
                <div className="flex justify-end gap-2">
                  {/* Both roles can Download */}
                  <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                  
                  {/* Admin Only Actions */}
                  {role === 'admin' && (
                    <>
                      <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}