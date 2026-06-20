import React, { useState, useEffect } from "react";
import { Upload, Folder, ArrowRight, Archive } from "lucide-react";
import { useUI } from "../context/UIContext";
import { useInventory } from "../context/InventoryContext";
import useStudioEngine from "./useStudioEngine";

export default function AdminCollectionsView() {
  const { activeCategory, setSelectedSubCategory, setMenuState } = useUI();
  const { currentActiveFolderList } = useInventory();
  const { openUploadModal } = useStudioEngine();
  const safeList = Array.isArray(currentActiveFolderList) ? currentActiveFolderList : [];
  const [folders, setFolders] = useState(safeList);

  useEffect(() => {
    setFolders(Array.isArray(currentActiveFolderList) ? currentActiveFolderList : []);
  }, [currentActiveFolderList]);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col animate-in fade-in pb-12 pt-4 px-2 md:px-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            openUploadModal(activeCategory); 
          }} 
          className="h-20 md:h-32 w-full bg-[#2A0845] text-white relative active:scale-95 transition-all flex flex-col items-center justify-center gap-3 rounded-2xl shadow-md overflow-hidden shrink-0 group hover:bg-[#3b0b60]"
        >
          <Upload className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          <span className="font-black text-sm md:text-base tracking-widest z-10 uppercase">UPLOAD NEW</span>
        </button>

        {folders?.map((catName) => (
          <button 
            key={catName}
            onClick={() => { 
              setSelectedSubCategory(catName); 
              setMenuState("admin_list"); 
            }}
            className="h-20 md:h-32 w-full text-left bg-white relative active:scale-[0.98] hover:border-[#2A0845] hover:shadow-md transition-all flex flex-col items-center justify-center rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden px-4 cursor-pointer group"
          >
            <Folder className="w-8 h-8 text-stone-300 group-hover:text-[#2A0845] transition-colors mb-2" />
            <span className="font-black text-[#2A0845] text-sm md:text-base tracking-widest uppercase text-center">{catName}</span>
          </button>
        ))}

        <button 
          onClick={() => { 
            setSelectedSubCategory("Unassigned"); 
            setMenuState("admin_list"); 
          }}
          className="h-20 md:h-32 w-full text-left bg-stone-100 relative active:scale-[0.98] hover:border-stone-400 hover:bg-stone-200 transition-all flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 px-5 shrink-0 cursor-pointer group"
        >
          <Archive className="w-6 h-6 text-stone-400 group-hover:text-stone-600 transition-colors mb-2" />
          <span className="font-bold text-stone-500 text-xs md:text-sm tracking-widest uppercase text-center">Unassigned</span>
        </button>
      </div>

    </div>
  );
}