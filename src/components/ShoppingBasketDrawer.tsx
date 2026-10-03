import React, { useState } from "react";
import { X, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ShoppingBasketDrawer() {
  const { isBasketOpen, setIsBasketOpen, setIsReturnsModalOpen } = useUI();
  const { userName, userEmail, userAddress } = useAuth();
  const { basket, basketSubtotal, basketShipping, removeFromBasket, handleCheckout } = useCart();

  if (!isBasketOpen) return null;

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(false);
  
  // Parse existing address or use empty strings
  const addressParts = (userAddress || "").split(", ");
  const [localName, setLocalName] = useState(userName || "");
  const [localEmail, setLocalEmail] = useState(userEmail || "");
  
  const [houseNumber, setHouseNumber] = useState(addressParts[0] || "");
  const [street, setStreet] = useState(addressParts[1] || "");
  const [town, setTown] = useState(addressParts[2] || "");
  const [postcode, setPostcode] = useState(addressParts[3] || "");
  
  const [subscribe, setSubscribe] = useState(true);

  // Reset to basket view when closed
  React.useEffect(() => {
    if (!isBasketOpen) setCheckoutStep(false);
  }, [isBasketOpen]);

  const confirmCheckout = () => {
    handleCheckout({ 
      name: userName || "Guest", 
      email: userEmail || "No Email Provided", 
      address: userAddress || "Address via Stripe", 
      subscribe 
    });
    setCheckoutStep(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsBasketOpen(false)}></div>
      <div className="bg-white h-[90%] md:h-auto md:max-h-[90vh] w-full md:w-[500px] md:max-w-2xl rounded-t-3xl md:rounded-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 overflow-hidden z-10">
        
        <div className="flex justify-between items-center p-6 border-b border-stone-200 shrink-0 bg-white z-10">
          <h2 className="font-black text-xl text-[#2A0845] uppercase tracking-widest">{checkoutStep ? 'Checkout' : 'Your Basket'}</h2>
          <button onClick={() => setIsBasketOpen(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-stone-50/50 flex flex-col">
          {checkoutStep ? (
            <div className="p-6 space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <p className="text-sm text-slate-500 font-bold text-center mb-6">You will be securely redirected to Stripe to enter your payment and delivery details.</p>
              
              <label className="flex items-center gap-3 cursor-pointer group bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <input type="checkbox" checked={subscribe} onChange={e => setSubscribe(e.target.checked)} className="peer w-5 h-5 accent-[#2A0845]" />
                <span className="text-xs font-bold text-slate-600">Subscribe to the Studio Newsletter</span>
              </label>

              <button 
                onClick={confirmCheckout}
                className="w-full py-4 mt-4 rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all bg-[#2A0845] text-white hover:bg-[#430d6e] active:scale-[0.98] shadow-xl"
              >
                Go to Secure Checkout <ShieldCheck className="w-5 h-5" />
              </button>
              
              <div className="pb-10"></div>
            </div>
          ) : basket.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center opacity-50 flex-1">
              <div className="w-16 h-16 mb-4 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <p className="font-bold uppercase tracking-widest text-sm text-slate-500">Your basket is empty</p>
            </div>
          ) : (
            <div className="p-6 space-y-4 flex-1">
              {basket.map((item) => (
                <div key={item.cartId} className="flex gap-4 bg-white p-3 rounded-2xl border border-stone-200 shadow-sm items-center">
                  <img src={item.thumbnailSrc || item.src} alt={item.title} className="w-16 h-16 object-cover rounded-xl border border-stone-200 shadow-sm" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-sm text-slate-800 truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{item.size} • {item.frame} Frame</p>
                    <p className="text-sm font-black text-[#2A0845] mt-1">£{item.price}</p>
                  </div>
                  <button onClick={() => removeFromBasket(item.cartId)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM FIXED PANEL - Only show when NOT in checkout step, or if we want it small */}
        {!checkoutStep && (
          <div className="p-6 bg-white border-t border-stone-200 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
            <div className="flex justify-between items-center mb-1 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
              <span>Subtotal</span>
              <span>£{basketSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-stone-100 pb-3">
              <span>Shipping</span>
              <span>{basketShipping === 0 ? 'FREE' : `£${basketShipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Total</span>
              <span className="text-2xl font-black text-[#2A0845]">£{(basketSubtotal + basketShipping).toFixed(2)}</span>
            </div>
            
            <div className="mb-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center pt-0.5">
                  <input 
                    type="checkbox" 
                    checked={agreedToTerms} 
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="peer sr-only" 
                  />
                  <div className="w-5 h-5 border-2 border-stone-300 rounded peer-checked:bg-[#2A0845] peer-checked:border-[#2A0845] peer-focus:ring-2 ring-offset-2 ring-[#2A0845] transition-all flex items-center justify-center">
                    <svg className={`w-3 h-3 text-white fill-current opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all ${agreedToTerms ? 'opacity-100 scale-100' : ''}`} viewBox="0 0 20 20">
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 leading-tight">
                  I agree to the <button onClick={(e) => { e.preventDefault(); setIsReturnsModalOpen(true); }} className="underline decoration-stone-300 underline-offset-2 hover:text-[#2A0845] font-bold">Terms of Service & Returns Policy</button>.
                </span>
              </label>
            </div>
            
            <button 
              onClick={() => setCheckoutStep(true)}
              disabled={basket.length === 0 || !agreedToTerms}
              className={"w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all " + (basket.length === 0 || !agreedToTerms ? "bg-stone-200 text-stone-400 cursor-not-allowed" : "bg-[#2A0845] text-white hover:bg-[#430d6e] active:scale-[0.98] shadow-lg")}
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>
  
            <div className="mt-4 flex gap-3 items-start px-2">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed">
                <strong>Studio Guarantees:</strong> Orders are packaged and shipped securely. Payment will be arranged securely via email. 
                <br />
                <button 
                  onClick={() => setIsReturnsModalOpen(true)} 
                  className="mt-1 underline decoration-stone-300 underline-offset-2 hover:text-[#2A0845] transition-colors"
                >
                  View Shipping & Returns Policy
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}