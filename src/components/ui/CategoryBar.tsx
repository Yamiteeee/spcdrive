'use client';

import { Folder, X } from 'lucide-react';
import { useSPCTheme } from '@/providers/ThemeProvider';

interface CategoryBarProps {
  role: 'admin' | 'user';
  categories: string[];
  activeFilterCategory: string;
  dragOverCategory: string | null;
  changeFilterCategory: (category: string) => void;
  setDragOverCategory: (category: string | null) => void;
  handleFolderDrop: (e: React.DragEvent, category: string) => void;
  onDeleteCategory?: (category: string) => void; 
}

export function CategoryBar({
  role,
  categories,
  activeFilterCategory,
  dragOverCategory,
  changeFilterCategory,
  setDragOverCategory,
  handleFolderDrop,
  onDeleteCategory, 
}: CategoryBarProps) {
  const { colors, radius } = useSPCTheme();

  // 🌟 Ensure 'All Assets' always stays at the start of the navigation matrix
  const cleanCategories = categories.includes('All Assets') 
    ? categories 
    : ['All Assets', ...categories];

  return (
    <div className="flex gap-2 items-center overflow-x-auto no-scrollbar shrink-0 pb-1 w-full">
      {cleanCategories.map((cat) => {
        const isSelected = activeFilterCategory === cat;
        const isDragOver = dragOverCategory === cat;
        const isSystemProtected = cat === 'All Assets' || cat === 'Not Categorized';

        return (
          <div
            key={cat}
            onDragOver={(e) => {
              e.preventDefault();
              if (role === 'admin') setDragOverCategory(cat);
            }}
            onDragLeave={() => setDragOverCategory(null)}
            onDrop={(e) => {
              setDragOverCategory(null);
              handleFolderDrop(e, cat);
            }}
            className="flex items-center shrink-0 transition-all duration-150"
            style={{
              borderRadius: '9999px',
              backgroundColor: isDragOver ? `${colors.primary}15` : 'transparent',
            }}
          >
            {/* Folder Filter Toggle Button Structure */}
            <button
              type="button"
              onClick={() => changeFilterCategory(cat)}
              className="flex items-center gap-2 pl-3 pr-3 text-[10px] font-black uppercase tracking-wider transition-all duration-200 group/btn"
              style={{
                backgroundColor: isSelected ? `${colors.primary}15` : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: '1px',
                color: isSelected ? colors.primary : colors.textMuted,
                borderRadius: '9999px',
                paddingRight: (role === 'admin' && !isSystemProtected) ? '0.5rem' : '0.75rem',
                height: '28px'
              }}
            >
              <Folder className="w-3 h-3 shrink-0" />
              <span>{cat}</span>

              {/* THE INLINE TUCKED DELETE BUTTON */}
              {role === 'admin' && !isSystemProtected && onDeleteCategory && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation(); // Stop folder filtering selection from firing
                    onDeleteCategory(cat);
                  }}
                  className="p-0.5 ml-1 rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  <X className="w-2.5 h-2.5" />
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}