import React from "react";
import { Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { SubGallery } from "../types";

export default function SubCollectionsView({
  activeSubGalleries = [],
  selectedMainCollection,
  activeCategory,
  getSubGalleryCover,
  setSelectedSubCategory,
  setMenuState,
  handleSurpriseMe,
  isCurating,
  inventory = []
}: {
  activeSubGalleries?: SubGallery[];
  selectedMainCollection: string | null;
  activeCategory: string | null;
  getSubGalleryCover: (category: string, collectionName: string, subName: string) => string;
  setSelectedSubCategory: (sub: string | null) => void;
  setMenuState: (state: string) => void;
  handleSurpriseMe: (cat: string | null) => void;
  isCurating: boolean;
  inventory?: any[];
}) {
  const safeList = Array.isArray(activeSubGalleries) ? activeSubGalleries : [];

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto animate-in fade-in pb-10 pt-2 md:pt-4 px-2 md:px-6">
      
      {safeList.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-sm bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          No sub-galleries in this collection yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {safeList.map((sub: SubGallery) => {
            const coverImg = getSubGalleryCover(
              activeCategory || "Paintings",
              selectedMainCollection || "",
              sub.name
            );

            // Calculate item count in this sub-gallery
            const itemCount = inventory.filter((art: any) => {
              if (art.category !== activeCategory || art.isVaulted) return false;
              if (selectedMainCollection && art.mainCollection && art.mainCollection !== selectedMainCollection) {
                return false;
              }
              return art.subcategory === sub.name;
            }).length;

            return (
              <button 
                key={sub.id} 
                onClick={() => { 
                  setSelectedSubCategory(sub.name); 
                  setMenuState("list"); 
                }} 
                className="h-28 md:h-40 w-full bg-[#2A0845] relative active:scale-95 transition-all flex flex-col items-center justify-center rounded-2xl md:rounded-3xl shadow-md overflow-hidden text-center group cursor-pointer"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500" 
                  style={{ backgroundImage: `url(${coverImg})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

                <span className="font-black text-white text-base md:text-xl tracking-[0.2em] z-10 uppercase drop-shadow-md px-3">
                  {sub.name}
                </span>

                <span className="z-10 mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-wider uppercase border border-white/20">
                  <ImageIcon className="w-3 h-3" />
                  {itemCount} {itemCount === 1 ? "Piece" : "Pieces"}
                </span>
              </button>
            );
          })}
        </div>
      )}
      
      <div className="w-full bg-stone-300 h-[1px] my-6"></div>
      
      <button 
        onClick={() => handleSurpriseMe(activeCategory)} 
        disabled={isCurating}
        className={"h-16 md:h-20 max-w-[280px] md:max-w-[400px] mx-auto w-full bg-white text-[#2A0845] border-2 border-[#2A0845] relative active:scale-95 transition-all flex items-center justify-center rounded-2xl md:rounded-3xl shadow-sm overflow-hidden group hover:bg-stone-50 " + (isCurating ? "opacity-75 cursor-wait" : "")}
      >
        <span className="font-black text-sm md:text-base tracking-widest z-10 uppercase group-hover:scale-105 transition-transform flex items-center gap-2">
          {isCurating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#2A0845]" />
              <span>Curating Artwork...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#2A0845]" />
              <span>SURPRISE ME</span>
            </>
          )}
        </span>
      </button>
    </div>
  );
}
