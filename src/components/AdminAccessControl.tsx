import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Plus, Trash2, Loader2, ShieldCheck, Mail } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  addedAt: string;
}

export default function AdminAccessControl({ currentUserEmail }: { currentUserEmail: string }) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newUid, setNewUid] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const fetchAdmins = async () => {
    try {
      const snap = await getDocs(collection(db, 'admins'));
      const adminList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AdminUser[];
      setAdmins(adminList);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load admins: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@') || !newUid) {
      setError("Please provide a valid email and User UID.");
      return;
    }
    setAdding(true);
    setError('');
    try {
      await setDoc(doc(db, 'admins', newUid), {
        email: newEmail.toLowerCase().trim(),
        addedAt: new Date().toISOString()
      });
      setNewEmail('');
      setNewUid('');
      await fetchAdmins();
      alert(`User ${newEmail} added as an admin.`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to add admin: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (id: string, email: string) => {
    if (email === 'shekar.v.menon@gmail.com') {
      alert("Cannot remove the master admin.");
      return;
    }
    if (!window.confirm(`Are you sure you want to revoke admin access for ${email}?`)) return;
    try {
      await deleteDoc(doc(db, 'admins', id));
      await fetchAdmins();
    } catch (err: any) {
      console.error(err);
      alert("Failed to remove admin: " + err.message);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-white/50 text-xs tracking-widest"><Loader2 className="animate-spin inline-block mr-2" size={16} /> Loading Access Data...</div>;
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-serif italic text-white mb-2">Access Control</h2>
        <p className="text-xs uppercase tracking-[0.2em] opacity-40">Manage Security Protocols and Personnel</p>
      </div>

      <div className="bg-black/40 border border-white/5 p-6 space-y-6">
        <h3 className="text-xs uppercase tracking-[0.3em] font-medium border-b border-white/10 pb-4 flex items-center space-x-2">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <span>Active Administrators</span>
        </h3>
        {error && <div className="text-red-400 bg-red-400/10 p-3 text-xs">{error}</div>}
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border border-[#D4AF37]/30 bg-[#D4AF37]/5">
            <div>
              <div className="text-sm">shekar.v.menon@gmail.com</div>
              <div className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Master Administrator</div>
            </div>
            <div className="text-[10px] text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/20 px-2 py-1">System Default</div>
          </div>
          {admins.map(admin => (
            <div key={admin.id} className="flex justify-between items-center p-4 border border-white/5">
              <div>
                <div className="text-sm flex items-center space-x-2">
                  <Mail size={12} className="opacity-50" />
                  <span>{admin.email}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest opacity-50 mt-1">UID: {admin.id}</div>
              </div>
              <button 
                onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                className="text-xs tracking-widest uppercase text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 transition-all flex items-center space-x-2"
              >
                <Trash2 size={14} /> <span>Revoke</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black/40 border border-[#D4AF37]/20 p-6 space-y-6">
        <h3 className="text-xs uppercase tracking-[0.3em] font-medium border-b border-[#D4AF37]/20 pb-4 text-[#D4AF37]">
          Grant Access
        </h3>
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">User Firebase UID</label>
              <input 
                type="text" 
                value={newUid} 
                onChange={e => setNewUid(e.target.value)}
                placeholder="e.g. A1B2c3D4e5..." 
                className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none placeholder:opacity-30" 
              />
              <p className="text-[10px] text-white/30">The external user must authenticate via Firebase first to obtain their UID.</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">User Email Address</label>
              <input 
                type="email" 
                value={newEmail} 
                onChange={e => setNewEmail(e.target.value)}
                placeholder="colleague@example.com" 
                className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none placeholder:opacity-30" 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={adding}
            className="px-6 py-3 bg-[#D4AF37] text-black text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-white transition-all w-full md:w-auto disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {adding ? <><Loader2 size={14} className="animate-spin" /><span>Processing</span></> : <><Plus size={14} /><span>Add Administrator</span></>}
          </button>
        </form>
      </div>
    </div>
  );
}
