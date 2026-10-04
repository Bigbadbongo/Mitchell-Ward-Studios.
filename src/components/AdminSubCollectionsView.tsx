import React from "react";
import { Folder, ArrowLeft } from "lucide-react";
import { SubGallery } from "../types";

export default function AdminSubCollectionsView({
  selectedMainCollection,
  activeSubGalleries = [],
  setSelectedSubCategory,
  setMenuState
}: {
  activeCategory?: string | null;
  selectedMainCollection: string | null;
  activeSubGalleries?: SubGallery[];
  inventory?: any[];
  setSelectedSubCategory: (sub: string | null) => void;
  setMenuState: (state: string) => void;
  setIsAdminSettingsOpen?: (open: boolean) => void;
}) {
  const safeList = Array.isArray(activeSubGalleries) ? activeSubGalleries : [];

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col animate-in fade-in pb-12 pt-2 px-2 md:px-6">
      
      {/* Top Header with Navigation */}
      <div className="flex items-center gap-3 mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
        <button
          onClick={() => setMenuState("admin_collections")}
          className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-[#2A0845] transition-colors shrink-0 cursor-pointer"
          title="Back to Folders"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="font-black text-base md:text-lg uppercase tracking-widest text-[#2A0845]">
            {selectedMainCollection}
          </h3>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Select a sub-gallery to view inventory
          </p>
        </div>
      </div>

      {/* Grid of Sub-Galleries */}
      {safeList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-sm">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            This folder is empty
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {safeList.map((sub: SubGallery) => (
            <button 
              key={sub.id}
              onClick={() => { 
                setSelectedSubCategory(sub.name); 
                setMenuState("admin_list"); 
              }}
              className="h-32 w-full text-left bg-white relative active:scale-[0.98] hover:border-[#2A0845] hover:shadow-md transition-all flex flex-col items-center justify-center rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-5 cursor-pointer group"
            >
              <div className="p-2.5 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors mb-2.5">
                <Folder className="w-6 h-6 text-[#2A0845]" />
              </div>
              <span className="font-black text-[#2A0845] text-sm md:text-base tracking-widest uppercase text-center truncate max-w-full">
                {sub.name}
              </span>
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
