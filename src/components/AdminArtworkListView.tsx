import React from "react";
import { CheckCircle, Archive, Settings } from "lucide-react";

export default function AdminArtworkListView({
  adminListToRender,
  setAdminSelectedArt
}: any) {
  return (
    <div className="space-y-4 animate-in fade-in">
      {adminListToRender.length === 0 ? (
        <div className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-sm bg-white rounded-xl border border-stone-200 p-6">
          Folder is empty.
        </div>
      ) : (
        adminListToRender.map((art: any) => (
          <button 
            key={art.id} 
            onClick={() => {
              console.log("Admin clicked art:", art.title);
              setAdminSelectedArt(art);
            }}
            className={"w-full text-left bg-white p-3 rounded-xl border flex justify-between items-center shadow-sm cursor-pointer hover:border-[#2A0845] transition-all " + (((art.category === 'Paintings' && art.isSold) || (art.category === 'Photography' && art.isVaulted)) ? 'border-stone-200 bg-stone-50' : 'border-stone-200')}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative shrink-0">
                <img 
                  src={art.thumbnailSrc || art.src} 
                  alt={art.title} 
                  className={"w-12 h-12 rounded object-cover " + (((art.category === 'Paintings' && art.isSold) || (art.category === 'Photography' && art.isVaulted)) ? 'grayscale opacity-70' : 'border border-stone-100')} 
                />
                {art.category === 'Paintings' && art.isSold && <CheckCircle className="absolute inset-0 m-auto w-5 h-5 text-stone-600 drop-shadow-md" />}
                {art.category === 'Photography' && art.isVaulted && <Archive className="absolute inset-0 m-auto w-5 h-5 text-stone-600 drop-shadow-md" />}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-sm leading-tight text-slate-800 truncate">{art.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                  {art.category === 'Paintings' ? (art.isSold ? "Sold • £" + art.price : "Active • £" + art.price) : (art.isVaulted ? 'Vaulted' : 'Active')}
                </p>
              </div>
              <Settings className="w-4 h-4 text-stone-300 shrink-0" />
            </div>
          </button>
        ))
      )}
    </div>
  );
}
