import React from "react";
import { useUI } from "../context/UIContext";
import { useInventory } from "../context/InventoryContext";
import useStudioEngine from "./useStudioEngine";

export default function ArtworkGridView() {
  const { setMenuState } = useUI();
  const { filteredArtworks, photoPrices, isLoading } = useInventory();
  const { setSelectedArtwork, setPhotoSize, photoSize } = useStudioEngine();

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 animate-in fade-in duration-300">
        <div className="w-10 h-10 border-4 border-[#2A0845]/10 border-t-[#2A0845] rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Curating Gallery...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom duration-200 pb-12 w-full max-w-7xl mx-auto px-2 md:px-6">
      {filteredArtworks.length === 0 ? (
        <div className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-sm bg-white rounded-xl border border-stone-200 p-6">
          No artworks currently available in this collection.
        </div>
      ) : filteredArtworks.map(art => (
        <div 
          key={art.id} 
          onClick={() => { 
            setSelectedArtwork(art); 
            if(art.category === "Photography") setPhotoSize("A3 Print"); 
            setMenuState("detail"); 
          }} 
          className={"bg-white rounded-xl border p-3 shadow-sm cursor-pointer transition-all " + (art.isSold ? 'border-stone-200 opacity-80' : 'border-stone-200 hover:border-[#2A0845]')}
        >
          <div className="relative bg-stone-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
             <img 
               src={art.thumbnailSrc || art.src} 
               alt={art.title} 
               loading="lazy" 
               className="w-full aspect-square sm:aspect-auto sm:h-56 object-contain p-2 rounded-lg select-none max-w-full" 
               style={{ WebkitTouchCallout: 'none' }} 
               onContextMenu={e => e.preventDefault()} 
               draggable={false} 
             />
             {art.isSold && (
               <div className="absolute inset-0 bg-white/40 flex items-center justify-center rounded-lg backdrop-blur-[1px] pointer-events-none">
                 <span className="bg-stone-800 text-white px-3 py-1 font-black tracking-widest uppercase text-sm rounded">Sold</span>
               </div>
             )}
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-800">{art.title}</h3>
              <p className="text-xs text-slate-500">{art.category === "Photography" ? "Multiple Sizes" : art.size} | {art.medium}</p>
            </div>
            {art.isSold ? (
              <span className="font-bold text-stone-400">SOLD</span>
            ) : (
              <span className="font-bold text-[#2A0845]">£{art.category === "Photography" ? photoPrices[photoSize] : art.price}{art.category === "Photography" && "+"}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}