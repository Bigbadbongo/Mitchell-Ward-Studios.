import React from "react";
import { Upload, Folder, Archive } from "lucide-react";
import { MainCollection } from "../types";

export default function AdminCollectionsView({
  activeCategory,
  activeCollections = [],
  openUploadModal,
  setSelectedMainCollection,
  setSelectedSubCategory,
  setMenuState
}: {
  activeCategory: string | null;
  activeCollections?: MainCollection[];
  inventory?: any[];
  openUploadModal: (cat: string | null) => void;
  setSelectedMainCollection: (col: string | null) => void;
  setSelectedSubCategory: (sub: string | null) => void;
  setMenuState: (state: string) => void;
  setIsAdminSettingsOpen?: (open: boolean) => void;
}) {
  const safeList = Array.isArray(activeCollections) ? activeCollections : [];

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col animate-in fade-in pb-12 pt-2 px-2 md:px-6">
      
      {/* Top Action Header with Primary Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h3 className="font-black text-base md:text-lg uppercase tracking-widest text-[#2A0845]">
            {activeCategory} Folders
          </h3>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Select a folder to view artwork & sub-galleries
          </p>
        </div>

        <button 
          onClick={() => openUploadModal(activeCategory)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2A0845] text-white rounded-xl text-xs font-black tracking-widest uppercase hover:bg-[#3d0c64] active:scale-95 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New</span>
        </button>
      </div>

      {/* Grid of Folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {safeList.map((col: MainCollection) => (
          <button 
            key={col.id}
            onClick={() => { 
              setSelectedMainCollection(col.name); 
              setMenuState("admin_subcollections"); 
            }}
            className="h-32 w-full text-left bg-white relative active:scale-[0.98] hover:border-[#2A0845] hover:shadow-md transition-all flex flex-col items-center justify-center rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-5 cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors mb-2.5">
              <Folder className="w-6 h-6 text-[#2A0845]" />
            </div>
            <span className="font-black text-[#2A0845] text-sm md:text-base tracking-widest uppercase text-center truncate max-w-full">
              {col.name}
            </span>
          </button>
        ))}

        <button 
          onClick={() => { 
            setSelectedMainCollection(null);
            setSelectedSubCategory("Unassigned"); 
            setMenuState("admin_list"); 
          }}
          className="h-32 w-full text-left bg-stone-50 relative active:scale-[0.98] hover:border-stone-400 hover:bg-stone-100 transition-all flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 p-5 shrink-0 cursor-pointer group"
        >
          <div className="p-2.5 rounded-xl bg-stone-100 group-hover:bg-stone-200 transition-colors mb-2.5">
            <Archive className="w-6 h-6 text-stone-500" />
          </div>
          <span className="font-black text-stone-600 text-sm tracking-widest uppercase text-center">
            Unassigned
          </span>
        </button>
      </div>

    </div>
  );
}
