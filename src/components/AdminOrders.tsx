import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Package, Truck, CheckCircle, PackageOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '../constants';

interface OrderUpdate {
  message: string;
  timestamp: number;
}

interface Order {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: Product[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: number;
  updates?: OrderUpdate[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push(doc.data() as Order);
      });
      setOrders(ordersData);
    } catch (error: any) {
      if (error?.code === 'resource-exhausted' || error?.message?.includes?.('Quota') || error?.message?.includes?.('quota')) {
        console.warn("Firestore quota exceeded for orders.");
      } else {
        console.warn("Error fetching orders:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdating(true);
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus
      });
      // Update local state
      setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddUpdate = async (orderId: string, currentOrder: Order) => {
    if (!updateMessage.trim()) return;
    setUpdating(true);
    try {
      // eslint-disable-next-line react-hooks/purity
      const timestamp = Date.now();
      const newUpdate: OrderUpdate = {
        message: updateMessage,
        timestamp: timestamp
      };
      
      const updatedHistory = [...(currentOrder.updates || []), newUpdate];
      
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        updates: updatedHistory
      });
      
      // Update local state
      setOrders(orders.map(o => o.orderId === orderId ? { ...o, updates: updatedHistory } : o));
      setUpdateMessage('');
    } catch (error) {
      console.error("Error adding update:", error);
      alert("Failed to add update");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-6 md:space-y-4">
        <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
        <p className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Loading Orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="text-sm uppercase tracking-[0.3em] font-light">Client Acquisitions</h2>
        <span className="text-xs md:text-[10px] opacity-50 uppercase tracking-widest">{orders.length} Total</span>
      </div>

      <div className="space-y-6 md:space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-3 md:py-12 text-white/30 text-xs italic">No orders found.</div>
        ) : (
          orders.map(order => (
            <div key={order.orderId} className="bg-black/40 border border-white/5 overflow-hidden">
              {/* Order Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-4 md:gap-3">
                    <h3 className="text-sm font-medium">{order.orderId}</h3>
                    <span className={`text-xs md:text-[10px] uppercase tracking-widest px-2 py-3 md:py-1 rounded-sm ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 
                      order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">
                    {order.customerName} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-6">
                  <span className="text-[#D4AF37] font-light">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  {expandedOrder === order.orderId ? <ChevronUp size={16} className="opacity-50" /> : <ChevronDown size={16} className="opacity-50" />}
                </div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order.orderId && (
                <div className="p-6 border-t border-white/5 bg-black/60 space-y-8">
                  {/* Shipping & Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6 md:space-y-4">
                      <h4 className="text-xs md:text-[10px] uppercase tracking-[0.3em] opacity-40">Client Details</h4>
                      <div className="space-y-1 text-sm font-light text-white/80">
                        <p>{order.customerName}</p>
                        <p>{order.email}</p>
                        <p>{order.phone}</p>
                        <p className="pt-2 italic text-xs">{order.address}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6 md:space-y-4">
                      <h4 className="text-xs md:text-[10px] uppercase tracking-[0.3em] opacity-40">Acquired Masterpieces</h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-4 md:space-x-6 border border-white/5 p-3">
                            <img loading="lazy" src={item.image || undefined} alt={item.name} className="w-12 h-12 object-contain filter grayscale bg-white/5" />
                            <div>
                              <p className="text-sm md:text-[11px] uppercase tracking-widest">{item.name}</p>
                              <p className="text-xs md:text-[10px] opacity-40">Qty: 1</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Management */}
                  <div className="space-y-6 md:space-y-4 border-t border-white/5 pt-6">
                    <h4 className="text-xs md:text-[10px] uppercase tracking-[0.3em] opacity-40">Manage Status</h4>
                    <div className="flex flex-wrap gap-4">
                      {(['pending', 'processing', 'shipped', 'delivered'] as const).map(status => (
                        <button
                          key={status}
                          disabled={updating || order.status === status}
                          onClick={(e) => {
                             e.stopPropagation();
                             handleStatusUpdate(order.orderId, status);
                          }}
                          className={`text-xs md:text-[10px] uppercase tracking-[0.2em] px-4 py-3 md:py-2 transition-all ${
                            order.status === status 
                              ? 'bg-[#D4AF37] text-black border border-[#D4AF37]' 
                              : 'bg-transparent text-white/50 border border-white/20 hover:border-white/50 hover:text-white'
                          } disabled:opacity-50`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Updates History */}
                  <div className="space-y-6 md:space-y-4 border-t border-white/5 pt-6">
                    <h4 className="text-xs md:text-[10px] uppercase tracking-[0.3em] opacity-40">Order Timeline Updates</h4>
                    
                    <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                      {order.updates && order.updates.length > 0 ? (
                        order.updates.map((update, idx) => (
                          <div key={idx} className="flex items-start space-x-4 md:space-x-6">
                            <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 opacity-50 shrink-0" />
                            <div>
                              <p className="text-xs text-white/80">{update.message}</p>
                              <p className="text-xs md:text-[10px] uppercase tracking-widest opacity-40 mt-1">
                                {new Date(update.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs md:text-[10px] opacity-30 italic">No timeline updates added yet.</p>
                      )}
                    </div>

                    <div className="flex gap-4 pt-2">
                      <input 
                        type="text" 
                        value={updateMessage}
                        onChange={(e) => setUpdateMessage(e.target.value)}
                        placeholder="Add a timeline update for the client..."
                        className="flex-1 bg-black/50 border border-white/10 p-3 text-xs focus:border-[#D4AF37] outline-none"
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddUpdate(order.orderId, order);
                        }}
                        disabled={updating || !updateMessage.trim()}
                        className="bg-[#D4AF37] text-black text-xs md:text-[10px] uppercase tracking-[0.2em] px-6 py-4 md:py-3 font-medium hover:bg-white transition-all disabled:opacity-50 shrink-0"
                      >
                        Add Update
                      </button>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
