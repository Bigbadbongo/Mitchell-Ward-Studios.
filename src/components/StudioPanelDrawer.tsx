import React from "react";
import { X, Instagram, Facebook, Globe, Mail, MapPin, Palette } from "lucide-react";
import { useUI } from "../context/UIContext";
import { useInventory } from "../context/InventoryContext";

export default function StudioPanelDrawer() {
  const { isStudioPanelOpen, setIsStudioPanelOpen } = useUI();
  const { studioBio, studioEmail } = useInventory();

  if (!isStudioPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsStudioPanelOpen(false)}></div>
      <div className="bg-[#fafafa] h-[92%] md:h-auto md:max-h-[92vh] w-full md:w-[600px] md:max-w-3xl rounded-t-3xl md:rounded-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 overflow-hidden relative z-10">
        
        {/* Floating Close Button */}
        <button 
          onClick={() => setIsStudioPanelOpen(false)} 
          className="absolute top-6 right-6 z-20 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors shadow-lg border border-white/10"
        >
          <X className="w-5 h-5"/>
        </button>

        {/* Cinematic Header Image */}
        <div className="h-64 sm:h-80 w-full relative shrink-0">
          <img 
            src="/artist_studio.png" 
            alt="Studio Space" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-black/20 to-black/40"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 pb-6 flex items-end justify-between">
            <div>
              <h2 className="font-black text-4xl tracking-tighter text-[#2A0845] drop-shadow-sm leading-none bg-clip-text text-transparent bg-gradient-to-br from-[#2A0845] to-[#430d6e]">
                Mitchell<br/>Ward
              </h2>
              <p className="text-sm font-black uppercase tracking-widest text-slate-500 mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Studio & Gallery
              </p>
            </div>
            
            {/* Avatar Profile Bubble */}
            <div className="w-20 h-20 rounded-full border-4 border-[#fafafa] shadow-xl overflow-hidden bg-white shrink-0 flex items-center justify-center -mb-2">
              <span className="font-black text-3xl text-[#2A0845]">MW</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-10">
          <div className="px-6 space-y-8">
            
            {/* Biography Section */}
            <div className="pt-2">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" /> About the Artist
              </h3>
              <p className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-line font-medium px-2 border-l-2 border-[#2A0845]">
                {studioBio}
              </p>
            </div>

            {/* Social Banners (Large & Interactive) */}
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3">Connect & Follow</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 p-5 bg-white rounded-2xl shadow-sm border border-stone-200 hover:border-[#2A0845] hover:shadow-md transition-all group active:scale-95">
                  <Instagram className="w-6 h-6 text-slate-400 group-hover:text-[#E1306C] transition-colors" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-[#2A0845]">Instagram</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-5 bg-white rounded-2xl shadow-sm border border-stone-200 hover:border-[#2A0845] hover:shadow-md transition-all group active:scale-95">
                  <Globe className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-[#2A0845]">Website</span>
                </button>
              </div>
            </div>

            {/* Contact Action Banner */}
            <div className="bg-[#2A0845] rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <h3 className="font-black text-white text-xl mb-1">Commission a Piece</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-5 max-w-[85%]">
                For bespoke canvases, custom prints, or commercial display inquiries, let's discuss your vision.
              </p>
              
              <a 
                href={`mailto:${studioEmail}`} 
                className="inline-flex items-center gap-2 bg-white text-[#2A0845] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors shadow-sm active:scale-95"
              >
                <Mail className="w-4 h-4" /> Message Studio
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}