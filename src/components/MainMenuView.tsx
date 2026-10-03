import React from "react";
import { Settings, ArrowRight } from "lucide-react";

export default function MainMenuView({
  menuState,
  setActiveCategory,
  setMenuState,
  setIsStudioPanelOpen,
  setIsAdminSettingsOpen,
  isAdmin
}: any) {
  if (menuState !== "main" && menuState !== "admin") return null;

  return (
    <>
      {menuState === "admin" && (
        <div className="flex-1 flex flex-col md:flex-row md:flex-wrap items-center justify-center landscape:justify-start landscape:pt-4 gap-6 w-full max-w-5xl mx-auto animate-in fade-in pb-8 px-4">
          <button onClick={() => { setActiveCategory("Paintings"); setMenuState("admin_collections"); }} className="h-28 w-full md:w-[320px] max-w-[320px] bg-white relative active:scale-95 transition-all flex items-center justify-between rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden px-5 shrink-0 group">
            <div className="flex flex-col items-start gap-1 z-10">
              <span className="font-black text-stone-300 text-xs tracking-widest uppercase">Manage</span>
              <span className="font-black text-[#2A0845] text-xl tracking-widest uppercase">Paintings</span>
            </div>
            <ArrowRight className="w-6 h-6 text-stone-300 group-hover:translate-x-2 transition-transform z-10" />
            <div className="absolute right-0 top-0 w-32 h-full opacity-5 pointer-events-none translate-x-4">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#2A0845" d="M37.5,-73.4C48.6,-68.2,57.5,-57.4,66,-46.3C74.6,-35.3,82.8,-24,84.1,-11.9C85.4,0.3,79.8,13.2,73.5,25.9C67.3,38.5,60.4,50.8,50.7,59.2C40.9,67.6,28.2,72.1,14.7,75.4C1.3,78.7,-12.9,80.7,-25.2,76.5C-37.4,72.3,-47.8,61.8,-57.7,51.3C-67.6,40.7,-77.1,30.1,-82.1,17.4C-87.1,4.7,-87.6,-10.1,-81.4,-21.8C-75.3,-33.4,-62.5,-42.1,-50.3,-46.6C-38,-51.1,-26.3,-51.5,-16,-56.9C-5.8,-62.4,3,-73,14.6,-76.3C26.1,-79.7,37.3,-75.8,37.5,-73.4Z" transform="translate(100 100)"/></svg>
            </div>
          </button>
          <button onClick={() => { setActiveCategory("Photography"); setMenuState("admin_collections"); }} className="h-28 w-full md:w-[320px] max-w-[320px] bg-white relative active:scale-95 transition-all flex items-center justify-between rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden px-5 shrink-0 group">
            <div className="flex flex-col items-start gap-1 z-10">
              <span className="font-black text-stone-300 text-xs tracking-widest uppercase">Manage</span>
              <span className="font-black text-[#2A0845] text-xl tracking-widest uppercase">Photography</span>
            </div>
            <ArrowRight className="w-6 h-6 text-stone-300 group-hover:translate-x-2 transition-transform z-10" />
            <div className="absolute right-0 top-0 w-32 h-full opacity-5 pointer-events-none translate-x-4">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#2A0845" d="M37.5,-73.4C48.6,-68.2,57.5,-57.4,66,-46.3C74.6,-35.3,82.8,-24,84.1,-11.9C85.4,0.3,79.8,13.2,73.5,25.9C67.3,38.5,60.4,50.8,50.7,59.2C40.9,67.6,28.2,72.1,14.7,75.4C1.3,78.7,-12.9,80.7,-25.2,76.5C-37.4,72.3,-47.8,61.8,-57.7,51.3C-67.6,40.7,-77.1,30.1,-82.1,17.4C-87.1,4.7,-87.6,-10.1,-81.4,-21.8C-75.3,-33.4,-62.5,-42.1,-50.3,-46.6C-38,-51.1,-26.3,-51.5,-16,-56.9C-5.8,-62.4,3,-73,14.6,-76.3C26.1,-79.7,37.3,-75.8,37.5,-73.4Z" transform="translate(100 100)"/></svg>
            </div>
          </button>
          
          <button onClick={() => setMenuState("orders")} className="h-20 w-full md:w-[320px] max-w-[320px] bg-stone-100 relative active:scale-95 transition-all flex items-center justify-between rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden px-5 shrink-0">
            <div className="flex items-center gap-4 z-10">
              <div className="bg-white p-2 rounded-full border border-stone-200 text-[#2A0845]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <span className="font-black text-[#2A0845] text-sm tracking-widest uppercase">Sales Ledger</span>
            </div>
            <ArrowRight className="w-5 h-5 text-[#2A0845] z-10" />
          </button>
          
          <button onClick={() => setMenuState("clients")} className="h-20 w-full md:w-[320px] max-w-[320px] bg-white relative active:scale-95 transition-all flex items-center justify-between rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden px-5 shrink-0">
            <div className="flex items-center gap-4 z-10">
              <div className="bg-stone-50 p-2 rounded-full border border-stone-200 text-[#2A0845]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <span className="font-black text-[#2A0845] text-sm tracking-widest uppercase">Manage Clients</span>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-300 z-10" />
          </button>

          <button onClick={() => setIsAdminSettingsOpen && setIsAdminSettingsOpen(true)} className="h-20 w-full md:w-[320px] max-w-[320px] bg-white relative active:scale-95 transition-all flex items-center justify-between rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden px-5 shrink-0">
            <div className="flex items-center gap-4 z-10">
              <Settings className="w-6 h-6 text-[#2A0845]" />
              <span className="font-black text-[#2A0845] text-sm tracking-widest uppercase">Studio Settings</span>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-300 z-10" />
          </button>

          <button onClick={() => setMenuState("main")} className="h-20 md:h-14 w-full md:w-[320px] max-w-[320px] bg-[#2A0845] relative active:scale-95 transition-all flex items-center justify-center rounded-2xl shadow-sm overflow-hidden px-5 shrink-0 group">
            <span className="font-black text-white text-xs tracking-widest uppercase group-hover:scale-105 transition-transform">View Public Gallery</span>
          </button>
        </div>
      )}

      {menuState === "main" && (
        <div className="flex-1 flex flex-col md:flex-row md:flex-wrap items-center justify-center landscape:justify-start landscape:pt-4 gap-8 w-full max-w-5xl mx-auto animate-in fade-in pb-8 px-4">
          <button onClick={() => { setActiveCategory("Paintings"); setMenuState("collections"); }} className="h-36 w-full md:w-[320px] max-w-[320px] bg-white relative active:scale-95 transition-all flex flex-col items-center justify-center rounded-3xl border border-stone-200 shadow-sm overflow-hidden group">
            <HandDrawnBorder />
            <span className="font-black text-xl tracking-widest text-[#2A0845] uppercase z-10 group-hover:scale-105 transition-transform">Paintings</span>
          </button>
          <button onClick={() => { setActiveCategory("Photography"); setMenuState("collections"); }} className="h-36 w-full md:w-[320px] max-w-[320px] bg-white relative active:scale-95 transition-all flex flex-col items-center justify-center rounded-3xl border border-stone-200 shadow-sm overflow-hidden group">
            <HandDrawnBorder />
            <span className="font-black text-xl tracking-widest text-[#2A0845] uppercase z-10 group-hover:scale-105 transition-transform">Photography</span>
          </button>
          <button onClick={() => setIsStudioPanelOpen(true)} className="h-36 w-full md:w-[320px] max-w-[320px] bg-white relative active:scale-95 transition-all flex flex-col items-center justify-center rounded-3xl border border-stone-200 shadow-sm overflow-hidden group">
            <HandDrawnBorder />
            <span className="font-black text-xl tracking-widest text-[#2A0845] uppercase z-10 group-hover:scale-105 transition-transform">The Studio</span>
          </button>

          {isAdmin && (
            <button onClick={() => setMenuState("admin")} className="mt-4 md:mt-0 h-14 md:h-36 w-full md:w-[320px] max-w-[320px] bg-stone-200 border-2 border-stone-300 relative active:scale-95 transition-all flex items-center justify-center rounded-2xl md:rounded-3xl shadow-sm overflow-hidden px-5 shrink-0 group">
              <span className="font-black text-[#2A0845] text-xs md:text-xl tracking-widest uppercase group-hover:scale-105 transition-transform md:text-center">Back to Studio Manager</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}

function HandDrawnBorder() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#2A0845]" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
      <path d="M 2.5,4 C 33.5,2.5 64.5,4.5 97.5,3 C 96.5,3.2 92,3 88,3" strokeWidth="2" strokeLinecap="round" />
      <path d="M 1.5,96.5 C 31,98 62,95 98.5,96" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 3.5,1 C 2,36 3.5,61 2,97.5" strokeWidth="2" strokeLinecap="round" />
      <path d="M 96.5,2 C 98,34 95,68 97.5,98" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M 5,6 C 36,4.5 58,4.5 95,5.5" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M 95,4 C 94,36 96,58 94.5,95" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
      <path d="M 95,95 C 58,94 36,95 5,94.2" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M 6.5,95 T 5.5,5" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
