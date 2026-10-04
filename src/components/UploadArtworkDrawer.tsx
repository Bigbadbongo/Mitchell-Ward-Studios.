import React, { useState } from "react";
import { X, Upload, Plus } from "lucide-react";

export default function UploadArtworkDrawer({
  isUploading,
  setIsUploading,
  uploadType,
  uploadTitle,
  setUploadTitle,
  uploadMainCollection,
  setUploadMainCollection,
  uploadCatName,
  setUploadCatName,
  paintingsCollections = [],
  photographyCollections = [],
  uploadWidth,
  setUploadWidth,
  uploadHeight,
  setUploadHeight,
  uploadUnit,
  setUploadUnit,
  uploadPrice,
  setUploadPrice,
  uploadDesc,
  setUploadDesc,
  handleFileChange,
  handlePrintFileChange,
  handleSecondaryFileChange,
  uploadingToCloud,
  handlePublishUpload,
  handleAddMainCollection,
  handleAddSubGallery
}: any) {
  const [isCreatingCol, setIsCreatingCol] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [isCreatingSub, setIsCreatingSub] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [isSavingFolder, setIsSavingFolder] = useState(false);

  if (!isUploading) return null;

  const currentCols = uploadType === "Paintings" ? paintingsCollections : photographyCollections;
  const selectedColObj = currentCols?.find((c: any) => c.name === uploadMainCollection) || currentCols?.[0];
  const availableSubGalleries = selectedColObj?.subGalleries || [];

  const handleQuickCreateCol = async () => {
    const trimmed = newColName.trim();
    if (!trimmed) return;
    setIsSavingFolder(true);
    try {
      if (handleAddMainCollection) {
        await handleAddMainCollection(uploadType as "Paintings" | "Photography", trimmed);
      }
      setUploadMainCollection(trimmed);
      setNewColName("");
      setIsCreatingCol(false);
    } catch (err) {
      console.error("Failed to create collection:", err);
    } finally {
      setIsSavingFolder(false);
    }
  };

  const handleQuickCreateSub = async () => {
    const trimmed = newSubName.trim();
    if (!trimmed) return;
    setIsSavingFolder(true);
    try {
      if (handleAddSubGallery && selectedColObj) {
        await handleAddSubGallery(uploadType as "Paintings" | "Photography", selectedColObj.id, trimmed);
      }
      setUploadCatName(trimmed);
      setNewSubName("");
      setIsCreatingSub(false);
    } catch (err) {
      console.error("Failed to create sub-gallery:", err);
    } finally {
      setIsSavingFolder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in">
      <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsUploading(false)}></div>
      <div className="bg-white h-[92%] md:h-auto md:max-h-[90vh] w-full md:w-[540px] md:max-w-2xl rounded-t-3xl md:rounded-3xl p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-stone-100">
          <div>
            <h2 className="font-black text-xl text-[#2A0845] uppercase tracking-widest">
              {uploadType === "Photography" ? "Upload Photo" : "Upload Artwork"}
            </h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {uploadType} Section
            </p>
          </div>
          <button 
            onClick={() => setIsUploading(false)} 
            className="p-2.5 bg-stone-100 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          
          {/* Title */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Title
            </label>
            <input 
              type="text" 
              value={uploadTitle} 
              onChange={e => setUploadTitle(e.target.value)} 
              className="w-full py-3.5 px-4 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] font-medium text-slate-800 shadow-sm" 
              placeholder="Artwork Title" 
            />
          </div>

          {/* Collection & Sub-Gallery Dropdowns with Quick Create (+) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Collection Dropdown */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Collection
              </label>
              {isCreatingCol ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newColName}
                    onChange={e => setNewColName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleQuickCreateCol();
                      } else if (e.key === "Escape") {
                        setIsCreatingCol(false);
                      }
                    }}
                    placeholder="New collection..."
                    className="flex-1 py-3 px-3.5 text-sm border-2 border-[#2A0845] rounded-xl outline-none bg-white font-medium text-slate-800 shadow-sm"
                  />
                  <button
                    type="button"
                    disabled={isSavingFolder || !newColName.trim()}
                    onClick={handleQuickCreateCol}
                    className="px-3.5 py-3 bg-[#2A0845] text-white rounded-xl text-xs font-bold uppercase disabled:opacity-50 hover:bg-[#3d0c64] active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    {isSavingFolder ? "..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsCreatingCol(false); setNewColName(""); }}
                    className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-xl transition-colors shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select 
                    value={uploadMainCollection || selectedColObj?.name || ""} 
                    onChange={e => {
                      const newCol = e.target.value;
                      setUploadMainCollection(newCol);
                      const matched = currentCols.find((c: any) => c.name === newCol);
                      if (matched && matched.subGalleries.length > 0) {
                        setUploadCatName(matched.subGalleries[0].name);
                      } else {
                        setUploadCatName("General");
                      }
                    }} 
                    className="flex-1 py-3 px-3.5 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-white font-semibold text-slate-800 cursor-pointer shadow-sm"
                  >
                    {currentCols.map((col: any) => (
                      <option key={col.id} value={col.name}>{col.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCol(true)}
                    className="p-3 bg-stone-100 hover:bg-[#2A0845] hover:text-white text-slate-700 rounded-xl transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                    title="Add New Collection"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Sub-Gallery Dropdown */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Sub-Gallery / Folder
              </label>
              {isCreatingSub ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newSubName}
                    onChange={e => setNewSubName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleQuickCreateSub();
                      } else if (e.key === "Escape") {
                        setIsCreatingSub(false);
                      }
                    }}
                    placeholder="e.g. Mumbai"
                    className="flex-1 py-3 px-3.5 text-sm border-2 border-[#2A0845] rounded-xl outline-none bg-white font-medium text-slate-800 shadow-sm"
                  />
                  <button
                    type="button"
                    disabled={isSavingFolder || !newSubName.trim()}
                    onClick={handleQuickCreateSub}
                    className="px-3.5 py-3 bg-[#2A0845] text-white rounded-xl text-xs font-bold uppercase disabled:opacity-50 hover:bg-[#3d0c64] active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    {isSavingFolder ? "..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsCreatingSub(false); setNewSubName(""); }}
                    className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-xl transition-colors shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select 
                    value={uploadCatName} 
                    onChange={e => setUploadCatName(e.target.value)} 
                    className="flex-1 py-3 px-3.5 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-white font-semibold text-[#2A0845] cursor-pointer shadow-sm"
                  >
                    {availableSubGalleries.length === 0 ? (
                      <option value="General">General</option>
                    ) : (
                      availableSubGalleries.map((sub: any) => (
                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                      ))
                    )}
                    <option value="Unassigned">Unassigned</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCreatingSub(true)}
                    className="p-3 bg-stone-100 hover:bg-[#2A0845] hover:text-white text-slate-700 rounded-xl transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                    title="Add New Sub-Gallery"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Physical dimensions (Width / Height) for Paintings */}
          {uploadType === "Paintings" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Width
                </label>
                <div className="flex">
                  <input 
                    type="number" 
                    value={uploadWidth} 
                    onChange={e => setUploadWidth(e.target.value)} 
                    className="flex-1 py-3.5 px-4 text-sm border border-stone-200 rounded-l-xl outline-none focus:border-[#2A0845] font-medium text-slate-800 shadow-sm" 
                    placeholder="Width" 
                  />
                  <select 
                    value={uploadUnit} 
                    onChange={e => setUploadUnit(e.target.value)} 
                    className="px-3 text-sm border-y border-r border-stone-200 rounded-r-xl outline-none bg-stone-50 font-bold text-[#2A0845] cursor-pointer"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Height
                </label>
                <div className="flex">
                  <input 
                    type="number" 
                    value={uploadHeight} 
                    onChange={e => setUploadHeight(e.target.value)} 
                    className="flex-1 py-3.5 px-4 text-sm border border-stone-200 rounded-l-xl outline-none focus:border-[#2A0845] font-medium text-slate-800 shadow-sm" 
                    placeholder="Height" 
                  />
                  <select 
                    value={uploadUnit} 
                    onChange={e => setUploadUnit(e.target.value)} 
                    className="px-3 text-sm border-y border-r border-stone-200 rounded-r-xl outline-none bg-stone-50 font-bold text-[#2A0845] cursor-pointer"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Price for Paintings */}
          {uploadType === "Paintings" && (
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Price (£)
              </label>
              <input 
                type="number" 
                value={uploadPrice} 
                onChange={e => setUploadPrice(e.target.value)} 
                className="w-full py-3.5 px-4 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] font-semibold text-slate-800 shadow-sm" 
                placeholder="150" 
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Description
            </label>
            <textarea 
              value={uploadDesc} 
              onChange={e => setUploadDesc(e.target.value)} 
              className="w-full py-3.5 px-4 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] min-h-[90px] font-medium text-slate-800 shadow-sm resize-none" 
              placeholder="Artwork details, medium, or background..."
            />
          </div>

          {/* Primary Artwork Image */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {uploadType === "Photography" ? "Display Preview Photo" : "Image File"}
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="w-full py-3 px-4 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-stone-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#2A0845] file:text-white cursor-pointer" 
            />
          </div>

          {/* Print-Ready File for Photography */}
          {uploadType === "Photography" && (
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 mt-2">
                Print-Ready Original File (Raw / TIFF / High-Res PNG)
              </label>
              <input 
                type="file" 
                accept="image/*,.tif,.tiff,.raw" 
                onChange={handlePrintFileChange} 
                className="w-full py-3 px-4 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-stone-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#2A0845] file:text-white cursor-pointer" 
              />
            </div>
          )}

          {/* Secondary Room Mockup for Paintings */}
          {uploadType === "Paintings" && (
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 mt-2">
                Secondary Room Layout Mockup (Optional)
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleSecondaryFileChange} 
                className="w-full py-3 px-4 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-stone-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#2A0845] file:text-white cursor-pointer" 
              />
            </div>
          )}
        </div>

        {/* Submit Publish Button */}
        <button 
          disabled={uploadingToCloud} 
          onClick={handlePublishUpload} 
          className="w-full mt-4 bg-[#2A0845] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#3d0c64] active:scale-95 transition-all shrink-0 flex justify-center items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
        >
          {uploadingToCloud ? (
            "Uploading..." 
          ) : (
            <span className="flex items-center gap-2">
              <Upload className="w-5 h-5" /> 
              Publish {uploadType === "Photography" ? "Photo" : "Artwork"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
