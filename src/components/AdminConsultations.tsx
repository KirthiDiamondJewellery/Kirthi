import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Check, X, Loader2, Trash2, Mail, Phone, Calendar } from 'lucide-react';

interface Consultation {
  id: string;
  category: string;
  style: string;
  metal: string;
  budget: string;
  occasion: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  attachment?: string;
  status: 'pending' | 'contacted' | 'resolved';
  createdAt: string;
}

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Consultation));
      setConsultations(results);
      setLoading(false);
    }, (error: any) => {
      console.warn("Issue fetching consultations:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateStatus = async (id: string, newStatus: Consultation['status']) => {
    setProcessingId(id);
    try {
      await updateDoc(doc(db, 'consultations', id), {
        status: newStatus
      });
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this inquiry?")) return;
    setProcessingId(id);
    try {
      await deleteDoc(doc(db, 'consultations', id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete inquiry.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin opacity-50" size={32} />
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-20 border border-white/5 bg-white/[0.01]">
        <h3 className="text-xl font-serif italic text-white/50">No Consultations</h3>
        <p className="text-sm opacity-40 mt-2">Bespoke commission inquiries will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 mb-8">
         <h2 className="text-2xl font-serif italic text-white/90">Bespoke Inquiries</h2>
         <p className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-40">Review Commission Requests</p>
      </div>

      <div className="space-y-6">
        {consultations.map((consultation) => (
          <div key={consultation.id} className="bg-white/5 border border-white/10 p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-xs md:text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm border ${consultation.status === 'pending' ? 'border-yellow-500/50 text-yellow-500' : consultation.status === 'contacted' ? 'border-blue-500/50 text-blue-500' : 'border-green-500/50 text-green-500'}`}>
                  {consultation.status}
                </span>
                <span className="text-xs md:text-[10px] opacity-40">{new Date(consultation.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div>
                <h3 className="text-xl font-serif italic">{consultation.name}</h3>
                <div className="flex items-center gap-2 mt-2 opacity-60">
                  <Mail size={12} /> <a href={`mailto:${consultation.email}`} className="text-xs hover:text-[#D4AF37]">{consultation.email}</a>
                </div>
                <div className="flex items-center gap-2 mt-1 opacity-60">
                  <Phone size={12} /> <a href={`tel:${consultation.phone}`} className="text-xs hover:text-[#D4AF37]">{consultation.phone}</a>
                </div>
              </div>

              {consultation.attachment && (
                <div className="mt-4 border border-white/10 p-2">
                  <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2">Attached Reference</p>
                  {consultation.attachment.startsWith('data:image') ? (
                     <img src={consultation.attachment} alt="Attachment" className="max-w-full h-auto object-contain border border-white/5" />
                  ) : (
                     <a href={consultation.attachment} download="consultation_attachment" className="text-xs text-blue-400 underline">Download Attachment</a>
                  )}
                </div>
              )}
            </div>

            <div className="w-full md:w-2/3 flex flex-col space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 border border-white/5 rounded-sm">
                  <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">Category & Style</p>
                  <p className="text-sm">{consultation.category} ({consultation.style})</p>
                </div>
                <div className="bg-black/30 p-4 border border-white/5 rounded-sm">
                  <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">Metal</p>
                  <p className="text-sm">{consultation.metal}</p>
                </div>
                <div className="bg-black/30 p-4 border border-white/5 rounded-sm">
                  <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">Budget</p>
                  <p className="text-sm">{consultation.budget}</p>
                </div>
                <div className="bg-black/30 p-4 border border-white/5 rounded-sm">
                  <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">Occasion</p>
                  <p className="text-sm">{consultation.occasion}</p>
                </div>
              </div>

              {consultation.message && (
                 <div className="bg-black/50 p-6 rounded-sm border border-white/5">
                   <h4 className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-2">Additional Details</h4>
                   <p className="text-sm font-light opacity-80 leading-relaxed whitespace-pre-wrap italic">
                     "{consultation.message}"
                   </p>
                 </div>
              )}

              <div className="flex justify-start gap-4 mt-auto pt-4 border-t border-white/5">
                {consultation.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(consultation.id, 'contacted')}
                    disabled={processingId === consultation.id}
                    className="px-4 py-2 border border-[#D4AF37]/50 text-[#D4AF37] text-xs uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {processingId === consultation.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Mark Contacted
                  </button>
                )}
                {consultation.status === 'contacted' && (
                  <button
                    onClick={() => updateStatus(consultation.id, 'resolved')}
                    disabled={processingId === consultation.id}
                    className="px-4 py-2 bg-[#D4AF37] text-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {processingId === consultation.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Mark Resolved
                  </button>
                )}
                <button
                  onClick={() => handleDelete(consultation.id)}
                  disabled={processingId === consultation.id}
                  className="px-4 py-2 text-red-500/80 border border-red-500/20 text-xs uppercase tracking-widest hover:bg-red-500/10 transition-colors flex items-center gap-2 disabled:opacity-50 ml-auto"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
