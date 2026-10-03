import React, { useState } from "react";
import { Share2, CheckCircle, Plus, X, ZoomIn, Sparkles } from "lucide-react";

// Parse size text (e.g. "1m x 1m", "60cm x 70cm", "100x100") to width and height in cm
function parseSizeToCm(sizeString: string): { width: number; height: number } {
  const defaultSize = { width: 100, height: 100 }; // default 1m x 1m fallback
  if (!sizeString) return defaultSize;
  
  try {
    const clean = sizeString.toLowerCase().replace(/\s+/g, '');
    const parts = clean.split(/x|by|\*|,/);
    
    const parseDimension = (dimStr: string): number | null => {
      const match = dimStr.match(/([\d.]+)(m|cm|mm|meter|meters)?/);
      if (!match) return null;
      const val = parseFloat(match[1]);
      const unit = match[2] || 'cm';
      if (unit.startsWith('m')) {
        return val * 100; // meters to cm
      } else if (unit === 'mm') {
        return val / 10; // mm to cm
      }
      return val; // cm
    };

    if (parts.length >= 2) {
      const wVal = parseDimension(parts[0]);
      const hVal = parseDimension(parts[1]);
      if (wVal && hVal) {
        return { width: wVal, height: hVal };
      }
    } else if (parts.length === 1) {
      const val = parseDimension(parts[0]);
      if (val) {
        return { width: val, height: val };
      }
    }
  } catch (err) {
    console.error("Error parsing size:", err);
  }
  
  return defaultSize;
}

// Get physical width & height in cm of active artwork / print selection
function getArtworkDimensions(artwork: any, activeSizeForPhoto: string): { width: number; height: number } {
  if (artwork.category === "Photography") {
    const photoSizeMap: Record<string, { width: number; height: number }> = {
      "A4 Print": { width: 21, height: 29.7 },
      "A3 Print": { width: 29.7, height: 42 },
      "A2 Print": { width: 42, height: 59.4 },
      "50x70cm Print": { width: 50, height: 70 },
      "A1 Print": { width: 59.4, height: 84.1 }
    };
    return photoSizeMap[activeSizeForPhoto] || { width: 30, height: 40 };
  }

  if (artwork.widthCm && artwork.heightCm) {
    const w = parseFloat(artwork.widthCm);
    const h = parseFloat(artwork.heightCm);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      return { width: w, height: h };
    }
  }
  
  return parseSizeToCm(artwork.size);
}

