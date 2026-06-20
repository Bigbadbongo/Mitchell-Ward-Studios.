import React from "react";
import { User, ShoppingBasket, Mail, ArrowRight, Check } from "lucide-react";
import { useUI } from "../context/UIContext";
import { useCart } from "../context/CartContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AppFooter() {
  const { setIsAccountOpen, setIsBasketOpen, triggerToast } = useUI();
  const { basket } = useCart();

  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const subscribeToNewsletter = async (emailAddress: string) => {
    try {
      await setDoc(doc(db, "newsletter", emailAddress.toLowerCase()), {
        email: emailAddress.toLowerCase(),
        subscribedAt: new Date().toISOString()
      }, { merge: true });
      triggerToast("Subscribed to newsletter!");
    } catch (e) {
      console.error(e);
      triggerToast("Error subscribing. Try again.");
    }
  };

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) return;
    subscribeToNewsletter(email);
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };
  return (
    <footer className="border-t border-stone-200 bg-white pb-safe pt-3 landscape:pt-1 landscape:pb-1 px-6 flex justify-between items-center z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] min-h-[70px] landscape:min-h-[45px] shrink-0">          
      <div className="flex items-center gap-2">
        <button onClick={() => setIsAccountOpen(true)} className="p-2 text-[#2A0845] bg-[#2A0845]/10 rounded-full hover:bg-[#2A0845]/20 transition-colors shrink-0">
          <User className="w-5 h-5" />
        </button>
      </div>

      <div className="hidden landscape:flex md:flex flex-1 max-w-sm mx-4 items-center bg-stone-100 rounded-full px-2 py-1">
        <Mail className="w-4 h-4 text-slate-400 ml-2" />
        <input 
          type="email" 
          placeholder="Join our newsletter..." 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
          className="flex-1 bg-transparent border-none outline-none text-xs px-3 text-slate-700"
        />
        <button onClick={handleSubscribe} disabled={subscribed} className="p-1.5 bg-[#2A0845] text-white rounded-full hover:bg-[#461b6b] transition-colors">
          {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      <button onClick={() => setIsBasketOpen(true)} className="flex items-center gap-2 bg-[#2A0845]/10 text-[#2A0845] px-4 py-2 rounded-full font-bold text-sm hover:bg-[#2A0845]/20 transition-colors shrink-0">
        <ShoppingBasket className="w-4 h-4" /> {basket.length}
      </button>
    </footer>
  );
}