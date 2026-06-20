import React, { useState, useEffect } from "react";
import { X, Lock } from "lucide-react";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

export default function AccountDrawer() {
  const { isAccountOpen, setIsAccountOpen } = useUI();
  const { userName, userEmail, saveUserProfile, deleteUserProfile } = useAuth();
  const [localName, setLocalName] = useState(userName);
  const [localEmail, setLocalEmail] = useState(userEmail);

  useEffect(() => {
    if (isAccountOpen) {
      setLocalName(userName);
      setLocalEmail(userEmail);
    }
  }, [isAccountOpen, userName, userEmail]);

  if (!isAccountOpen) return null;

  const handleSave = () => {
    saveUserProfile(localName, localEmail);
    setIsAccountOpen(false);
  };

  const handleDeleteData = () => {
    if (confirm("Are you sure you want to delete your personal data? This will remove your stored name, email, and address from our systems.")) {
      deleteUserProfile();
      setIsAccountOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAccountOpen(false)}></div>
      <div className="bg-white h-[80%] md:h-auto md:max-h-[90vh] w-full md:w-[450px] md:max-w-xl rounded-t-3xl md:rounded-3xl p-6 flex flex-col animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 z-10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-xl text-[#2A0845]">MY ACCOUNT</h2>
          <button onClick={() => setIsAccountOpen(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <p className="text-xs text-slate-500 mb-4">Save your name and email here to keep track of the studio newsletter.</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input type="text" value={localName} onChange={(e) => setLocalName(e.target.value)} className="w-full p-3 rounded-lg border border-stone-200 mt-1 outline-none focus:border-[#2A0845] transition-colors text-sm animate-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input type="email" value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} className="w-full p-3 rounded-lg border border-stone-200 mt-1 outline-none focus:border-[#2A0845] transition-colors text-sm animate-none" />
            </div>
            
            {/* THE TRUST MESSAGE: Clean, professional, and fully compliant */}
            <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-xl border border-stone-100 mt-6">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                <strong className="text-slate-700 block mb-0.5">Data Privacy Promise</strong> 
                We only use your details to process your order and safely deliver your art. We will never sell your data or use it for marketing.
              </p>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="w-full mt-4 bg-[#2A0845] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#5C0A96] active:scale-95 transition-all shrink-0 shadow-md">
          Save Settings
        </button>

        <button onClick={handleDeleteData} className="w-full mt-3 text-red-500 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-red-50 active:scale-95 transition-all shrink-0 text-xs">
          Delete My Data
        </button>
      </div>
    </div>
  );
}