// Generates frame styles (color, wood grain, gold gradient, shadows) dynamically based on inputs
function getFrameStyles(chosenFrame: string, frameStyle: string, frameWidthCm: number, totalWidthCm: number) {
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

export default function ArtworkDetailView({
  selectedArtwork,
  chosenFrame,
  setChosenFrame,
  handleSmartShare,
  handleAddToBasket,
  curationNotes
}: any) {
  const [isMagnified, setIsMagnified] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<"main" | "secondary">("main");
  const [frameStyle, setFrameStyle] = useState<"minimalist" | "classic">("minimalist");
  const [frameWidth, setFrameWidth] = useState<number>(2.0);
  if (!selectedArtwork) return null;

  const displayPrice = selectedArtwork.price;
  const postageCost = selectedArtwork.isSold ? 'N/A' : "Shipping calculated at checkout";

  // Get physical width & height in cm of active artwork
  const artworkCm = getArtworkDimensions(selectedArtwork, "");
  
  // Calculate total dimension including frame
  const frameWidthVal = chosenFrame !== 'None' ? frameWidth : 0;
  const totalWidthCm = artworkCm.width + (frameWidthVal * 2);
  const totalHeightCm = artworkCm.height + (frameWidthVal * 2);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 animate-in zoom-in-95 duration-200 w-full max-w-6xl mx-auto px-2 md:px-6 mb-8">
        {/* LEFT COLUMN: IMAGE AND FRAMING */}
        <div className="flex-1 flex flex-col space-y-4 min-w-0">
          <div className="bg-white p-0 sm:p-4 rounded-none sm:rounded-xl border-x-0 sm:border border-stone-200 shadow-sm relative">
            {/* TAB 1: ARTWORK DETAIL IMAGE VIEW (WITH OPTIONAL CAROUSEL) */}
            <div className="mb-4">
              <div 
                className={`bg-stone-50 rounded-none sm:rounded-lg p-4 flex justify-center items-center min-h-[45vh] sm:min-h-[350px] relative overflow-hidden group ${currentSlide === "main" ? "cursor-pointer" : ""}`}
                onClick={() => currentSlide === "main" && setIsMagnified(true)}
              >
                {currentSlide === "main" ? (
                  /* Outer Frame Wrapper for Close-up */
                  <div 
                    className="relative transition-all duration-300 shadow-2xl mx-auto"
                    style={{
                      aspectRatio: `${totalWidthCm} / ${totalHeightCm}`,
                      width: '100%',
                      maxWidth: `min(100%, calc(55vh * ${totalWidthCm / totalHeightCm}))`,
                      maxHeight: '55vh',
                      ...getFrameStyles(chosenFrame, frameStyle, frameWidth, 60),
                      boxShadow: chosenFrame !== 'None' ? `0 ${8 + frameWidth * 2}px ${16 + frameWidth * 4}px rgba(0,0,0,0.3)` : '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Matte Wrapper */}
                    <div 
                      className="absolute transition-all duration-300"
                      style={{
                        top: `${chosenFrame !== 'None' ? (frameWidth / totalHeightCm) * 100 : 0}%`,
                        bottom: `${chosenFrame !== 'None' ? (frameWidth / totalHeightCm) * 100 : 0}%`,
                        left: `${chosenFrame !== 'None' ? (frameWidth / totalWidthCm) * 100 : 0}%`,
                        right: `${chosenFrame !== 'None' ? (frameWidth / totalWidthCm) * 100 : 0}%`,
                        backgroundColor: chosenFrame !== 'None' ? '#fbfbf9' : 'transparent',
                        boxShadow: 'none'
                      }}
                    ></div>

                    {/* Artwork Image */}
                    <div
                      className="absolute transition-all duration-300"
                      style={{
                        top: `${(chosenFrame !== 'None' ? frameWidth : 0) / totalHeightCm * 100}%`,
                        bottom: `${(chosenFrame !== 'None' ? frameWidth : 0) / totalHeightCm * 100}%`,
                        left: `${(chosenFrame !== 'None' ? frameWidth : 0) / totalWidthCm * 100}%`,
                        right: `${(chosenFrame !== 'None' ? frameWidth : 0) / totalWidthCm * 100}%`,
                      }}
                    >
                      <img 
                        src={selectedArtwork.src} 
                        alt={selectedArtwork.title} 
                        className="w-full h-full object-contain transition-all duration-300 select-none block"
                        style={{
                          boxShadow: chosenFrame === 'None' ? '0 1px 4px rgba(0,0,0,0.15)' : 'none'
                        }}
                        onContextMenu={e => e.preventDefault()} 
                        draggable={false} 
                      />
                    </div>
                  </div>
                ) : (
                  /* Raw Secondary Image without framing */
                  <img 
                    src={selectedArtwork.secondarySrc} 
                    alt={selectedArtwork.title} 
                    className="max-w-full max-h-[600px] landscape:max-h-[75vh] w-auto h-auto transition-all duration-300 select-none shadow-md" 
                    style={{ WebkitTouchCallout: 'none' }} 
                    onContextMenu={e => e.preventDefault()} 
                    draggable={false} 
                  />
                )}
                
                {currentSlide === "main" && (
                  <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-5 h-5 text-slate-800" />
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15] select-none overflow-hidden">
                  <span className="text-xl md:text-3xl font-black rotate-[-35deg] text-stone-600 whitespace-nowrap mix-blend-multiply tracking-widest">MITCHELL WARD STUDIOS</span>
                </div>
              </div>

              {/* SLIDESHOW DOTS/TOGGLES */}
              {selectedArtwork.secondarySrc && (
                <div className="flex gap-2 justify-center mt-3">
                  <button 
                    onClick={() => setCurrentSlide("main")} 
                    className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all ${currentSlide === "main" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-stone-200"}`}
                  >
                    Close-up View
                  </button>
                  <button 
                    onClick={() => setCurrentSlide("secondary")} 
                    className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all ${currentSlide === "secondary" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-stone-200"}`}
                  >
                    Room Layout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS AND BASKET */}
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

          <p className="text-xs text-[#2A0845] font-bold mb-4">{selectedArtwork.size} | {selectedArtwork.medium}</p>

          <div className="mb-4 bg-stone-50 p-3 rounded-lg border border-stone-100">
            <label className="text-[10px] font-bold text-slate-500 block mb-2 uppercase tracking-wider">Virtual Framing Options:</label>
            
            {/* Frame Color */}
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

            {chosenFrame !== 'None' && (
              <div className="bg-white p-2.5 rounded-md border border-stone-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Profile:</span>
                  <div className="bg-stone-50 py-1 px-2 rounded-md border border-stone-100 text-[8px] font-black text-slate-600 text-center uppercase tracking-widest">
                    Floating Frame
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Thickness:</span>
                    <span className="text-[9px] font-mono font-bold text-slate-400">{frameWidth}cm</span>
                  </div>
                  <input type="range" min="0.5" max="2.5" step="0.5" value={frameWidth} onChange={e => setFrameWidth(parseFloat(e.target.value))} className="w-full accent-[#2A0845] cursor-pointer h-1" />
                </div>
              </div>
            )}
            
            <p className="text-[8px] text-slate-400 uppercase tracking-wider mt-2 leading-tight">
              * Preview only. Scale is approximate.
            </p>
          </div>

            {selectedArtwork.isSold ? (
              <div className="mt-2 w-full bg-stone-200 text-stone-500 py-3 rounded-xl font-black tracking-widest flex items-center justify-center gap-2 text-sm"><CheckCircle className="w-4 h-4" /> SOLD OUT</div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 border-t border-stone-100 pt-4">
                <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start">
                  <span className="font-black text-2xl text-[#2A0845] leading-none mb-1">£{displayPrice}</span>
                  <span className="text-[10px] font-bold text-slate-400 text-center sm:text-left">{postageCost}</span>
                </div>
                
                <button onClick={() => handleAddToBasket()} className="w-full sm:flex-1 bg-[#2A0845] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#5C0A96] active:scale-95 transition-all"><Plus className="w-5 h-5" /> ADD TO BASKET</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- THE FULL SCREEN PROJECTOR --- */}
      {isMagnified && (
        <div className="fixed top-0 left-0 w-full h-[100dvh] z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200 backdrop-blur-md">
          
          <button 
            onClick={() => setIsMagnified(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 sm:p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-[101]"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="relative w-full h-[100dvh] p-4 flex items-center justify-center overflow-hidden" onClick={() => setIsMagnified(false)}>
            <img 
              src={currentSlide === "main" ? selectedArtwork.src : selectedArtwork.secondarySrc} 
              alt={selectedArtwork.title} 
              className="max-w-full max-h-full object-contain select-none z-10"
              draggable={false}
              onContextMenu={e => e.preventDefault()} 
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.25] select-none overflow-hidden z-20">
              <span className="text-3xl md:text-5xl font-black rotate-[-35deg] text-white whitespace-nowrap tracking-widest drop-shadow-md">© MITCHELL WARD STUDIOS</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
