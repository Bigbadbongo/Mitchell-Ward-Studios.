import React from "react";
import { ArrowLeft, Home } from "lucide-react";
import { useUI } from "../context/UIContext";

export default function AppHeader() {
  const { 
    menuState, 
    handleBack, 
    handleTitleClick, 
    activeCategory, 
    selectedSubCategory, 
    setIsAdminSettingsOpen 
  } = useUI();

  return (
    <header className="pt-4 md:pt-12 landscape:pt-3 pb-4 md:pb-6 landscape:pb-2 px-4 md:px-6 border-b-2 border-stone-200 flex items-center justify-between bg-white z-20 shrink-0">          
      <div className="w-11 h-11 flex items-center justify-start">
        {menuState !== "main" && (
          <button 
            onClick={handleBack} 
            className="p-2.5 rounded-full hover:bg-stone-100 text-slate-650 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5.5 h-5.5" />
          </button>
        )}
      </div>
      <div 
        className={`text-center flex-1 select-none ${menuState === "main" ? "cursor-pointer" : "cursor-default"}`} 
        onClick={menuState === "main" ? handleTitleClick : undefined}
      >
        <h2 className="text-base font-black uppercase tracking-widest text-[#2A0845]">
          {menuState === "main" ? (
            <span className="flex flex-col items-center justify-center mt-1">
              <span className="block text-2xl whitespace-nowrap leading-none mb-0.5">MITCHELL WARD</span>
              <span className="block text-[8px] md:text-[10px] tracking-[0.4em]">S T U D I O S</span>
            </span>
          ) : menuState === "admin" ? "Studio Manager" 
            : menuState === "clients" ? "Client Manager"
            : menuState === "orders" ? "Sales Ledger"
            : menuState === "admin_collections" ? "Manage " + activeCategory 
            : menuState === "admin_list" ? "Folder: " + selectedSubCategory 
            : menuState === "detail" ? "Art Details" 
            : (selectedSubCategory || activeCategory)}
        </h2>
      </div>          
      <div className="w-11 h-11 flex items-center justify-end">
        {menuState !== "main" && (
          <button 
            onClick={handleTitleClick} 
            className="p-2.5 rounded-full text-slate-400 hover:text-[#2A0845] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Home"
          >
            <Home className="w-5.5 h-5.5" />
          </button>
        )}
      </div>
    </header>
  );
}