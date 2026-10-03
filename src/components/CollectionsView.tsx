import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

export default function CollectionsView({
  currentActiveFolderList,
  activeCategory,
  getCollectionCover,
  setSelectedSubCategory,
  setMenuState,
  handleSurpriseMe,
  isCurating
}: any) {
  const safeList = Array.isArray(currentActiveFolderList) ? currentActiveFolderList : [];

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto animate-in fade-in pb-10 pt-4 px-2 md:px-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {safeList.map((catName: string, index: number) => {
          const coverImg = getCollectionCover(activeCategory, catName);
          return (
            <button 
              key={index} 
              onClick={() => { setSelectedSubCategory(catName); setMenuState("list"); }} 
              className="h-28 md:h-40 w-full bg-[#2A0845] relative active:scale-95 transition-all flex items-center justify-center rounded-2xl md:rounded-3xl shadow-md overflow-hidden text-center group"
            >
              <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" style={{ backgroundImage: "url(" + coverImg + ")" }}></div>
              <span className="font-black text-white text-base md:text-xl tracking-[0.2em] z-10 uppercase drop-shadow-md">{catName}</span>
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
