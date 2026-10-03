import React, { useState, useEffect } from "react";
import { ArrowLeft, Users, ShoppingBag, Copy, MapPin, Mail, ChevronRight } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminClientsView({ setMenuState }: any) {
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsQuery = query(collection(db, "customers"));
        const clientsSnapshot = await getDocs(clientsQuery);
        const clientsData = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => {
            const dateA = (a as any).lastOrderDate ? new Date((a as any).lastOrderDate).getTime() : 0;
            const dateB = (b as any).lastOrderDate ? new Date((b as any).lastOrderDate).getTime() : 0;
            return dateB - dateA;
          });
        
        const ordersQuery = query(collection(db, "orders"), orderBy("date", "desc"));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setClients(clientsData as any);
        setOrders(ordersData as any);
      } catch (error) {
        console.error("Error fetching CRM data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getClientOrders = (email: string) => {
    return orders.filter((order: any) => order.customerEmail?.toLowerCase() === email.toLowerCase());
  };

  const copyToClipboard = (text: string) => {
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

  if (selectedClient) {
    const clientOrders = getClientOrders(selectedClient.email);
    
    return (
      <div className="flex-1 flex flex-col w-full max-w-[800px] mx-auto animate-in fade-in slide-in-from-right-8 duration-300">
        <div className="sticky top-0 z-10 bg-[#fafafa]/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-stone-200 shadow-sm gap-2">
          <button onClick={() => setSelectedClient(null)} className="flex items-center gap-2 text-[#2A0845] font-bold uppercase tracking-widest text-xs hover:bg-stone-200/50 py-2 px-3 rounded-xl transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" /> Back <span className="hidden sm:inline">to Clients</span>
          </button>
          <div className="p-2 bg-[#2A0845]/10 rounded-full">
            <Users className="w-5 h-5 text-[#2A0845]" />
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-black text-[#2A0845] tracking-tight">{selectedClient.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-slate-500 font-bold text-sm">
            <Mail className="w-4 h-4" /> {selectedClient.email}
          </div>

          <div className="mt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="font-black text-lg text-slate-800 uppercase tracking-widest">Delivery Address</h3>
              {selectedClient.address && selectedClient.address !== "No Address Provided" && (
                <button onClick={() => copyToClipboard(selectedClient.address)} className="flex items-center justify-center gap-2 bg-[#2A0845] text-white px-4 py-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#421568] transition-colors shadow-sm w-full sm:w-auto shrink-0">
                  <Copy className="w-4 h-4" /> Copy <span className="hidden sm:inline">Address</span>
                </button>
              )}
            </div>
            
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-3 sm:gap-4 overflow-hidden">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-slate-700 whitespace-pre-line leading-relaxed break-words flex-1 min-w-0">
                {selectedClient.address || "No Address Provided"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-black text-lg text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Order History
            </h3>
            
            {clientOrders.length === 0 ? (
              <p className="text-slate-500 text-sm">No orders found for this client.</p>
            ) : (
              <div className="space-y-4">
                {clientOrders.map((order: any) => (
                  <div key={order.orderId || order.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{order.orderId || order.id}</span>
                      <span className="text-xs font-bold text-[#2A0845] uppercase tracking-widest bg-[#2A0845]/10 px-2 py-1 rounded-md">{order.status}</span>
                    </div>
                    <div className="space-y-3 sm:space-y-2 mb-3">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-start gap-3 text-sm">
                          <span className="font-bold text-slate-700 flex-1 min-w-0 break-words leading-snug">
                            {item.title} <span className="text-slate-400 font-normal block sm:inline mt-0.5 sm:mt-0">({item.size})</span>
                          </span>
                          <span className="font-bold text-slate-800 shrink-0 mt-0.5">£{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total</span>
                      <span className="text-lg font-black text-[#2A0845]">£{order.total || order.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const downloadCSV = async () => {
    try {
      const subSnap = await getDocs(query(collection(db, "newsletter")));
      const emails = subSnap.docs.map(doc => doc.data().email || doc.id).join("\n");
      
      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent("Email\n" + emails);
      const a = document.createElement('a');
      a.href = csvContent;
      a.download = 'studio_newsletter_subscribers.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("CSV Download Error:", e);
      alert("Failed to download CSV");
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-[800px] mx-auto animate-in fade-in duration-300">
      <div className="sticky top-0 z-10 bg-[#fafafa]/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-stone-200 shadow-sm gap-2">
        <button onClick={() => setMenuState("admin")} className="flex items-center gap-2 text-[#2A0845] font-bold uppercase tracking-widest text-xs hover:bg-stone-200/50 py-2 px-3 rounded-xl transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4" /> Back <span className="hidden sm:inline">to Manager</span>
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-black text-[#2A0845] tracking-tight uppercase">Clients</h1>
            <p className="text-slate-500 font-bold text-sm mt-1">{clients.length} Total Clients</p>
          </div>
          <button onClick={downloadCSV} className="flex items-center justify-center gap-2 bg-[#2A0845] text-white px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#421568] transition-colors shadow-sm shrink-0 whitespace-nowrap">
            <Mail className="w-4 h-4" /> <span className="hidden sm:inline">Export Emails</span><span className="sm:hidden">Export</span>
          </button>
        </div>

        {clients.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-stone-200 text-center shadow-sm">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-500 uppercase tracking-widest">No clients yet</p>
            <p className="text-sm text-slate-400 mt-2">When someone places an order, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client: any) => (
              <button 
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-[#2A0845] hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group active:scale-[0.98]"
              >
                <div className="text-left flex-1 min-w-0 w-full">
                  <h3 className="font-black text-lg text-slate-800 truncate w-full">{client.name}</h3>
                  <p className="text-xs font-bold text-slate-500 truncate mt-0.5 w-full">{client.email}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 border-t sm:border-0 border-stone-100 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Lifetime Spend</p>
                    <p className="font-black text-[#2A0845] text-sm sm:text-base">£{client.totalSpend || 0}</p>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-full group-hover:bg-[#2A0845]/10 transition-colors shrink-0">
                    <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-[#2A0845]" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
