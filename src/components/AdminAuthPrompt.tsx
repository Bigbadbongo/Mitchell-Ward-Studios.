import React from "react";
import { X, LogIn, AlertCircle } from "lucide-react";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { signInWithGoogle } from "../firebase";
export default function AdminAuthPrompt() {
  const { showPinPrompt, setShowPinPrompt } = useUI();
  const { 
    authError, setAuthError,
    authEmail, setAuthEmail, 
    authPassword, setAuthPassword, 
    adminSignIn 
  } = useAuth();
  if (!showPinPrompt) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in p-6">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-xl text-[#2A0845] uppercase tracking-widest">Admin Access</h2>
          <button onClick={() => setShowPinPrompt(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-6 font-medium">
          Sign in with your secure Email and Password.
        </p>

        {authError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 items-center animate-in shake">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest">{authError}</p>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); adminSignIn(); }} className="space-y-4 mb-8">
          <div>
            <label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <input 
              id="email"
              name="email"
              type="email" 
              autoComplete="username"
              value={authEmail} 
              onChange={(e) => setAuthEmail(e.target.value)} 
              className="w-full p-4 rounded-2xl border-2 border-stone-100 mt-1 outline-none focus:border-[#2A0845] transition-colors text-sm font-bold text-slate-800" 
              placeholder="admin@studio.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              autoComplete="current-password"
              value={authPassword} 
              onChange={(e) => setAuthPassword(e.target.value)} 
              className="w-full p-4 rounded-2xl border-2 border-stone-100 mt-1 outline-none focus:border-[#2A0845] transition-colors text-sm font-bold text-slate-800" 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-[#2A0845] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#430d6e] active:scale-[0.98] transition-all shadow-lg mt-4"
          >
            <LogIn className="w-5 h-5" />
            Secure Login
          </button>
        </form>

        <div className="relative flex items-center py-2 mb-4">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or</span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        <button 
          onClick={async () => {
            try {
              setAuthError("");
              await signInWithGoogle();
              setShowPinPrompt(false);
            } catch (error: any) {
              console.error("Google Sign-In Error:", error);
              setAuthError(error.message || "Google Sign-In failed.");
            }
          }}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 border-2 border-stone-200 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-stone-50 hover:border-stone-300 active:scale-[0.98] transition-all mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        
        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-2">
          Unauthorized access is strictly prohibited
        </p>
      </div>
    </div>
  );
}