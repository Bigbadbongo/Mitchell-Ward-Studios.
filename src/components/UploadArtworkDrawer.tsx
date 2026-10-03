import React from "react";
import { X, Upload } from "lucide-react";

export default function UploadArtworkDrawer({
  isUploading,
  setIsUploading,
  uploadType,
  uploadTitle,
  setUploadTitle,
  uploadCatName,
  setUploadCatName,
  paintCats,
  photoCats,
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
  handlePublishUpload
}: any) {
  if (!isUploading) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in">
      <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsUploading(false)}></div>
      <div className="bg-white h-[90%] md:h-auto md:max-h-[90vh] w-full md:w-[500px] md:max-w-2xl rounded-t-3xl md:rounded-3xl p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-xl text-[#2A0845] uppercase tracking-widest">Upload Artwork</h2>
          <button onClick={() => setIsUploading(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
            <input type="text" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} className="w-full p-3 mt-1 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845]" placeholder="Artwork Title" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Folder</label>
            <select value={uploadCatName} onChange={e => setUploadCatName(e.target.value)} className="w-full p-3 mt-1 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-white">
              <option value="Unassigned">-- Unassigned --</option>
              {(uploadType === "Paintings" ? paintCats : photoCats).map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {/* Physical dimensions capture (Meters/Centimeters) for Paintings only */}
          {uploadType === "Paintings" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Physical Width</label>
                <div className="flex mt-1">
                  <input 
                    type="number" 
                    value={uploadWidth} 
                    onChange={e => setUploadWidth(e.target.value)} 
                    className="flex-1 p-3 text-sm border border-stone-200 rounded-l-xl outline-none focus:border-[#2A0845]" 
                    placeholder="Width" 
                  />
                  <select 
                    value={uploadUnit} 
                    onChange={e => setUploadUnit(e.target.value)} 
                    className="p-3 text-sm border-y border-r border-stone-200 rounded-r-xl outline-none bg-stone-50 font-bold text-[#2A0845]"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Physical Height</label>
                <div className="flex mt-1">
                  <input 
                    type="number" 
                    value={uploadHeight} 
                    onChange={e => setUploadHeight(e.target.value)} 
                    className="flex-1 p-3 text-sm border border-stone-200 rounded-l-xl outline-none focus:border-[#2A0845]" 
                    placeholder="Height" 
                  />
                  <select 
                    value={uploadUnit} 
                    onChange={e => setUploadUnit(e.target.value)} 
                    className="p-3 text-sm border-y border-r border-stone-200 rounded-r-xl outline-none bg-stone-50 font-bold text-[#2A0845]"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {uploadType === "Paintings" && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Price (£)</label>
              <input type="number" value={uploadPrice} onChange={e => setUploadPrice(e.target.value)} className="w-full p-3 mt-1 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845]" placeholder="e.g. 150" />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
            <textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} className="w-full p-3 mt-1 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] min-h-[80px]" placeholder="Brief description..."></textarea>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">
              {uploadType === "Photography" ? "Display Preview Photo" : "Image File"}
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-3 mt-1 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-stone-50" />
          </div>
          {uploadType === "Photography" && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mt-3">Print-Ready Original File (Raw/TIFF/High-Res PNG)</label>
              <input type="file" accept="image/*,.tif,.tiff,.raw" onChange={handlePrintFileChange} className="w-full p-3 mt-1 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-stone-50" />
            </div>
          )}
          {uploadType === "Paintings" && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mt-3">Secondary Room Layout Mockup (Optional)</label>
              <input type="file" accept="image/*" onChange={handleSecondaryFileChange} className="w-full p-3 mt-1 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#2A0845] bg-stone-50" />
            </div>
          )}
        </div>
        <button disabled={uploadingToCloud} onClick={handlePublishUpload} className="w-full mt-4 bg-[#2A0845] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#5C0A96] active:scale-95 transition-all shrink-0 flex justify-center items-center gap-2">
          {uploadingToCloud ? "Uploading..." : <span className="flex items-center gap-2"><Upload className="w-5 h-5" /> Publish Artwork</span>}
        </button>
      </div>
    </div>
  );
}
