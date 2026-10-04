import React from "react";
import { X, Instagram, Globe, Mail, MapPin, Palette } from "lucide-react";
import { Browser } from "@capacitor/browser";
import { useUI } from "../context/UIContext";

interface StudioPanelDrawerProps {
  isStudioPanelOpen?: boolean;
  setIsStudioPanelOpen?: (open: boolean) => void;
  studioBio?: string;
  studioEmail?: string;
  studioInstagram?: string;
  studioWebsite?: string;
}

export default function StudioPanelDrawer({
  isStudioPanelOpen: propIsOpen,
  setIsStudioPanelOpen: propSetIsOpen,
  studioBio: propBio,
  studioEmail: propEmail,
  studioInstagram: propInstagram,
  studioWebsite: propWebsite,
}: StudioPanelDrawerProps) {
  const ui = useUI();

  const isOpen = propIsOpen !== undefined ? propIsOpen : ui.isStudioPanelOpen;
  const setIsOpen = propSetIsOpen || ui.setIsStudioPanelOpen;

  if (!isOpen) return null;

  const handleOpenUrl = async (rawUrl: string) => {
    if (!rawUrl) return;
    let url = rawUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    try {
      if (typeof window !== "undefined" && (window as any).Capacitor) {
        await Browser.open({ url });
      } else {
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("Error opening URL:", err);
      window.open(url, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      <div className="bg-[#fafafa] h-[92%] md:h-auto md:max-h-[92vh] w-full md:w-[600px] md:max-w-3xl rounded-t-3xl md:rounded-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 overflow-hidden relative z-10">
        
        {/* Floating Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
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
                {propBio || "Welcome to Mitchell Ward Studios."}
              </p>
            </div>

            {/* Social Banners (Large & Interactive) */}
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3">Connect & Follow</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => propInstagram && handleOpenUrl(propInstagram)}
                  disabled={!propInstagram}
                  className={`flex flex-col items-center justify-center gap-2 p-5 bg-white rounded-2xl shadow-sm border border-stone-200 transition-all group active:scale-95 ${propInstagram ? "hover:border-[#2A0845] hover:shadow-md cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                >
                  <Instagram className={`w-6 h-6 transition-colors ${propInstagram ? "text-slate-400 group-hover:text-[#E1306C]" : "text-slate-300"}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${propInstagram ? "text-slate-500 group-hover:text-[#2A0845]" : "text-slate-300"}`}>
                    {propInstagram ? "Instagram" : "No Instagram"}
                  </span>
                </button>
                <button
                  onClick={() => propWebsite && handleOpenUrl(propWebsite)}
                  disabled={!propWebsite}
                  className={`flex flex-col items-center justify-center gap-2 p-5 bg-white rounded-2xl shadow-sm border border-stone-200 transition-all group active:scale-95 ${propWebsite ? "hover:border-[#2A0845] hover:shadow-md cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                >
                  <Globe className={`w-6 h-6 transition-colors ${propWebsite ? "text-slate-400 group-hover:text-blue-500" : "text-slate-300"}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${propWebsite ? "text-slate-500 group-hover:text-[#2A0845]" : "text-slate-300"}`}>
                    {propWebsite ? "Website" : "No Website"}
                  </span>
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
                href={`mailto:${propEmail || "mitchellwardstudios@gmail.com"}`}
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
