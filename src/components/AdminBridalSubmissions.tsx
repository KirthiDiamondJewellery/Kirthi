import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Check, X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

interface BridalSubmission {
  id: string;
  name: string;
  email: string;
  story: string;
  images: string[];
  weddingDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminBridalSubmissions() {
  const [submissions, setSubmissions] = useState<BridalSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { content, updateContent } = useContent();

  useEffect(() => {
    const q = query(collection(db, 'bridalSubmissions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BridalSubmission));
      setSubmissions(subs);
      setLoading(false);
    }, (error: any) => {
      if (error?.code === 'resource-exhausted' || error?.message?.includes?.('Quota') || error?.message?.includes?.('quota')) {
        console.warn("Firestore quota exceeded for submissions.");
      } else {
        console.warn("Issue fetching submissions:", error);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleApprove = async (sub: BridalSubmission) => {
    setProcessingId(sub.id);
    try {
      // Add to brideGallery
      const currentGallery = content.brideGallery || [];
      const newBride = {
        id: `bride-${sub.id}`,
        name: sub.name,
        story: sub.story,
        description: '', // optional description
        image: sub.images[0] || '',
        images: sub.images,
        weddingDate: sub.weddingDate
      };
      
      await updateContent({
        brideGallery: [newBride, ...currentGallery]
      });

      // Update submission status
      await updateDoc(doc(db, 'bridalSubmissions', sub.id), {
        status: 'approved'
      });
      alert('Approved and added to Patron Showcase.');
    } catch (err) {
      console.error(err);
      alert('Failed to approve submission.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Are you sure you want to reject this submission?")) return;
    setProcessingId(id);
    try {
      await updateDoc(doc(db, 'bridalSubmissions', id), {
        status: 'rejected'
      });
    } catch (err) {
      console.error(err);
      alert('Failed to reject submission.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this submission?")) return;
    setProcessingId(id);
    try {
      await deleteDoc(doc(db, 'bridalSubmissions', id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete submission.');
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

  if (submissions.length === 0) {
    return (
      <div className="text-center py-20 border border-white/5 bg-white/[0.01]">
        <h3 className="text-xl font-serif italic text-white/50">No Submissions</h3>
        <p className="text-sm opacity-40 mt-2">Patron stories submitted will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 mb-8">
         <h2 className="text-2xl font-serif italic text-white/90">User Submissions</h2>
         <p className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-40">Review Patron Stories</p>
      </div>

      <div className="space-y-6">
        {submissions.map((sub) => (
          <div key={sub.id} className="bg-white/5 border border-white/10 p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-6 md:space-y-4">
              <div className="flex items-center gap-4 md:gap-2 mb-4">
                <span className={`text-xs md:text-[10px] uppercase tracking-widest px-2 py-3 md:py-1 rounded-sm border ${sub.status === 'pending' ? 'border-yellow-500/50 text-yellow-500' : sub.status === 'approved' ? 'border-green-500/50 text-green-500' : 'border-red-500/50 text-red-500'}`}>
                  {sub.status}
                </span>
                <span className="text-xs md:text-[10px] opacity-40">{new Date(sub.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-serif italic">{sub.name}</h3>
              <p className="text-xs opacity-50">{sub.email}</p>
              {sub.weddingDate && (
                <p className="text-xs opacity-50 mt-1">Wedding Date: {sub.weddingDate}</p>
              )}
              <div className="grid grid-cols-2 gap-4 md:gap-2 mt-4">
                {sub.images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-black border border-white/10">
                    <img loading="lazy" src={img || undefined} alt="Submission" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col justify-between space-y-6">
              <div className="bg-black/50 p-6 rounded-sm border border-white/5 flex-1">
                <h4 className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-40 mb-4">Submitted Story</h4>
                <p className="text-sm font-light opacity-80 leading-relaxed whitespace-pre-wrap italic">
                  "{sub.story}"
                </p>
              </div>

              <div className="flex justify-end gap-4">
                {sub.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(sub)}
                      disabled={processingId === sub.id}
                      className="px-6 py-3 bg-[#D4AF37] text-black text-xs md:text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-colors flex items-center gap-4 md:gap-2 disabled:opacity-50"
                    >
                      {processingId === sub.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve & Add
                    </button>
                    <button
                      onClick={() => handleReject(sub.id)}
                      disabled={processingId === sub.id}
                      className="px-6 py-3 border border-white/20 text-xs md:text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-colors flex items-center gap-4 md:gap-2 disabled:opacity-50"
                    >
                      {processingId === sub.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(sub.id)}
                  disabled={processingId === sub.id}
                  className="px-6 py-3 text-red-500 border border-red-500/20 text-xs md:text-[10px] uppercase tracking-[0.2em] hover:bg-red-500/10 transition-colors flex items-center gap-4 md:gap-2 disabled:opacity-50 ml-auto"
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
