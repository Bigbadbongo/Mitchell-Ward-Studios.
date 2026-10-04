import React, { useState, useEffect } from "react";
import { Share2, CheckCircle, Plus, X, ZoomIn, FileDown, Sparkles } from "lucide-react";

// Generates frame styles (color, wood grain, gold gradient, shadows) dynamically
function getFrameStyles(chosenFrame: string, frameStyle: string) {
  if (chosenFrame === 'None') return {};
  
  let background = '#151515';
  let border = '1px solid rgba(255,255,255,0.08)';
  let backgroundImage = 'none';
  
  if (chosenFrame === 'Black') {
    background = '#151515';
    border = '1px solid #000';
  } else if (chosenFrame === 'White') {
    background = '#fcfcfc';
    border = '1px solid #e5e5e5';
  } else if (chosenFrame === 'Pine') {
    background = '#dcb07a';
    backgroundImage = 'linear-gradient(135deg, #e4be8c 0%, #cb9d64 100%)';
    border = '1px solid #b2854e';
  } else if (chosenFrame === 'Gold') {
    background = '#d4af37';
    backgroundImage = 'linear-gradient(135deg, #f3e098 0%, #b8860b 50%, #e6ca65 100%)';
    border = '1px solid #996515';
  } else if (chosenFrame === 'Oak') {
    background = '#583e26';
    backgroundImage = 'linear-gradient(135deg, #6c4b2f 0%, #46301d 100%)';
    border = '1px solid #302012';
  }
  
  return {
    background,
    backgroundImage,
    border,
    boxSizing: 'border-box' as const,
    boxShadow: frameStyle === 'classic' 
      ? 'inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.4)' 
      : 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -1px 1px rgba(0,0,0,0.2)'
  };
}

