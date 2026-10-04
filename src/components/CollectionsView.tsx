import React from "react";
import { Sparkles, Loader2, Layers } from "lucide-react";
import { MainCollection } from "../types";

export default function CollectionsView({
  activeCollections = [],
  activeCategory,
  getMainCollectionCover,
  setSelectedMainCollection,
  setMenuState,
  handleSurpriseMe,
  isCurating
}: {
  activeCollections?: MainCollection[];
  activeCategory: string | null;
  getMainCollectionCover: (category: string, name: string) => string;
  setSelectedMainCollection: (col: string | null) => void;
  setMenuState: (state: string) => void;
  handleSurpriseMe: (cat: string | null) => void;
  isCurating: boolean;
}) {
  const safeList = Array.isArray(activeCollections) ? activeCollections : [];

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto animate-in fade-in pb-10 pt-4 px-2 md:px-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {safeList.map((col: MainCollection) => {
          const coverImg = getMainCollectionCover(activeCategory || "Paintings", col.name);
          const subCount = col.subGalleries?.length || 0;

          return (
            <button 
              key={col.id} 
              onClick={() => { 
                setSelectedMainCollection(col.name); 
                setMenuState("subcollections"); 
              }} 
              className="h-32 md:h-44 w-full bg-[#2A0845] relative active:scale-95 transition-all flex flex-col items-center justify-center rounded-2xl md:rounded-3xl shadow-md overflow-hidden text-center group cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500" 
                style={{ backgroundImage: `url(${coverImg})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

              <span className="font-black text-white text-lg md:text-2xl tracking-[0.2em] z-10 uppercase drop-shadow-md px-3">
                {col.name}
              </span>
              
              <span className="z-10 mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold text-white tracking-wider uppercase border border-white/20">
                <Layers className="w-3 h-3" />
                {subCount} {subCount === 1 ? "Sub-Gallery" : "Sub-Galleries"}
              </span>
            </button>
          );
        })}
      </div>
      
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
