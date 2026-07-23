import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { uploadImage } from './AdminView';

export default function BridalSubmissionModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', story: '', weddingDate: '' });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newImages = [...images];
      for (let i = 0; i < files.length; i++) {
         const base64 = await uploadImage(files[i]);
         newImages.push(base64);
      }
      setImages(newImages);
    } catch(err: any) {
      alert(err.message || "Error processing images.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.story || images.length === 0) {
      alert("Please fill in all fields and upload at least one image.");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'bridalSubmissions'), {
        ...formData,
        images,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit story. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-8 md:p-12 relative overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 opacity-50 hover:opacity-100 transition-opacity z-50">
              <X size={24} />
            </button>

            {success ? (
              <div className="text-center py-20 space-y-6">
                <h3 className="text-3xl font-serif italic text-[#D4AF37]">Thank You</h3>
                <p className="text-sm opacity-60 max-w-md mx-auto leading-relaxed">
                  Your story has been received. Our team will review your submission to be featured in our Patron Showcase. We are honored to be part of your legacy.
                </p>
                <button 
                  onClick={onClose}
                  className="mt-8 px-8 py-3 border border-white/20 text-xs md:text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
                >
                  Return to Showcase
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center space-y-6 md:space-y-4">
                  <h3 className="text-2xl md:text-3xl font-serif italic">Submit Your Story</h3>
                  <p className="text-sm opacity-60 font-light leading-relaxed max-w-md mx-auto">
                    Share your cherished legacy with us. Upload your moments and the story behind your Kirthi experience.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Full Name</label>
                       <input 
                         type="text" 
                         required
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-transparent border-b border-white/20 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                         placeholder="Your name"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Email Address</label>
                       <input 
                         type="email" 
                         required
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full bg-transparent border-b border-white/20 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                         placeholder="Your email address"
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Wedding Date (Optional)</label>
                     <input 
                       type="date"
                       value={formData.weddingDate}
                       onChange={(e) => setFormData({...formData, weddingDate: e.target.value})}
                       className="w-full bg-transparent text-white border-b border-white/20 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
                     />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Your Story</label>
                    <textarea 
                      required
                      value={formData.story}
                      onChange={(e) => setFormData({...formData, story: e.target.value})}
                      className="w-full bg-transparent border border-white/20 p-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[150px] resize-none"
                      placeholder="Share your story and your experience with our jewellery..."
                    />
                  </div>

                  <div className="space-y-6 md:space-y-4">
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Photos</label>
                    <div className="flex flex-wrap gap-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="w-24 h-24 border border-white/10 relative overflow-hidden">
                          <img src={img || undefined} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <label className="w-24 h-24 border border-white/10 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative">
                        {uploading ? (
                          <Loader2 size={24} className="animate-spin opacity-50" />
                        ) : (
                          <>
                            <Upload size={20} className="mb-2 opacity-50" />
                            <span className="text-xs md:text-[10px] opacity-50 uppercase tracking-widest">Upload</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#D4AF37] text-black py-4 text-sm md:text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-white transition-colors flex items-center justify-center"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit Story'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