export default function PhotographyDetailView({
  selectedArtwork,
  chosenFrame,
  setChosenFrame,
  photoSize,
  setPhotoSize,
  photoPrices,
  handleSmartShare,
  handleAddToBasket,
  curationNotes
}: any) {
  const [isMagnified, setIsMagnified] = useState(false);
  const [frameStyle, setFrameStyle] = useState<"minimalist" | "classic">("minimalist");
  const [frameWidth, setFrameWidth] = useState<number>(2.0);
  const [hasMatte, setHasMatte] = useState<boolean>(false);
  const [matteWidth, setMatteWidth] = useState<number>(5.0);
  const [includeDigitalCopy, setIncludeDigitalCopy] = useState(false);

  // Reset digital copy addon when size changes
  useEffect(() => {
    setIncludeDigitalCopy(false);
  }, [photoSize]);

  if (!selectedArtwork) return null;

  const isDigitalStandalone = photoSize === "Digital Download";
  const hasDigitalOption = !!selectedArtwork.highResStoragePath;

  // Base price for the selected size
  const basePrice = photoPrices[photoSize] || 0;
  // Add-on cost (bundled price)
  const addonCost = (includeDigitalCopy && !isDigitalStandalone) ? 10 : 0;
  const displayPrice = basePrice + addonCost;

  const postageCost = selectedArtwork.isSold 
    ? 'N/A' 
    : isDigitalStandalone
      ? 'Instant Email Delivery' 
      : "£5.95 Flat Rate Shipping";

  const activeFrame = isDigitalStandalone ? 'None' : chosenFrame;
  const activeMatte = isDigitalStandalone ? false : hasMatte;

  const framePixels = activeFrame !== 'None' ? frameWidth * 4 : 0;
  const mattePixels = activeMatte ? matteWidth * 4 : 0;
  
  const FramedComposite = ({ maxH }: { maxH: string }) => (
    <div 
      className="inline-block transition-all duration-300 shadow-2xl relative"
      style={{
        padding: `${framePixels}px`,
        ...getFrameStyles(activeFrame, frameStyle),
        boxShadow: activeFrame !== 'None' ? `0 ${8 + frameWidth * 2}px ${16 + frameWidth * 4}px rgba(0,0,0,0.3)` : '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <div 
        className="transition-all duration-300 flex items-center justify-center relative"
        style={{
          padding: `${mattePixels}px`,
          backgroundColor: activeMatte || activeFrame !== 'None' ? '#fbfbf9' : 'transparent',
          boxShadow: activeMatte ? 'inset 0 1px 3px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <img 
          src={selectedArtwork.src} 
          alt={selectedArtwork.title} 
          className="transition-all duration-300 select-none block w-full h-auto object-contain"
          style={{
            maxHeight: maxH,
            maxWidth: '100%',
            boxShadow: activeMatte ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
          }}
          onContextMenu={e => e.preventDefault()} 
          draggable={false} 
        />
        {activeFrame !== 'None' && (
           <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-gradient-to-tr from-white/0 via-white/5 to-white/0"></div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 animate-in zoom-in-95 duration-200 w-full max-w-6xl mx-auto px-1 sm:px-2 md:px-6 mb-8">
        <div className="flex-1 flex flex-col space-y-4 min-w-0">
          <div className="bg-white p-1.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm relative">
            <div className="mb-3 sm:mb-4">
              <div
                className="bg-stone-50 rounded-xl p-2 sm:p-4 flex justify-center items-center min-h-[50vh] sm:min-h-[380px] relative overflow-hidden group cursor-pointer"
                onClick={() => setIsMagnified(true)}
              >
                <FramedComposite maxH="68vh" />
                <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20">
                  <ZoomIn className="w-5 h-5 text-slate-800" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15] select-none overflow-hidden z-10">
                  <span className="text-xl md:text-3xl font-black rotate-[-35deg] text-stone-600 whitespace-nowrap mix-blend-multiply tracking-widest">MITCHELL WARD STUDIOS</span>
                </div>
              </div>
            </div>

            {!isDigitalStandalone && (
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60 space-y-3 mb-4 text-[10px] shadow-sm">
                <div>
                  <span className="font-bold text-slate-500 uppercase block mb-2 tracking-wider">Virtual Framing Options:</span>
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {['None', 'Black', 'White', 'Pine', 'Oak', 'Gold'].map(f => (
                      <button
                        key={f}
                        onClick={() => setChosenFrame(f)}
                        className={"px-2.5 py-1 text-[9px] font-bold rounded-md border transition-all " + (chosenFrame === f ? 'bg-[#2A0845] text-white border-[#2A0845] shadow-sm' : 'bg-white text-slate-500 border-stone-200 hover:border-slate-300')}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {chosenFrame !== 'None' && (
                  <div className="bg-white p-2.5 rounded-md border border-stone-100 mb-3 space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Profile:</span>
                       <div className="flex gap-1 bg-stone-50 p-0.5 rounded-md border border-stone-100">
                        {['minimalist', 'classic'].map(s => (
                          <button
                            key={s}
                            onClick={() => setFrameStyle(s as any)}
                            className={`px-2 py-0.5 rounded-sm text-[8px] font-black capitalize transition-all ${frameStyle === s ? "bg-white text-slate-900 shadow-sm border border-stone-200" : "text-slate-400 hover:text-slate-600"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Thickness:</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400">{frameWidth}cm</span>
                      </div>
                      <input type="range" min="1.0" max="4.0" step="0.5" value={frameWidth} onChange={e => setFrameWidth(parseFloat(e.target.value))} className="w-full accent-[#2A0845] cursor-pointer h-1" />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center bg-white p-2.5 rounded-md border border-stone-100">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Matte Border:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={hasMatte} onChange={e => setHasMatte(e.target.checked)} className="sr-only peer" />
                    <div className="w-6 h-3 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-[#2A0845]"></div>
                  </label>
                </div>
                
                {hasMatte && (
                  <div className="bg-white p-2.5 rounded-md border border-stone-100 border-t-0 rounded-t-none mt-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Matte Width:</span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">{matteWidth}cm</span>
                    </div>
                    <input type="range" min="2.0" max="10.0" step="0.5" value={matteWidth} onChange={e => setMatteWidth(parseFloat(e.target.value))} className="w-full accent-[#2A0845] cursor-pointer h-1" />
                  </div>
                )}
                
                <p className="text-[8px] text-slate-400 uppercase tracking-wider mt-2 leading-tight">
                  * Preview only. Prints fulfilled to standard edge ratios.
                </p>
              </div>
            )}

            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-wider mb-2">
              * Frame mockup is for visualization purposes only.
              <br/>Prints are fulfilled physically to standard edge ratios.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[400px] xl:w-[480px] shrink-0">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm sticky top-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className={"text-xl font-black pr-2 " + (selectedArtwork.isSold ? 'text-stone-500' : 'text-slate-900')}>{selectedArtwork.title}</h3>
              <button onClick={handleSmartShare} className="p-2 bg-stone-100 text-slate-600 rounded-full hover:bg-[#2A0845] hover:text-white transition-colors"><Share2 className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-slate-600 mb-4 bg-stone-50 p-3 rounded-lg border border-stone-100 leading-relaxed">{selectedArtwork.description}</p>

            {curationNotes && (
              <div className="mb-4 bg-gradient-to-br from-[#2A0845]/5 via-[#2A0845]/10 to-transparent p-3.5 rounded-xl border border-[#2A0845]/20 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 mb-1.5 text-[#2A0845]">
                  <Sparkles className="w-4 h-4 animate-pulse text-[#2A0845]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Curator's Recommendation</span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{curationNotes}"
                </p>
              </div>
            )}

            <div className="mb-4 bg-stone-50 p-3 rounded-lg border border-stone-100">
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Select Print Size (Pricing):</label>
              <select value={photoSize} onChange={(e) => setPhotoSize(e.target.value)} className="w-full p-2 rounded-md border border-stone-200 text-sm font-bold text-[#2A0845] bg-white outline-none">
                {Object.entries(photoPrices)
                  .filter(([size]) => size !== "Digital Download" || hasDigitalOption)
                  .map(([size, price]) => <option key={size} value={size}>{size} - £{price as any}</option>)}
              </select>
            </div>

            {hasDigitalOption && !isDigitalStandalone && (
              <div className="mb-4 bg-stone-50 p-3 rounded-lg border border-stone-100 transition-all">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-2.5 pr-2">
                    <div className="p-1.5 bg-[#2A0845]/10 rounded-md text-[#2A0845] shrink-0">
                      <FileDown className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block leading-tight">
                        Include High-Res Digital Download
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        Original high-resolution file for instant archival (+£10)
                      </span>
                    </div>
                  </div>
                  <div className="relative inline-flex items-center shrink-0">
                    <input 
                      type="checkbox" 
                      checked={includeDigitalCopy} 
                      onChange={(e) => setIncludeDigitalCopy(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-4 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#2A0845]"></div>
                  </div>
                </label>
              </div>
            )}

            {selectedArtwork.isSold ? (
              <div className="mt-2 w-full bg-stone-200 text-stone-500 py-3 rounded-xl font-black tracking-widest flex items-center justify-center gap-2 text-sm"><CheckCircle className="w-4 h-4" /> SOLD OUT</div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 border-t border-stone-100 pt-4">
                <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start">
                  <span className="font-black text-2xl text-[#2A0845] leading-none mb-1">£{displayPrice}</span>
                  <span className="text-[10px] font-bold text-slate-400 text-center sm:text-left">{postageCost}</span>
                </div>
                <button
                  onClick={() => handleAddToBasket(includeDigitalCopy)}
                  className="w-full sm:flex-1 bg-[#2A0845] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#5C0A96] active:scale-95 transition-all"
                >
                  <Plus className="w-5 h-5" /> ADD TO BASKET
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMagnified && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200 backdrop-blur-md">
          <button 
            onClick={() => setIsMagnified(false)}
            className="absolute top-6 right-6 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-[101]"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full h-full p-4 flex items-center justify-center overflow-hidden" onClick={() => setIsMagnified(false)}>
            <FramedComposite maxH="85vh" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.25] select-none overflow-hidden z-20">
              <span className="text-3xl md:text-5xl font-black rotate-[-35deg] text-white whitespace-nowrap tracking-widest drop-shadow-md">© MITCHELL WARD STUDIOS</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
