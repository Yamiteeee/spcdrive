'use client';

import { useState, useMemo } from 'react';
import { Download, Edit2, Trash2, FileCode, FolderPlus, Plus, Folder, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileItem } from '@/types/dashboard';
import { Table } from '@/components/ui/Table';
import { SearchInput } from '@/components/ui/SearchInput';
import { SlidePanel } from '@/components/ui/SlidePanel';
import { useSPCTheme } from '@/providers/ThemeProvider';
import { FileEditForm } from '@/components/ui/FileEditForm';
import { useCategoryManagement } from '@/hooks/useCategoryManagement';

// Internal Action Button Component
function ActionButton({ icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) {
  const { colors, radius } = useSPCTheme();
  return (
    <motion.button
      whileHover="hover" whileTap={{ scale: 0.95 }} onClick={onClick}
      className="relative flex items-center gap-2 px-3 py-2 transition-all border group overflow-hidden"
      style={{ borderRadius: radius.base, borderColor: `${color}20`, backgroundColor: colors.background }}
    >
      <motion.div variants={{ hover: { x: 0 } }} initial={{ x: '-105%' }} className="absolute inset-0 z-0 opacity-10" style={{ backgroundColor: color }} />
      <span className="relative z-10" style={{ color: color }}>{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-tighter relative z-10 hidden lg:block overflow-hidden" style={{ color: color }}>
        <motion.div variants={{ hover: { y: 0 } }} initial={{ y: 20 }}>{label}</motion.div>
      </span>
    </motion.button>
  );
}

export function FileBank({ role, files, searchQuery, setSearchQuery, onDownload, onDelete, onUpdate }: any) {
  const { colors, radius } = useSPCTheme();
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);

  // Category Operations States
  const { categories, addCategory } = useCategoryManagement();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  
  // Track which category folder tab is currently holding a dragged item over it
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);

  // Active Selected Filter Category Pointer State
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('ALL_ASSETS');

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    const res = await addCategory(newCategoryName);
    if (res.success) {
      setNewCategoryName('');
      setIsCreatingCategory(false);
    }
  };

  // Drag and Drop Event Action Routines
  const handleDragStart = (e: React.DragEvent, file: FileItem) => {
    e.dataTransfer.setData('text/plain', file.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFolderDrop = async (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    setDragOverCategory(null);
    const fileIdStr = e.dataTransfer.getData('text/plain');
    if (!fileIdStr) return;

    const targetFile = files.find((f: FileItem) => String(f.id) === fileIdStr);
    
    if (targetFile && targetFile.category !== targetCategory) {
      onUpdate(targetFile.id, { ...targetFile, category: targetCategory });
    }
  };

  // Dynamic Dataset Slicing Layer
  const filteredFiles = useMemo(() => {
    if (activeFilterCategory === 'ALL_ASSETS') return files;
    return files.filter((file: FileItem) => {
      const fileCat = file.category || 'Not Categorized';
      return fileCat.toLowerCase() === activeFilterCategory.toLowerCase();
    });
  }, [files, activeFilterCategory]);

  const columns = [
    {
      header: 'Asset Identity',
      render: (file: FileItem) => (
        <motion.div 
          layout="position"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ type: 'spring', stiffness: 500, damping: 38 }}
          draggable={role === 'admin'}
          // 🌟 FIX: Use standard HTML5 drag event via any casting to override Framer Motion's custom gestural onDragStart definitions
          onDragStart={(e: any) => handleDragStart(e, file)}
          className={`flex items-center justify-between gap-4 pl-4 pr-2 py-1 group w-full relative will-change-transform ${role === 'admin' ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          <div className="flex items-center gap-4 text-left min-w-0 grow">
            <div className="w-10 h-10 flex flex-col items-center justify-center border relative shrink-0" style={{ borderColor: colors.border, borderRadius: '0.75rem' }}>
              <span className="text-[8px] font-black opacity-40 uppercase">{file.type}</span>
              <FileCode className="w-3 h-3 opacity-20 absolute -bottom-1 -right-1 rotate-12" />
            </div>
            <div className="flex flex-col text-left min-w-0 grow">
              <span className="text-sm font-bold tracking-tight line-clamp-1 truncate" style={{ color: colors.textMain }}>{file.name}</span>
              
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-mono opacity-40 shrink-0">UID_{file.id}</span>
                
                {role === 'admin' ? (
                  <div className="relative flex items-center gap-1 group/select shrink-0">
                    <select
                      value={file.category || 'Not Categorized'}
                      onChange={(e) => onUpdate(file.id, { ...file, category: e.target.value })}
                      className="text-[9px] font-black uppercase pl-1.5 pr-5 py-0.5 tracking-tight border bg-transparent cursor-pointer appearance-none focus:outline-none transition-colors"
                      style={{ 
                        borderRadius: '4px',
                        backgroundColor: file.category === 'Not Categorized' ? `${colors.textMuted}10` : `${colors.primary}15`,
                        borderColor: file.category === 'Not Categorized' ? colors.border : `${colors.primary}30`,
                        color: file.category === 'Not Categorized' ? colors.textMuted : colors.primary
                      }}
                    >
                      <option value="Not Categorized" className="bg-neutral-900 text-white">Not Categorized</option>
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-neutral-900 text-white">{c}</option>
                      ))}
                    </select>
                    <Tag className="w-2.5 h-2.5 absolute right-1.5 pointer-events-none opacity-40 group-hover/select:opacity-100 transition-opacity" style={{ color: file.category === 'Not Categorized' ? colors.textMuted : colors.primary }} />
                  </div>
                ) : (
                  <span 
                    className="text-[9px] font-black uppercase px-1.5 py-0.5 tracking-tight border select-none shrink-0"
                    style={{ 
                      borderRadius: '4px',
                      backgroundColor: file.category === 'Not Categorized' ? `${colors.textMuted}10` : `${colors.primary}15`,
                      borderColor: file.category === 'Not Categorized' ? colors.border : `${colors.primary}30`,
                      color: file.category === 'Not Categorized' ? colors.textMuted : colors.primary
                    }}
                  >
                    {file.category || 'Not Categorized'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )
    },
    {
        header: 'Payload',
        render: (file: FileItem) => <span className="text-xs font-mono font-bold" style={{ color: colors.textMuted }}>{file.size}</span>
    },
    {
      header: 'Actions',
      align: 'right' as const,
      render: (file: FileItem) => (
        <div className="flex justify-end gap-2 pr-4">
          <ActionButton icon={<Download size={15} />} label="Retrieve" color={colors.primary} onClick={() => onDownload(file)} />
          {role === 'admin' && (
            <>
              <ActionButton icon={<Edit2 size={15} />} label="Modify" color={colors.textMuted} onClick={() => setEditingFile(file)} />
              <ActionButton icon={<Trash2 size={15} />} label="Purge" color={colors.danger} onClick={() => onDelete(file.id)} />
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Search Input Bar & Category Action Creation Lineup */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="grow">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="SCAN REPOSITORY..." />
        </div>
        
        {role === 'admin' && !isCreatingCategory && (
          <button
            type="button"
            onClick={() => setIsCreatingCategory(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
            style={{ borderColor: colors.border, borderRadius: radius.base, color: colors.textMuted, backgroundColor: colors.card }}
          >
            <FolderPlus className="w-4 h-4" style={{ color: colors.primary }} />
            New Category
          </button>
        )}
      </div>

      {/* Inline Input Workflow Panel for immediate Category Generation */}
      {role === 'admin' && isCreatingCategory && (
        <form 
          onSubmit={handleCreateCategory} 
          className="flex gap-2 items-center p-2 border animate-in slide-in-from-top-2 duration-200 shrink-0" 
          style={{ backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.base }}
        >
          <input
            type="text"
            required
            autoFocus
            placeholder="NAME NEW CATEGORY (E.G., HR, LEGAL, TECH)..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="grow bg-transparent border-none text-xs font-bold font-mono tracking-wide uppercase focus:outline-none focus:ring-0 px-2"
            style={{ color: colors.textMain }}
          />
          <div className="flex gap-1.5 shrink-0">
            <button
              type="submit"
              className="px-3 py-1.5 text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-1 transition-transform active:scale-95"
              style={{ backgroundColor: colors.primary, borderRadius: radius.base }}
            >
              <Plus className="w-3 h-3" /> Save
            </button>
            <button
              type="button"
              onClick={() => { setIsCreatingCategory(false); setNewCategoryName(''); }}
              className="px-3 py-1.5 text-[10px] font-black uppercase border tracking-widest transition-colors"
              style={{ borderColor: colors.border, color: colors.textMuted, borderRadius: radius.base }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* HORIZONTAL FOLDER DIRECTORY FILTER TOOLBAR BAR */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 custom-scrollbar shrink-0 select-none">
        <button
          type="button"
          onClick={() => setActiveFilterCategory('ALL_ASSETS')}
          onDragOver={(e) => { e.preventDefault(); role === 'admin' && setDragOverCategory('ALL_ASSETS'); }}
          onDragLeave={() => setDragOverCategory(null)}
          onDrop={(e) => handleFolderDrop(e, 'Not Categorized')}
          className="flex items-center gap-1.5 px-3 py-2 border text-[10px] font-black uppercase tracking-wider transition-all duration-200 shrink-0"
          style={{
            borderRadius: radius.base,
            backgroundColor: activeFilterCategory === 'ALL_ASSETS' || dragOverCategory === 'ALL_ASSETS' ? `${colors.primary}15` : colors.card,
            borderColor: activeFilterCategory === 'ALL_ASSETS' || dragOverCategory === 'ALL_ASSETS' ? colors.primary : colors.border,
            color: activeFilterCategory === 'ALL_ASSETS' || dragOverCategory === 'ALL_ASSETS' ? colors.primary : colors.textMuted,
            boxShadow: activeFilterCategory === 'ALL_ASSETS' ? `0 2px 10px ${colors.primary}10` : 'none',
            transform: dragOverCategory === 'ALL_ASSETS' ? 'scale(1.05)' : 'none'
          }}
        >
          <Folder className="w-3.5 h-3.5" />
          All Assets
        </button>

        {categories.map((cat) => {
          const isSelected = activeFilterCategory.toLowerCase() === cat.toLowerCase();
          const isHoveredDrag = dragOverCategory === cat;
          return (
            <button
              key={`filter-${cat}`}
              type="button"
              onClick={() => setActiveFilterCategory(cat)}
              onDragOver={(e) => { e.preventDefault(); role === 'admin' && setDragOverCategory(cat); }}
              onDragLeave={() => setDragOverCategory(null)}
              onDrop={(e) => handleFolderDrop(e, cat)}
              className="flex items-center gap-1.5 px-3 py-2 border text-[10px] font-black uppercase tracking-wider transition-all duration-200 shrink-0"
              style={{
                borderRadius: radius.base,
                backgroundColor: isSelected || isHoveredDrag ? `${colors.primary}15` : colors.card,
                borderColor: isSelected || isHoveredDrag ? colors.primary : colors.border,
                color: isSelected || isHoveredDrag ? colors.primary : colors.textMuted,
                boxShadow: isSelected ? `0 2px 10px ${colors.primary}10` : 'none',
                transform: isHoveredDrag ? 'scale(1.05)' : 'none'
              }}
            >
              <Folder className="w-3.5 h-3.5" style={{ color: isSelected || isHoveredDrag ? colors.primary : colors.textMuted }} />
              {cat}
            </button>
          );
        })}
      </div>
      
      {/* Scroll Wrapper reading data directly out of the sliced array variable */}
      <div className="grow overflow-y-auto max-h-105 pr-2 custom-scrollbar relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <Table data={filteredFiles} columns={columns} />
        </AnimatePresence>
      </div>

      <SlidePanel isOpen={!!editingFile} onClose={() => setEditingFile(null)} title="Asset Modification">
        <FileEditForm file={editingFile} onSave={(updated) => { onUpdate(updated.id, updated); setEditingFile(null); }} />
      </SlidePanel>
    </div>
  );
}