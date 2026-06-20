import React from "react";
import { X, Trash2 } from "lucide-react";

export default function AdminItemManager({
  adminSelectedArt,
  setAdminSelectedArt,
  paintCats,
  photoCats,
  moveArtworkLocation,
  toggleStatus,
  deleteArtwork
}: any) {
  if (!adminSelectedArt) return null;

  return (
    <div className="absolute inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-[320px] rounded-3xl p-6 shadow-2xl flex flex-col animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-[#2A0845] text-sm uppercase tracking-widest">Inventory Panel</h3>
          <button onClick={() => setAdminSelectedArt(null)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-stone-50 rounded-xl p-2 mb-4">
          <img src={adminSelectedArt.thumbnailSrc || adminSelectedArt.src} alt={adminSelectedArt.title} className="w-full h-32 object-contain rounded-lg mix-blend-multiply" />
        </div>
        
        <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1">{adminSelectedArt.title}</h4>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Status: {adminSelectedArt.category === "Paintings" ? (adminSelectedArt.isSold ? "Marked Sold" : "Active") : (adminSelectedArt.isVaulted ? "Hidden (Vaulted)" : "Active")}
        </p>
        
        <div className="mb-6 bg-stone-50 p-3 rounded-lg border border-stone-200">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Move to Folder:</label>
          <select value={adminSelectedArt.subcategory} onChange={(e) => moveArtworkLocation(adminSelectedArt.id, e.target.value)} className="w-full p-2 text-sm font-bold text-[#2A0845] bg-white border border-stone-200 rounded outline-none">
            <option value="Unassigned">-- Unassigned --</option>
            {(adminSelectedArt.category === "Paintings" ? paintCats : photoCats).map((cat: string, i: number) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <button onClick={() => toggleStatus(adminSelectedArt.id, adminSelectedArt.category === 'Paintings' ? 'sold' : 'vault')} className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-colors ${adminSelectedArt.isSold || adminSelectedArt.isVaulted ? 'bg-[#2A0845] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
            {adminSelectedArt.category === 'Paintings' ? (adminSelectedArt.isSold ? 'Restore to Active' : 'Mark as Sold') : (adminSelectedArt.isVaulted ? 'Restore to Gallery' : 'Hide in Vault')}
          </button>
          <button onClick={() => deleteArtwork(adminSelectedArt.id)} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
