import React, { useState } from "react";
import { Share2, CheckCircle, Plus, X, ZoomIn } from "lucide-react";
import useStudioEngine from "./useStudioEngine";

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

export default function PhotographyDetailView() {
  const {
    selectedArtwork,
    chosenFrame,
    setChosenFrame,
    photoSize,
    setPhotoSize,
    photoPrices,
    handleSmartShare,
    handleAddToBasket
  } = useStudioEngine();
  const [isMagnified, setIsMagnified] = useState(false);
  const [frameStyle, setFrameStyle] = useState<"minimalist" | "classic">("minimalist");
  const [frameWidth, setFrameWidth] = useState<number>(2.0);
  const [hasMatte, setHasMatte] = useState<boolean>(true);
  const [matteWidth, setMatteWidth] = useState<number>(5.0);

  if (!selectedArtwork) return null;

  const displayPrice = photoPrices[photoSize];
  const postageCost = selectedArtwork.isSold ? 'N/A' : "£5.95 Flat Rate Shipping";

  // Calculate pixel widths for CSS padding based on cm (approximate visual scale)
  const framePixels = chosenFrame !== 'None' ? frameWidth * 4 : 0;
  const mattePixels = hasMatte ? matteWidth * 4 : 0;
  
  // Reusable composite component for rendering the framed photo cleanly
  const FramedComposite = ({ maxH }: { maxH: string }) => (
    <div 
      className="inline-block transition-all duration-300 shadow-2xl relative"
      style={{
        padding: `${framePixels}px`,
        ...getFrameStyles(chosenFrame, frameStyle),
        boxShadow: chosenFrame !== 'None' ? `0 ${8 + frameWidth * 2}px ${16 + frameWidth * 4}px rgba(0,0,0,0.3)` : '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <div 
        className="transition-all duration-300 flex items-center justify-center relative"
        style={{
          padding: `${mattePixels}px`,
          backgroundColor: hasMatte || chosenFrame !== 'None' ? '#fbfbf9' : 'transparent',
          boxShadow: hasMatte ? 'inset 0 1px 3px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <img 
          src={selectedArtwork.src} 
          alt={selectedArtwork.title} 
          className="transition-all duration-300 select-none block"
          style={{
            maxHeight: maxH,
            maxWidth: '100%',
            objectFit: 'contain',
            boxShadow: hasMatte ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
          }}
          onContextMenu={e => e.preventDefault()} 
          draggable={false} 
        />
        {/* Subtle glass reflection overlay */}
        {chosenFrame !== 'None' && (
           <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-gradient-to-tr from-white/0 via-white/5 to-white/0"></div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 animate-in zoom-in-95 duration-200 w-full max-w-6xl mx-auto px-2 md:px-6 mb-8">
        {/* LEFT COLUMN: IMAGE AND FRAMING */}
        <div className="flex-1 flex flex-col space-y-4 min-w-0">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm relative">
            
            {/* PHOTO COMPOSITE VIEW */}
            <div className="mb-4">
            <div 
              className="bg-stone-50 rounded-lg p-2 md:p-4 flex justify-center items-center min-h-[350px] relative overflow-hidden group cursor-pointer"
              onClick={() => setIsMagnified(true)}
            >
              <FramedComposite maxH="60vh" />
              
              <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20">
                <ZoomIn className="w-5 h-5 text-slate-800" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15] select-none overflow-hidden z-10">
                <span className="text-xl md:text-3xl font-black rotate-[-35deg] text-stone-600 whitespace-nowrap mix-blend-multiply tracking-widest">MITCHELL WARD STUDIOS</span>
              </div>
            </div>
          </div>

          {/* ADVANCED DYNAMIC FRAMING CONTROLS */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60 space-y-3 mb-4 text-[10px] shadow-sm">
            <div>
              <span className="font-bold text-slate-500 uppercase block mb-1.5">Frame Selection:</span>
              <div className="flex gap-1.5 flex-wrap">
                {['None', 'Black', 'White', 'Pine', 'Oak', 'Gold'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setChosenFrame(f)} 
                    className={"px-3 py-1.5 text-[9px] font-bold rounded-lg border transition-all " + (chosenFrame === f ? 'bg-[#2A0845] text-white border-[#2A0845] shadow-sm' : 'bg-white text-slate-500 border-stone-200 hover:border-slate-300')}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {chosenFrame !== 'None' && (
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200/50">
                <div>
                  <span className="font-bold text-slate-500 uppercase block mb-1">Frame Profile:</span>
                  <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200/20">
                    {['minimalist', 'classic'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFrameStyle(s as any)}
                        className={`flex-1 py-1 rounded-md text-[8px] font-black capitalize transition-all text-center ${frameStyle === s ? "bg-white text-slate-900 shadow-sm border border-stone-200" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-500 uppercase">Frame Thickness:</span>
                    <span className="font-mono text-slate-400 font-bold">{frameWidth}cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.0" 
                    max="4.0" 
                    step="0.5" 
                    value={frameWidth} 
                    onChange={e => setFrameWidth(parseFloat(e.target.value))}
                    className="w-full accent-[#2A0845] cursor-pointer"
                  />
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-stone-200/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase">Matte Border (Passepartout):</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={hasMatte} 
                    onChange={e => setHasMatte(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-7 h-4 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2A0845]"></div>
                </label>
              </div>
              
              {hasMatte && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-400 uppercase">Matte Width:</span>
                    <span className="font-mono text-slate-400 font-bold">{matteWidth}cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="2.0" 
                    max="10.0" 
                    step="0.5" 
                    value={matteWidth} 
                    onChange={e => setMatteWidth(parseFloat(e.target.value))}
                    className="w-full accent-[#2A0845] cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* DISCLAIMER */}
          <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-wider mb-2">
            * Frame mockup is for visualization purposes only. 
            <br/>Prints are fulfilled physically to standard edge ratios.
          </p>
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
          
          {/* PRINT SIZE SELECTION */}
          <div className="mb-4 bg-stone-50 p-3 rounded-lg border border-stone-100">
            <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Select Print Size (Pricing):</label>
            <select value={photoSize} onChange={(e) => setPhotoSize(e.target.value)} className="w-full p-2 rounded-md border border-stone-200 text-sm font-bold text-[#2A0845] bg-white outline-none">
              {Object.entries(photoPrices).map(([size, price]) => <option key={size} value={size}>{size} - £{price as any}</option>)}
            </select>
          </div>

            {selectedArtwork.isSold ? (
              <div className="mt-2 w-full bg-stone-200 text-stone-500 py-3 rounded-xl font-black tracking-widest flex items-center justify-center gap-2 text-sm"><CheckCircle className="w-4 h-4" /> SOLD OUT</div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 border-t border-stone-100 pt-4">
                <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start">
                  <span className="font-black text-2xl text-[#2A0845] leading-none mb-1">£{displayPrice}</span>
                  <span className="text-[10px] font-bold text-slate-400 text-center sm:text-left">{postageCost}</span>
                </div>
                
                <button onClick={handleAddToBasket} className="w-full sm:flex-1 bg-[#2A0845] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#5C0A96] active:scale-95 transition-all"><Plus className="w-5 h-5" /> ADD TO BASKET</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- THE FULL SCREEN PROJECTOR --- */}
      {isMagnified && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200 backdrop-blur-md">
          <button 
            onClick={() => setIsMagnified(false)}
            className="absolute top-6 right-6 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-[101]"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full h-full p-4 flex items-center justify-center overflow-hidden" onClick={() => setIsMagnified(false)}>
            {/* Show the fully framed composite rather than just the image */}
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