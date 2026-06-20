import React from "react";
import { X, ShieldCheck, RefreshCcw, Truck } from "lucide-react";
import { useUI } from "../context/UIContext";

export default function ReturnsPolicyModal() {
  const { isReturnsModalOpen, setIsReturnsModalOpen } = useUI();

  if (!isReturnsModalOpen) return null;

  const onClose = () => setIsReturnsModalOpen(false);

  return (
    <div className="absolute inset-0 bg-slate-900/60 z-[70] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#2A0845]" />
            <h2 className="font-black text-xl text-[#2A0845] uppercase tracking-widest">Shipping & Returns</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-sm text-slate-600 leading-relaxed">
          
          {/* Section 1: Original Artworks */}
          <section>
            <h3 className="font-black text-lg text-slate-800 mb-3 flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-emerald-600" /> 
              Original Paintings
            </h3>
            <p className="mb-3">
              We want you to be completely thrilled with your original artwork. Under UK law, you have the right to return an original painting within <strong>14 days of receipt</strong> for a full refund of the artwork's purchase price.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500">
              <li>The artwork must be returned in its original, undamaged condition.</li>
              <li>Return shipping costs and transit insurance are the responsibility of the buyer.</li>
              <li>Please contact us before returning so we can provide the correct studio address and packaging instructions.</li>
            </ul>
          </section>

          {/* Section 2: Photography / Custom Prints */}
          <section>
            <h3 className="font-black text-lg text-slate-800 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" /> 
              Photography Prints (3rd Party Fulfillment)
            </h3>
            <p className="mb-3">
              All photography prints are <strong>custom-made to order</strong> specifically for you via our trusted 3rd-party print fulfillment partners. Because these are bespoke items created upon request, they are <strong>strictly non-refundable</strong> unless damaged in transit.
            </p>
            <p className="p-3 bg-red-50 text-red-800 rounded-lg text-xs font-medium border border-red-100">
              <strong>Damaged Prints:</strong> If your print arrives damaged, please take clear photos of both the damaged print and the original packaging, and contact us within 48 hours of delivery so we can arrange a replacement with our print partner.
            </p>
          </section>

          {/* Section 3: Shipping Timeframes */}
          <section>
            <h3 className="font-black text-lg text-slate-800 mb-3">Shipping Timeframes & Costs</h3>
            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h4 className="font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">Original Paintings (Tiered Shipping)</h4>
                <p className="text-slate-500 text-xs">
                  Originals are carefully crated and shipped directly from the studio. Shipping is calculated at checkout based on the physical dimensions of the canvas. Please allow <strong>7-14 days</strong> for secure crating, insurance processing, and dispatch via courier.
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h4 className="font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">Photography Prints (Flat Rate)</h4>
                <p className="text-slate-500 text-xs">
                  Prints are shipped at a flat standard rate directly from the print lab. They typically dispatch within <strong>2-4 working days</strong>.
                </p>
              </div>
            </div>
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-stone-100 shrink-0">
          <button 
            onClick={onClose} 
            className="w-full bg-slate-900 text-white font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-black transition-colors"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
