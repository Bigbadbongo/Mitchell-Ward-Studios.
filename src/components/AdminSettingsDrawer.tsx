import React, { useState } from "react";
import { X, CheckCircle, Edit2, Trash2, Plus, Folder } from "lucide-react";
import { MainCollection, SubGallery } from "../types";

export default function AdminSettingsDrawer({
  isAdminSettingsOpen,
  setIsAdminSettingsOpen,
  studioBio,
  setStudioBio,
  studioEmail,
  setStudioEmail,
  studioInstagram,
  setStudioInstagram,
  studioWebsite,
  setStudioWebsite,
  saveStudioInfo,
  paintingsCollections = [],
  photographyCollections = [],
  handleAddMainCollection,
  handleRenameMainCollection,
  handleDeleteMainCollection,
  handleAddSubGallery,
  handleRenameSubGallery,
  handleDeleteSubGallery,
  localPrices,
  setLocalPrices,
  handlePriceUpdate,
  shippingConfig,
  setShippingConfig,
  handleShippingUpdate,
  adminSignOut
}: any) {
  if (!isAdminSettingsOpen) return null;

  const [activeTab, setActiveTab] = useState<"studio" | "paintings" | "photography" | "pricing">("studio");

  const TABS = [
    { id: "studio", label: "Studio Info" },
    { id: "paintings", label: "Painting Folders" },
    { id: "photography", label: "Photography Folders" },
    { id: "pricing", label: "Pricing & Shipping" }
  ] as const;

  const FIXED_SIZE_ORDER = ["A4 Print", "A3 Print", "A2 Print", "50x70cm Print", "A1 Print", "Digital Download"];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAdminSettingsOpen(false)}></div>
      <div className="bg-white h-[90%] md:h-auto md:max-h-[90vh] w-full md:w-[560px] md:max-w-2xl rounded-t-3xl md:rounded-3xl p-5 md:p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 z-10">
        
        {/* Drawer Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-black text-xl text-[#2A0845]">Studio Settings</h2>
          <button onClick={() => setIsAdminSettingsOpen(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Navigation: Horizontal Pill Tabs */}
        <div className="flex gap-2 mb-4 border-b border-stone-200 pb-2.5 overflow-x-auto no-scrollbar shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#2A0845] text-white shadow-sm"
                  : "bg-stone-100 text-slate-600 hover:bg-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-3">
          
          {/* TAB 1: STUDIO INFO */}
          {activeTab === "studio" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Artist / Studio Name</label>
                  <input 
                    type="text" 
                    value="Mitchell Ward" 
                    readOnly 
                    className="w-full p-2.5 mt-1 text-sm font-bold text-slate-800 bg-white border border-stone-200 rounded-xl outline-none" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Studio Email</label>
                  <input 
                    type="email" 
                    value={studioEmail || ""} 
                    onChange={(e) => setStudioEmail(e.target.value)} 
                    onBlur={() => saveStudioInfo()} 
                    placeholder="studio@example.com"
                    className="w-full p-2.5 mt-1 text-sm font-bold text-slate-800 bg-white border border-stone-200 rounded-xl outline-none focus:border-[#2A0845]" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">About Me / Bio</label>
                  <textarea 
                    value={studioBio || ""} 
                    onChange={(e) => setStudioBio(e.target.value)} 
                    onBlur={() => saveStudioInfo()} 
                    placeholder="Artist bio and statement..."
                    className="w-full p-2.5 mt-1 text-sm text-slate-700 bg-white border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] min-h-[110px] resize-none leading-relaxed"
                  ></textarea>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instagram</label>
                  <input 
                    type="text" 
                    value={studioInstagram || ""} 
                    onChange={(e) => setStudioInstagram(e.target.value)} 
                    onBlur={() => saveStudioInfo()} 
                    placeholder="https://instagram.com/mitchellwardart" 
                    className="w-full p-2.5 mt-1 text-sm font-bold text-slate-800 bg-white border border-stone-200 rounded-xl outline-none focus:border-[#2A0845]" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Website URL</label>
                  <input 
                    type="url" 
                    value={studioWebsite || ""} 
                    onChange={(e) => setStudioWebsite(e.target.value)} 
                    onBlur={() => saveStudioInfo()} 
                    placeholder="https://mitchellwardstudios.com" 
                    className="w-full p-2.5 mt-1 text-sm font-bold text-slate-800 bg-white border border-stone-200 rounded-xl outline-none focus:border-[#2A0845]" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAINTING FOLDERS */}
          {activeTab === "paintings" && (
            <div className="animate-in fade-in duration-200">
              <FoldersManager
                category="Paintings"
                collections={paintingsCollections}
                onAddCollection={(name) => handleAddMainCollection("Paintings", name)}
                onRenameCollection={(id, oldName, newName) => handleRenameMainCollection("Paintings", id, oldName, newName)}
                onDeleteCollection={(id, name) => handleDeleteMainCollection("Paintings", id, name)}
                onAddSubGallery={(colId, subName) => handleAddSubGallery("Paintings", colId, subName)}
                onRenameSubGallery={(colId, subId, oldSub, newSub) => handleRenameSubGallery("Paintings", colId, subId, oldSub, newSub)}
                onDeleteSubGallery={(colId, subId, subName) => handleDeleteSubGallery("Paintings", colId, subId, subName)}
              />
            </div>
          )}

          {/* TAB 3: PHOTOGRAPHY FOLDERS */}
          {activeTab === "photography" && (
            <div className="animate-in fade-in duration-200">
              <FoldersManager
                category="Photography"
                collections={photographyCollections}
                onAddCollection={(name) => handleAddMainCollection("Photography", name)}
                onRenameCollection={(id, oldName, newName) => handleRenameMainCollection("Photography", id, oldName, newName)}
                onDeleteCollection={(id, name) => handleDeleteMainCollection("Photography", id, name)}
                onAddSubGallery={(colId, subName) => handleAddSubGallery("Photography", colId, subName)}
                onRenameSubGallery={(colId, subId, oldSub, newSub) => handleRenameSubGallery("Photography", colId, subId, oldSub, newSub)}
                onDeleteSubGallery={(colId, subId, subName) => handleDeleteSubGallery("Photography", colId, subId, subName)}
              />
            </div>
          )}

          {/* TAB 4: PRICING & SHIPPING */}
          {activeTab === "pricing" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Global Print Prices */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-black text-[#2A0845] uppercase tracking-wider border-b border-stone-200 pb-2">
                  Global Print Prices
                </h4>
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
                             setLocalPrices({ ...(localPrices || {}), [size]: val });
                          }}
                          onBlur={() => {
                             const updatedPrices = { ...(localPrices || {}) };
                             handlePriceUpdate(updatedPrices);
                          }}
                          className="w-full pl-7 p-2.5 text-sm font-bold text-[#2A0845] border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-white" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Painting Shipping Rules */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-black text-[#2A0845] uppercase tracking-wider border-b border-stone-200 pb-2">
                  Painting Shipping Rules
                </h4>
                
                <div className="space-y-3">
                  {(['small', 'medium', 'large'] as const).map((tier) => (
                    <div key={tier} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">{tier} Tier Max Size (cm)</label>
                        <input 
                          type="number" 
                          value={shippingConfig?.[tier]?.maxSize || ''}
                          onChange={(e) => {
                             const val = Number(e.target.value);
                             setShippingConfig({ ...(shippingConfig || {}), [tier]: { ...(shippingConfig?.[tier] || {}), maxSize: val } });
                          }}
                          onBlur={() => handleShippingUpdate(shippingConfig)}
                          className="w-full p-2.5 text-xs font-bold text-slate-800 border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-white mt-1" 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Cost (£)</label>
                        <input 
                          type="number" 
                          value={shippingConfig?.[tier]?.price || ''}
                          onChange={(e) => {
                             const val = Number(e.target.value);
                             setShippingConfig({ ...(shippingConfig || {}), [tier]: { ...(shippingConfig?.[tier] || {}), price: val } });
                          }}
                          onBlur={() => handleShippingUpdate(shippingConfig)}
                          className="w-full p-2.5 text-xs font-bold text-slate-800 border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-white mt-1" 
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2 items-end pt-2 border-t border-stone-200">
                    <div className="flex-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Oversized / Commissions</label>
                      <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold leading-tight">Canvases larger than Large Tier</p>
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Cost (£)</label>
                      <input 
                        type="number" 
                        value={shippingConfig?.oversized?.price || ''}
                        onChange={(e) => {
                           const val = Number(e.target.value);
                           setShippingConfig({ ...(shippingConfig || {}), oversized: { price: val } });
                        }}
                        onBlur={() => handleShippingUpdate(shippingConfig)}
                        className="w-full p-2.5 text-xs font-bold text-slate-800 border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-white mt-1" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photography Shipping Rules */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-black text-[#2A0845] uppercase tracking-wider border-b border-stone-200 pb-2">
                  Photography Shipping
                </h4>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Flat Rate Delivery Cost (£)</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">£</span>
                    <input 
                      type="number" 
                      value={shippingConfig?.photographyFlatRate || ''}
                      onChange={(e) => {
                         const val = Number(e.target.value);
                         setShippingConfig({ ...(shippingConfig || {}), photographyFlatRate: val });
                      }}
                      onBlur={() => handleShippingUpdate(shippingConfig)}
                      className="w-full pl-7 p-2.5 text-sm font-bold text-[#2A0845] border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-white" 
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Clean Bottom Bar with Accessible Sign Out */}
        <div className="pt-3 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-xs font-bold text-slate-700">Admin Mode</span>
          </div>
          <button 
            onClick={() => { adminSignOut(); setIsAdminSettingsOpen(false); }}
            className="px-3.5 py-1.5 bg-red-50 text-red-600 rounded-xl flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 font-bold mt-2 pb-1 shrink-0">Changes save automatically.</p>
      </div>
    </div>
  );
}

// Flat List Component: Single Card per Collection
function FoldersManager({
  category,
  collections = [],
  onAddCollection,
  onRenameCollection,
  onDeleteCollection,
  onAddSubGallery,
  onRenameSubGallery,
  onDeleteSubGallery
}: {
  category: "Paintings" | "Photography";
  collections: MainCollection[];
  onAddCollection: (name: string) => void;
  onRenameCollection: (id: string, oldName: string, newName: string) => void;
  onDeleteCollection: (id: string, name: string) => void;
  onAddSubGallery: (colId: string, subName: string) => void;
  onRenameSubGallery: (colId: string, subId: string, oldSub: string, newSub: string) => void;
  onDeleteSubGallery: (colId: string, subId: string, subName: string) => void;
}) {
  const [newColName, setNewColName] = useState("");
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editingColText, setEditingColText] = useState("");

  const [newSubNames, setNewSubNames] = useState<Record<string, string>>({});
  const [editingSubKey, setEditingSubKey] = useState<string | null>(null);
  const [editingSubText, setEditingSubText] = useState("");

  const handleAddCol = () => {
    if (!newColName.trim()) return;
    onAddCollection(newColName.trim());
    setNewColName("");
  };

  const saveRenameCol = (col: MainCollection) => {
    if (!editingColText.trim() || editingColText.trim() === col.name) {
      setEditingColId(null);
      return;
    }
    onRenameCollection(col.id, col.name, editingColText.trim());
    setEditingColId(null);
  };

  const handleAddSub = (colId: string) => {
    const subName = newSubNames[colId];
    if (!subName || !subName.trim()) return;
    onAddSubGallery(colId, subName.trim());
    setNewSubNames(prev => ({ ...prev, [colId]: "" }));
  };

  const saveRenameSub = (colId: string, sub: SubGallery) => {
    if (!editingSubText.trim() || editingSubText.trim() === sub.name) {
      setEditingSubKey(null);
      return;
    }
    onRenameSubGallery(colId, sub.id, sub.name, editingSubText.trim());
    setEditingSubKey(null);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Add Collection Bar */}
      <div className="flex gap-2">
        <input 
          type="text"
          placeholder="New collection name"
          value={newColName}
          onChange={e => setNewColName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleAddCol(); }}
          className="flex-1 p-2.5 text-sm font-medium text-slate-800 bg-white border border-stone-200 rounded-xl outline-none focus:border-[#2A0845]"
        />
        <button
          type="button"
          onClick={handleAddCol}
          className="px-4 py-2.5 bg-[#2A0845] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#3d0d62] transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collection</span>
        </button>
      </div>

      {/* Flat List: One Single Card per Collection */}
      {collections.length === 0 ? (
        <div className="text-center py-8 text-stone-400 text-xs font-bold uppercase tracking-wider bg-stone-50 rounded-2xl border border-stone-200">
          No collections added yet
        </div>
      ) : (
        <div className="space-y-3.5">
          {collections.map(col => (
            <div key={col.id} className="bg-white rounded-2xl border border-stone-200 p-3.5 md:p-4 space-y-3 shadow-sm">
              
              {/* Collection Header (Top Level) */}
              <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                {editingColId === col.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      autoFocus
                      value={editingColText}
                      onChange={e => setEditingColText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveRenameCol(col); }}
                      onBlur={() => saveRenameCol(col)}
                      className="flex-1 p-1.5 text-sm font-bold text-[#2A0845] border border-[#2A0845] rounded-lg outline-none"
                    />
                    <button
                      type="button"
                      onMouseDown={e => { e.preventDefault(); saveRenameCol(col); }}
                      className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-2 overflow-hidden">
                    <Folder className="w-4 h-4 text-[#2A0845] shrink-0" />
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide truncate">
                      {col.name}
                    </h4>
                  </div>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setEditingColId(col.id); setEditingColText(col.name); }}
                    title="Rename Collection"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCollection(col.id, col.name)}
                    title="Delete Collection"
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-Galleries Flat List */}
              <div className="space-y-1">
                {col.subGalleries?.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-1">No sub-galleries in this collection</p>
                ) : (
                  col.subGalleries?.map(sub => {
                    const subKey = `${col.id}-${sub.id}`;
                    const isEditing = editingSubKey === subKey;

                    return (
                      <div key={sub.id} className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg hover:bg-stone-50 transition-colors">
                        {isEditing ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              autoFocus
                              value={editingSubText}
                              onChange={e => setEditingSubText(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") saveRenameSub(col.id, sub); }}
                              onBlur={() => saveRenameSub(col.id, sub)}
                              className="flex-1 p-1 text-xs font-bold text-[#2A0845] border border-[#2A0845] rounded-md outline-none"
                            />
                            <button
                              type="button"
                              onMouseDown={e => { e.preventDefault(); saveRenameSub(col.id, sub); }}
                              className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-700 truncate">
                            {sub.name}
                          </span>
                        )}

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setEditingSubKey(subKey); setEditingSubText(sub.name); }}
                            title="Rename Sub-Gallery"
                            className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteSubGallery(col.id, sub.id, sub.name)}
                            title="Delete Sub-Gallery"
                            className="p-1 text-red-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add Sub-Gallery Row */}
              <div className="flex gap-2 pt-2 border-t border-stone-100">
                <input
                  type="text"
                  placeholder="Add sub-gallery"
                  value={newSubNames[col.id] || ""}
                  onChange={e => setNewSubNames({ ...newSubNames, [col.id]: e.target.value })}
                  onKeyDown={e => { if (e.key === "Enter") handleAddSub(col.id); }}
                  className="flex-1 p-2 text-xs text-slate-800 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-[#2A0845]"
                />
                <button
                  type="button"
                  onClick={() => handleAddSub(col.id)}
                  className="px-3 py-2 bg-stone-100 text-slate-700 hover:bg-[#2A0845] hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
