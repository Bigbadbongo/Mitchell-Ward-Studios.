import React from "react";

// Helper function to parse physical size (same logic as detail view)
function getArtworkDimensions(artwork: any): { width: number; height: number } {
  if (artwork.widthCm && artwork.heightCm) {
    return { width: parseFloat(artwork.widthCm), height: parseFloat(artwork.heightCm) };
  }

  if (artwork.aspectRatio && typeof artwork.aspectRatio === "number" && artwork.aspectRatio > 0) {
    return { width: artwork.aspectRatio * 100, height: 100 };
  }

  const defaultSize = { width: 100, height: 100 };
  // Attempt to parse from size string if dedicated fields are missing
  try {
    const sizeStr = String(artwork.size || "").toLowerCase().replace(/\s+/g, '');
    const parts = sizeStr.split(/x|by|\*|,/);
    const parseDim = (s: string) => {
      const m = s.match(/([\d.]+)(m|cm)?/);
      if (!m) return null;
      let val = parseFloat(m[1]);
      if (m[2] === 'm') val *= 100;
      return val;
    };
    if (parts.length >= 2) {
      const w = parseDim(parts[0]);
      const h = parseDim(parts[1]);
      if (w && h) return { width: w, height: h };
    }
  } catch (e) {}
  return defaultSize;
}

export default function ArtworkGridView({
  filteredArtworks,
  setSelectedArtwork,
  setPhotoSize,
  setMenuState,
  photoPrices,
  photoSize,
  isLoading
}: any) {
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
      ) : filteredArtworks.map((art: any) => {
        const dims = getArtworkDimensions(art);
        const ratio = dims.width / dims.height;

        return (
          <button
            key={art.id}
            onClick={() => {
              setSelectedArtwork(art);
              if(art.category === "Photography") setPhotoSize("A3 Print");
              setMenuState("detail");
            }}
            className={"w-full text-left bg-white rounded-xl border p-0 sm:p-3 shadow-sm cursor-pointer transition-all " + (art.isSold ? 'border-stone-200 opacity-80' : 'border-stone-200 hover:border-[#2A0845]')}
          >
            <div className="relative bg-stone-50 rounded-lg sm:mb-3 overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[250px] p-4">
               <div
                 className="relative shadow-xl transition-all duration-300"
                 style={{
                   aspectRatio: `${dims.width} / ${dims.height}`,
                   width: '100%',
                   maxWidth: `min(100%, calc(230px * ${ratio}))`,
                   maxHeight: '230px'
                 }}
               >
                 <img
                   src={art.thumbnailSrc || art.src}
                   alt={art.title}
                   loading="lazy"
                   className="w-full h-full object-contain select-none block"
                   style={{ WebkitTouchCallout: 'none' }}
                   onContextMenu={e => e.preventDefault()}
                   draggable={false}
                 />
                 {/* Decorative subtle texture and slight border to match detail page "hero" feel */}
                 <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-black/10 via-transparent to-white/10 mix-blend-multiply border border-black/5"></div>
               </div>

               {art.isSold && (
                 <div className="absolute inset-0 bg-white/40 flex items-center justify-center rounded-lg backdrop-blur-[1px] pointer-events-none z-10">
                   <span className="bg-stone-800 text-white px-3 py-1 font-black tracking-widest uppercase text-sm rounded">Sold</span>
                 </div>
               )}
            </div>

            <div className="flex justify-between items-start p-4 sm:p-0">
              <div>
                <h3 className="font-bold text-slate-800">{art.title}</h3>
                <p className="text-xs text-slate-500">{art.category === "Photography" ? "Multiple Sizes" : art.size} | {art.medium}</p>
              </div>
              {art.isSold ? (
                <span className="font-bold text-stone-400 uppercase text-xs tracking-widest pt-1">Sold Out</span>
              ) : (
                <span className="font-bold text-[#2A0845]">£{art.category === "Photography" ? photoPrices[photoSize] : art.price}{art.category === "Photography" && "+"}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
