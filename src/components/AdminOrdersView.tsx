import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag, MapPin, Mail, ChevronRight, Package, User } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useUI } from "../context/UIContext";

export default function AdminOrdersView() {
  const { setMenuState } = useUI();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ledgerQuery = query(collection(db, "sales_ledger"), orderBy("date", "desc"));
        const ledgerSnapshot = await getDocs(ledgerQuery);
        const ledgerData = ledgerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const ordersQuery = query(collection(db, "orders"));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersMap: any = {};
        ordersSnapshot.forEach(doc => {
          ordersMap[doc.id] = doc.data();
        });

        let combined = [];
        if (ledgerData.length > 0) {
          combined = ledgerData.map(ledgerItem => ({
            ...ledgerItem,
            ...(ordersMap[(ledgerItem as any).orderId || ledgerItem.id] || {})
          }));
        } else {
          combined = Object.values(ordersMap).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }

        setOrders(combined as any);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Address copied to clipboard!");
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#2A0845] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // --- ORDER DETAIL VIEW ---
  if (selectedOrder) {
    const isPaid = selectedOrder.status === "paid";
    
    return (
      <div className="flex-1 flex flex-col w-full max-w-[800px] mx-auto animate-in fade-in slide-in-from-right-8 duration-300">
        <div className="sticky top-0 z-10 bg-[#fafafa]/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-stone-200 shadow-sm">
          <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-2 text-[#2A0845] font-bold uppercase tracking-widest text-xs hover:bg-stone-200/50 py-2 px-3 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Ledger
          </button>
          <div className="p-2 bg-[#2A0845]/10 rounded-full">
            <ShoppingBag className="w-5 h-5 text-[#2A0845]" />
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-[#2A0845] tracking-tight uppercase">Order Details</h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">{(selectedOrder as any).orderId || selectedOrder.id}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl border ${isPaid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'} flex items-center gap-2 shadow-sm`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isPaid ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
              <span className="font-black text-sm uppercase tracking-widest">{selectedOrder.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Customer Info
              </h3>
              <p className="font-bold text-lg text-[#2A0845]">{selectedOrder.customerName || "Guest"}</p>
              <p className="font-medium text-sm text-slate-500 mt-1">{selectedOrder.customerEmail || "No email"}</p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm relative group">
              <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Address
              </h3>
              <p className="font-medium text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedOrder.customerAddress || "No address provided"}
              </p>
              {selectedOrder.customerAddress && selectedOrder.customerAddress !== "No Address Provided" && (
                <button onClick={() => copyToClipboard(selectedOrder.customerAddress)} className="absolute top-4 right-4 text-xs font-bold bg-stone-100 px-2 py-1 rounded text-stone-600 hover:bg-stone-200 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Copy
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
            <div className="p-5 border-b border-stone-100 bg-stone-50/50">
              <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Package className="w-4 h-4" /> Items Ordered
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-bold text-slate-800">{item.title}</span>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{item.size} • {item.category}</p>
                  </div>
                  <span className="font-black text-lg text-[#2A0845]">£{item.price}</span>
                </div>
              ))}
            </div>
            <div className="bg-stone-50 p-5 space-y-2 border-t border-stone-200">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500 uppercase tracking-widest">Subtotal</span>
                <span className="font-bold text-slate-700">£{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500 uppercase tracking-widest">Shipping</span>
                <span className="font-bold text-slate-700">£{selectedOrder.shipping}</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-stone-200">
                <span className="font-black text-sm text-[#2A0845] uppercase tracking-widest">Grand Total</span>
                <span className="font-black text-2xl text-[#2A0845]">£{selectedOrder.total || selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LEDGER LIST VIEW ---
  return (
    <div className="flex-1 flex flex-col w-full max-w-[1000px] mx-auto animate-in fade-in duration-300">
      <div className="sticky top-0 z-10 bg-[#fafafa]/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-stone-200 shadow-sm">
        <button onClick={() => setMenuState("admin")} className="flex items-center gap-2 text-[#2A0845] font-bold uppercase tracking-widest text-xs hover:bg-stone-200/50 py-2 px-3 rounded-xl transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#2A0845] tracking-tight uppercase">Sales Ledger</h1>
            <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">{orders.length} Total Orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-500 uppercase tracking-widest text-lg">Ledger is empty</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">When you make a sale via Stripe, it will magically appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            
            {/* MOBILE CARD LAYOUT */}
            <div className="block md:hidden divide-y divide-stone-100">
              {orders.map((order: any) => {
                const isPaid = order.status === "paid";
                const orderDate = new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                return (
                  <div key={(order as any).orderId || order.id} onClick={() => setSelectedOrder(order)} className="p-5 hover:bg-stone-50 cursor-pointer transition-colors active:scale-[0.98]">
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-[#2A0845] uppercase tracking-widest truncate">{(order as any).orderId || order.id}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{orderDate}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end gap-4 mt-1">
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-black text-slate-800 truncate">{order.customerName || "Guest"}</p>
                        <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{order.itemCount || order.items?.length || 0} items</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-lg text-[#2A0845]">£{order.totalAmount || order.total || 0}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE LAYOUT */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Items</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((order: any) => {
                    const isPaid = order.status === "paid";
                    const orderDate = new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    
                    return (
                      <tr 
                        key={(order as any).orderId || order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-stone-50/50 cursor-pointer transition-colors group"
                      >
                        <td className="p-4 text-xs font-black text-[#2A0845] whitespace-nowrap">{(order as any).orderId || order.id}</td>
                        <td className="p-4 text-sm font-bold text-slate-500 whitespace-nowrap">{orderDate}</td>
                        <td className="p-4 max-w-[200px]">
                          <p className="text-sm font-black text-slate-800 truncate">{order.customerName || "Guest"}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">{order.customerProfileId || order.customerEmail || "No email"}</p>
                        </td>
                        <td className="p-4 max-w-[200px]">
                          <p className="text-sm font-bold text-slate-700">{order.itemCount || order.items?.length || 0} items</p>
                          <p className="text-xs font-medium text-slate-400 truncate">
                            {order.items?.map((i: any) => i.title).join(", ") || "-"}
                          </p>
                        </td>
                        <td className="p-4 text-right text-base font-black text-[#2A0845]">£{order.totalAmount || order.total || 0}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#2A0845] inline-block transition-colors" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
