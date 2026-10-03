import React, { useState } from "react";
import { X, CheckCircle, Edit2, Trash2, Plus, Settings } from "lucide-react";

export default function AdminSettingsDrawer({
  isAdminSettingsOpen,
  setIsAdminSettingsOpen,
  studioBio,
  setStudioBio,
  studioEmail,
  setStudioEmail,
  saveStudioInfo,
  paintCats,
  photoCats,
  editFolder,
  setEditFolder,
  handleSaveRename,
  newFolders,
  setNewFolders,
  handleAddCollectionInline,
  handleDeleteCollection,
  localPrices,
  setLocalPrices,
  handlePriceUpdate,
  shippingConfig,
  setShippingConfig,
  handleShippingUpdate,
  adminSignOut
}: any) {
  if (!isAdminSettingsOpen) return null;

  const [activeTab, setActiveTab] = useState("config");

  // We lock the sizes in this exact order so the database can't shuffle them!
  const FIXED_SIZE_ORDER = ["A4 Print", "A3 Print", "A2 Print", "50x70cm Print", "A1 Print", "Digital Download"];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAdminSettingsOpen(false)}></div>
      <div className="bg-white h-[90%] md:h-auto md:max-h-[90vh] w-full md:w-[500px] md:max-w-2xl rounded-t-3xl md:rounded-3xl p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-black text-xl text-[#2A0845]">Admin Dashboard</h2>
          <button onClick={() => setIsAdminSettingsOpen(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-4 border-b border-stone-200 pb-2 shrink-0">
          <button 
            onClick={() => setActiveTab("config")}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg flex justify-center items-center gap-2 transition-colors ${activeTab === 'config' ? 'bg-[#2A0845] text-white' : 'bg-stone-100 text-slate-500 hover:bg-stone-200'}`}
          >
            <Settings className="w-4 h-4" /> Config
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-4">
          
          {activeTab === "config" && (
            <>
          
          {/* STUDIO INFO */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <h4 className="text-xs font-black text-[#2A0845] uppercase tracking-widest border-b border-stone-200 pb-2">Studio Info (About You)</h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Studio Email</label>
              <input type="email" value={studioEmail} onChange={(e) => setStudioEmail(e.target.value)} onBlur={() => saveStudioInfo()} className="w-full p-2 mt-1 text-sm font-bold text-slate-800 border border-stone-200 rounded-lg outline-none focus:border-[#2A0845]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">About Me / Bio</label>
              <textarea value={studioBio} onChange={(e) => setStudioBio(e.target.value)} onBlur={() => saveStudioInfo()} className="w-full p-2 mt-1 text-sm text-slate-600 border border-stone-200 rounded-lg outline-none focus:border-[#2A0845] min-h-[100px] resize-none"></textarea>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Admin Security</label>
              <div className="mt-1 flex items-center justify-between bg-white border border-stone-200 rounded-lg p-2">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-xs font-bold text-slate-700">Google Auth Connected</span>
                </div>
                <button 
                  onClick={() => { adminSignOut(); setIsAdminSettingsOpen(false); }}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Paintings Folders Settings */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <h4 className="text-xs font-black text-[#2A0845] uppercase tracking-widest mb-4">Paintings Folders</h4>
            <div className="space-y-2">
              {paintCats?.map((cat: string, i: number) => (
                <div key={`p-${i}`} className="flex items-center gap-2 bg-white p-2 border border-stone-200 rounded-lg">
                  {editFolder?.catType === "Paintings" && editFolder?.index === i ? (
                    <div className="flex-1 flex gap-2 items-center">
                      <input autoFocus value={editFolder.newName} onChange={e => setEditFolder({...editFolder, newName: e.target.value})} onBlur={handleSaveRename} className="flex-1 p-1 text-sm font-bold text-[#2A0845] border border-[#2A0845] rounded outline-none" />
                      <button onMouseDown={(e) => { e.preventDefault(); handleSaveRename(); }} className="p-1 bg-green-100 text-green-700 rounded"><CheckCircle className="w-4 h-4"/></button>
                    </div>
                  ) : (
                    <div className="flex-1 flex gap-2 items-center">
                      <span className="flex-1 text-sm font-bold text-slate-800 px-2 truncate">{cat}</span>
                      <button onClick={() => setEditFolder({ catType: "Paintings", index: i, oldName: cat, newName: cat })} className="p-2 bg-stone-100 text-slate-600 rounded hover:bg-stone-200"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteCollection("Paintings", cat)} className="p-2 bg-red-50 text-red-500 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3 flex">
               <input value={newFolders.Paintings} onChange={e => setNewFolders({...newFolders, Paintings: e.target.value})} placeholder="New Painting Folder..." className="flex-1 p-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-[#2A0845]" />
               <button onClick={() => handleAddCollectionInline("Paintings")} className="px-4 bg-stone-100 text-stone-600 rounded-lg font-bold hover:bg-stone-200 transition-colors"><Plus className="w-4 h-4"/></button>
            </div>
          </div>

          {/* Photography Folders Settings */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <h4 className="text-xs font-black text-[#2A0845] uppercase tracking-widest mb-4">Photography Folders</h4>
            <div className="space-y-2">
              {photoCats?.map((cat: string, i: number) => (
                <div key={`ph-${i}`} className="flex items-center gap-2 bg-white p-2 border border-stone-200 rounded-lg">
                  {editFolder?.catType === "Photography" && editFolder?.index === i ? (
                    <div className="flex-1 flex gap-2 items-center">
                      <input autoFocus value={editFolder.newName} onChange={e => setEditFolder({...editFolder, newName: e.target.value})} onBlur={handleSaveRename} className="flex-1 p-1 text-sm font-bold text-[#2A0845] border border-[#2A0845] rounded outline-none" />
                      <button onMouseDown={(e) => { e.preventDefault(); handleSaveRename(); }} className="p-1 bg-green-100 text-green-700 rounded"><CheckCircle className="w-4 h-4"/></button>
                    </div>
                  ) : (
                    <div className="flex-1 flex gap-2 items-center">
                      <span className="flex-1 text-sm font-bold text-slate-800 px-2 truncate">{cat}</span>
                      <button onClick={() => setEditFolder({ catType: "Photography", index: i, oldName: cat, newName: cat })} className="p-2 bg-stone-100 text-slate-600 rounded hover:bg-stone-200"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteCollection("Photography", cat)} className="p-2 bg-red-50 text-red-500 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3 flex">
               <input value={newFolders.Photography} onChange={e => setNewFolders({...newFolders, Photography: e.target.value})} placeholder="New Photo Folder..." className="flex-1 p-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-[#2A0845]" />
               <button onClick={() => handleAddCollectionInline("Photography")} className="px-4 bg-stone-100 text-stone-600 rounded-lg font-bold hover:bg-stone-200 transition-colors"><Plus className="w-4 h-4"/></button>
            </div>
          </div>

          {/* Global Prices ordered consistently */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <h4 className="text-[10px] font-black text-[#2A0845] uppercase tracking-widest border-b border-stone-200 pb-2">Global Print Prices</h4>
            <div className="grid grid-cols-2 gap-3">
              {FIXED_SIZE_ORDER.map((size) => (
                <div key={size}>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{size}</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">£</span>
                    <input 
                      type="number" 
                      value={localPrices?.[size] === undefined ? "" : (localPrices?.[size] === 0 ? "" : localPrices?.[size])} 
                      onChange={(e) => {
                         const val = e.target.value === "" ? 0 : Number(e.target.value);
                         setLocalPrices({...(localPrices || {}), [size]: val});
                      }}
                      onBlur={() => {
                         const updatedPrices = { ...(localPrices || {}) };
                         handlePriceUpdate(updatedPrices);
                      }}
                      className="w-full pl-7 p-2 text-sm font-bold text-[#2A0845] border border-stone-200 rounded-lg outline-none focus:border-[#2A0845] bg-white" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Shipping Configuration */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <h4 className="text-[10px] font-black text-[#2A0845] uppercase tracking-widest border-b border-stone-200 pb-2">Shipping Rules (Paintings)</h4>
            
            <div className="space-y-3">
              {['small', 'medium', 'large'].map((tier) => (
                <div key={tier} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">{tier} Tier Max Size (cm)</label>
                    <input 
                      type="number" 
                      value={shippingConfig?.[tier]?.maxSize || ''}
                      onChange={(e) => {
                         const val = Number(e.target.value);
                         setShippingConfig({...(shippingConfig || {}), [tier]: { ...(shippingConfig?.[tier] || {}), maxSize: val }});
                      }}
                      onBlur={() => handleShippingUpdate(shippingConfig)}
                      className="w-full p-2 text-xs font-bold text-slate-800 border border-stone-200 rounded-lg outline-none focus:border-[#2A0845] mt-1" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Cost (£)</label>
                    <input 
                      type="number" 
                      value={shippingConfig?.[tier]?.price || ''}
                      onChange={(e) => {
                         const val = Number(e.target.value);
                         setShippingConfig({...(shippingConfig || {}), [tier]: { ...(shippingConfig?.[tier] || {}), price: val }});
                      }}
                      onBlur={() => handleShippingUpdate(shippingConfig)}
                      className="w-full p-2 text-xs font-bold text-slate-800 border border-stone-200 rounded-lg outline-none focus:border-[#2A0845] mt-1" 
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-2 items-end pt-2 border-t border-stone-200">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Oversized / Commissions</label>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold leading-tight">For anything larger than Large Tier.</p>
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Cost (£)</label>
                  <input 
                    type="number" 
                    value={shippingConfig?.oversized?.price || ''}
                    onChange={(e) => {
                       const val = Number(e.target.value);
                       setShippingConfig({...(shippingConfig || {}), oversized: { price: val }});
                    }}
                    onBlur={() => handleShippingUpdate(shippingConfig)}
                    className="w-full p-2 text-xs font-bold text-slate-800 border border-stone-200 rounded-lg outline-none focus:border-[#2A0845] mt-1" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <h4 className="text-[10px] font-black text-[#2A0845] uppercase tracking-widest border-b border-stone-200 pb-2">Shipping Rules (Photography)</h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Flat Rate Delivery Cost (£)</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">£</span>
                <input 
                  type="number" 
                  value={shippingConfig?.photographyFlatRate || ''}
                  onChange={(e) => {
                     const val = Number(e.target.value);
                     setShippingConfig({...(shippingConfig || {}), photographyFlatRate: val});
                  }}
                  onBlur={() => handleShippingUpdate(shippingConfig)}
                  className="w-full pl-7 p-2 text-sm font-bold text-[#2A0845] border border-stone-200 rounded-lg outline-none focus:border-[#2A0845] bg-white" 
                />
              </div>
            </div>
          </div>
          </>
          )}



        </div>
        <p className="text-[10px] text-center text-slate-400 font-bold mt-2 pb-2 shrink-0">Changes save automatically when you click off the box.</p>
      </div>
    </div>
  );
}
