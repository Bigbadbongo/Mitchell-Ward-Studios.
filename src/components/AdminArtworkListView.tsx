import React from "react";
import { CheckCircle, Archive, Settings, ArrowLeft } from "lucide-react";

export default function AdminArtworkListView({
  adminListToRender = [],
  setAdminSelectedArt,
  selectedMainCollection,
  selectedSubCategory,
  setMenuState
}: {
  adminListToRender?: any[];
  setAdminSelectedArt: (art: any) => void;
  openUploadModal?: (category: string | null, preferredCollection?: string, preferredSub?: string) => void;
  activeCategory?: string | null;
  selectedMainCollection?: string | null;
  selectedSubCategory?: string | null;
  setMenuState?: (state: string) => void;
}) {
  const folderTitle = selectedSubCategory === "Unassigned" 
    ? "Unassigned Artworks" 
    : (selectedSubCategory || selectedMainCollection || "Inventory");

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col animate-in fade-in pb-12 pt-2 px-2 md:px-6">
      
      {/* Top Header with Navigation */}
      <div className="flex items-center gap-3 mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
        {setMenuState && (
          <button
            onClick={() => {
              if (selectedMainCollection) {
                setMenuState("admin_subcollections");
              } else {
                setMenuState("admin_collections");
              }
            }}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-[#2A0845] transition-colors shrink-0 cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <h3 className="font-black text-base md:text-lg uppercase tracking-widest text-[#2A0845]">
            {folderTitle}
          </h3>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Select any item to manage or reassign
          </p>
        </div>
      </div>

      {/* List of Inventory Items */}
      {adminListToRender.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-sm">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            This folder is empty
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {adminListToRender.map((art: any) => {
            const isSoldOrVaulted = (art.category === "Paintings" && art.isSold) || (art.category === "Photography" && art.isVaulted);

            return (
              <button 
                key={art.id} 
                onClick={() => setAdminSelectedArt(art)}
                className={`w-full text-left bg-white p-4 rounded-2xl border transition-all flex items-center justify-between shadow-sm cursor-pointer hover:border-[#2A0845] hover:shadow-md ${
                  isSoldOrVaulted ? "border-stone-200 bg-stone-50/60" : "border-stone-200"
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img 
                      src={art.thumbnailSrc || art.src} 
                      alt={art.title} 
                      className={`w-full h-full object-cover ${isSoldOrVaulted ? "grayscale opacity-60" : ""}`} 
                    />
                    {art.category === "Paintings" && art.isSold && (
                      <CheckCircle className="absolute inset-0 m-auto w-6 h-6 text-stone-700 drop-shadow" />
                    )}
                    {art.category === "Photography" && art.isVaulted && (
                      <Archive className="absolute inset-0 m-auto w-6 h-6 text-stone-700 drop-shadow" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-3">
                    <h4 className="font-bold text-sm text-slate-800 truncate">
                      {art.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                      {art.category === "Paintings" 
                        ? (art.isSold ? `Sold • £${art.price}` : `Active • £${art.price}`) 
                        : (art.isVaulted ? "Vaulted" : "Active")}
                    </p>
                  </div>
                </div>

                <div className="p-2 text-stone-400 hover:text-[#2A0845] shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
