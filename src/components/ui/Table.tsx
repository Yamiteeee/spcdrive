'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  // This function tells the table how to render the data for this specific cell
  render: (item: T, index: number) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export function Table<T>({ data, columns, emptyMessage = "No records found" }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="text-left">
            {columns.map((col, i) => (
              <th 
                key={i} 
                className={`pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50
                  ${col.align === 'right' ? 'text-right' : ''}
                  ${col.align === 'center' ? 'text-center' : ''}
                `}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          <AnimatePresence mode="popLayout">
            {data.length > 0 ? (
              data.map((item, idx) => (
                <motion.tr
                  layout
                  key={(item as any).id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05, ease: "easeOut" }}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={`py-4 transition-colors
                        ${col.align === 'right' ? 'text-right' : ''}
                        ${col.align === 'center' ? 'text-center' : ''}
                      `}
                    >
                      {col.render(item, idx)}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}