import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Package, CheckCircle, Truck, PackageOpen, ArrowLeft } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ShippingDetails } from './ShopExperience';
import { Product } from '../constants';

interface OrderUpdate {
  message: string;
  timestamp: number;
}

interface Order {
  orderId: string;
  customerName: string;
  items: Product[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: number;
  updates?: OrderUpdate[];
}

export default function OrderStatus({ onBack, initialOrderId = '' }: { onBack: () => void, initialOrderId?: string }) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchOrder = async (targetOrderId: string) => {
    setLoading(true);
    setError('');
    
    try {
      const orderDoc = await getDoc(doc(db, "orders", targetOrderId));
      if (orderDoc.exists()) {
        setOrder(orderDoc.data() as Order);
      } else {
        setError('Order not found. Please verify your Acquisition Reference.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to fetch order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialOrderId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleFetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const fetchOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) return;
    handleFetchOrder(orderId.trim());
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] relative flex flex-col p-8 pt-[120px] md:p-16 md:pt-[180px]">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

      <button 
        onClick={onBack}
        className="flex items-center space-x-4 md:space-x-6 text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-50 hover:opacity-100 transition-opacity w-max mb-16 p-4 -ml-4"
      >
        <ArrowLeft size={16} />
        <span>Return to Boutique</span>
      </button>

      <div className="max-w-2xl mx-auto w-full space-y-16">
         <div className="text-center space-y-6 md:space-y-4">
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-white">Acquisition Status</h2>
           <p className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-40 italic">Track your masterpiece</p>
         </div>

         <form onSubmit={fetchOrder} className="relative">
           <input 
             type="text" 
             value={orderId}
             onChange={(e) => setOrderId(e.target.value)}
             placeholder="Enter Acquisition Reference (e.g., rzp_...)"
             className="w-full bg-white/[0.02] border border-white/10 px-8 py-6 text-sm font-light text-white outline-none focus:border-[#D4AF37] transition-all pl-16 disabled:opacity-50"
             disabled={loading}
           />
           <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" />
           <button 
             type="submit" 
             disabled={loading || !orderId.trim()}
             className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#D4AF37] text-black text-xs md:text-[10px] uppercase tracking-[0.2em] px-6 py-4 font-medium hover:bg-white transition-all disabled:opacity-50"
           >
             {loading ? 'Searching...' : 'Locate'}
           </button>
         </form>

         {error && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-center text-sm font-light italic">
             {error}
           </motion.div>
         )}

         {order && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }} 
             animate={{ opacity: 1, y: 0 }}
             className="bg-white/[0.02] border border-white/5 p-8 md:p-12 space-y-12"
           >
              <div className="space-y-2">
                 <h3 className="text-sm md:text-[12px] uppercase tracking-[0.3em] font-light">Reference: {order.orderId}</h3>
                 <p className="text-sm italic opacity-50">Placed on {new Date(order.createdAt).toLocaleDateString()} for {order.customerName}</p>
                 <p className="text-[#D4AF37] text-xl font-light">₹{order.totalAmount.toLocaleString('en-IN')}</p>
              </div>

              {/* Progress Tracker */}
              <div className="relative pt-8">
                 <div className="absolute top-12 left-0 w-full h-[2px] bg-white/5"></div>
                 <div 
                   className="absolute top-12 left-0 h-[2px] bg-[#D4AF37] transition-all duration-1000"
                   style={{ width: `${((getStatusStep(order.status) - 1) / 3) * 100}%` }}
                 ></div>

                 <div className="relative flex justify-between items-start z-10">
                    {[
                      { key: 'pending', label: 'Payment Confirmed', icon: Package },
                      { key: 'processing', label: 'Artisanal Assembly', icon: Truck },
                      { key: 'shipped', label: 'In Transit', icon: PackageOpen },
                      { key: 'delivered', label: 'Secured', icon: CheckCircle }
                    ].map((step, idx) => {
                      const active = getStatusStep(order.status) >= idx + 1;
                      const Icon = step.icon;
                      
                      return (
                        <div key={idx} className="flex flex-col items-center space-y-6 md:space-y-4 w-1/4">
                          <div className={`w-10 h-10 rounded-full border flex items-center justify-center bg-[#050505] transition-all duration-700 ${active ? 'border-[#D4AF37] text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/10 text-white/20'}`}>
                            <Icon size={16} />
                          </div>
                          <span className={`text-xs md:text-[10px] uppercase tracking-widest text-center ${active ? 'text-white' : 'text-white/30'}`}>
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                 </div>
              </div>

              <div className="border-t border-white/5 pt-12 space-y-6">
                 <h4 className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-40">Acquired Masterpieces</h4>
                 <div className="space-y-6 md:space-y-4">
                   {order.items.map((item, idx) => (
                     <div key={idx} className="flex items-center space-x-6 bg-white/[0.01] p-4 border border-white/5">
                        <img loading="lazy" src={item.image || undefined} alt={item.name} className="w-16 h-16 object-contain filter grayscale" />
                        <div>
                          <p className="text-sm uppercase tracking-widest font-light">{item.name}</p>
                          <p className="text-xs md:text-[10px] uppercase tracking-widest opacity-40 tabular-nums">Qty: 1</p>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

              {order.updates && order.updates.length > 0 && (
                <div className="border-t border-white/5 pt-12 space-y-6">
                   <h4 className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-40">Acquisition Timeline Logs</h4>
                   <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                     {order.updates.sort((a,b) => b.timestamp - a.timestamp).map((update, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                           <div className="flex items-center justify-center w-3 h-3 rounded-full border border-white/20 bg-[#050505] text-[#D4AF37] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#050505] z-10"></div>
                           <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] bg-white/[0.02] p-4 border border-white/5 space-y-2 relative before:absolute before:-left-3 md:before:-left-5 before:top-4 before:h-px before:w-3 md:before:w-5 before:bg-white/10 md:group-odd:before:-right-5 md:group-odd:before:left-auto md:group-even:before:-left-5">
                             <p className="text-xs md:text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">{new Date(update.timestamp).toLocaleString()}</p>
                             <p className="text-xs font-light tracking-wide text-white/80">{update.message}</p>
                           </div>
                        </div>
                     ))}
                   </div>
                </div>
              )}
           </motion.div>
         )}
      </div>
    </div>
  );
}
