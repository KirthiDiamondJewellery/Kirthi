import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Loader2 } from 'lucide-react';
import { VideoFacade } from './VideoFacade';
import { HeadlessVideoPlayer } from './HeadlessVideoPlayer';

const PAGE_KEYS = [
  { id: 'methodology', label: 'Methodology Page' },
  { id: 'bespoke', label: 'Bespoke (Inside the Workshop)' }
];

export function AdminVideos() {
  const [selectedPage, setSelectedPage] = useState(PAGE_KEYS[0].id);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  
  const [videoData, setVideoData] = useState({
    videoUrl: '',
    mobileVideoUrl: '',
    posterUrl: '',
    title: '',
    description: '',
    uploadDate: '',
    duration: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const fetchVideoData = async (pageId: string) => {
    try {
      const docRef = doc(db, 'site_content_pageVideos', pageId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as any;
        setVideoData({
          videoUrl: data.videoUrl || data.youtubeUrl || '',
          mobileVideoUrl: data.mobileVideoUrl || '',
          posterUrl: data.posterUrl || '',
          title: data.title || '',
          description: data.description || '',
          uploadDate: data.uploadDate || '',
          duration: data.duration || ''
        });
      } else {
        setVideoData({ videoUrl: '', mobileVideoUrl: '', posterUrl: '', title: '', description: '', uploadDate: '', duration: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePosterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setSaving(true);
    
    try {
      const { uploadImage } = await import('../utils/imageUpload');
      const url = await uploadImage(file);
      setVideoData(prev => ({ ...prev, posterUrl: url }));
    } catch (err: any) {
      setUploadError('Upload failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };


  useEffect(() => {
    fetchVideoData(selectedPage);
  }, [selectedPage]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'site_content_pageVideos', selectedPage);
      await setDoc(docRef, videoData);
      alert('Saved successfully');
    } catch (e) {
      console.error(e);
      alert('Error saving');
    }
    setSaving(false);
  };

  

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 space-y-8">
      <h2 className="text-xl font-serif text-white/90">Video Manager</h2>
      <p className="text-sm text-white/50 tracking-wide">
        Manage YouTube background videos and video facades across the platform.
        Because videos are YouTube-hosted, enter the YouTube URL and metadata to generate correct Schema.org VideoObjects.
      </p>

      
      <div className="flex space-x-4 mb-6">
        {PAGE_KEYS.map(p => (
          <button 
            key={p.id}
            onClick={() => setSelectedPage(p.id)}
            className={`px-4 py-2 text-xs uppercase tracking-widest border rounded ${selectedPage === p.id ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/10 text-white/50'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#D4AF37]" /></div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded text-red-500 text-sm">
                  {uploadError}
                </div>
              )}
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Mobile Video URL (Optional)</label>
                <input type="text" value={videoData.mobileVideoUrl} onChange={e => setVideoData({...videoData, mobileVideoUrl: e.target.value})} placeholder="e.g., optimized mp4 or drive url" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors" disabled={saving} />
                {videoData.mobileVideoUrl && <p className="text-xs text-green-500/70 mt-2 truncate">Current: {videoData.mobileVideoUrl}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Video URL (YouTube, Vimeo, Google Drive)</label>
                <input type="text" value={videoData.videoUrl} onChange={e => setVideoData({...videoData, videoUrl: e.target.value})} placeholder="e.g., https://youtube.com/watch?v=..." className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors" disabled={saving} />
                {uploadProgress > 0 && <p className="text-xs text-[#D4AF37] mt-2">Uploading: {Math.round(uploadProgress)}%</p>}
                {videoData.videoUrl && <p className="text-xs text-green-500/70 mt-2 truncate">Current: {videoData.videoUrl}</p>}
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Upload Poster Image</label>
                <input type="file" accept="image/*" onChange={handlePosterChange} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors" disabled={saving} />
                {videoData.posterUrl && <p className="text-xs text-green-500/70 mt-2 truncate">Current: {videoData.posterUrl}</p>}
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Video Title (Schema & SEO)</label>
                <input type="text" value={videoData.title} onChange={e => setVideoData({...videoData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Video Description</label>
                <textarea rows={3} value={videoData.description} onChange={e => setVideoData({...videoData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Upload Date</label>
                  <input type="text" value={videoData.uploadDate} onChange={e => setVideoData({...videoData, uploadDate: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors" placeholder="YYYY-MM-DD" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Duration (ISO 8601)</label>
                  <input type="text" value={videoData.duration} onChange={e => setVideoData({...videoData, duration: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors" placeholder="e.g. PT1M30S" />
                </div>
              </div>
              
              <button onClick={handleSave} disabled={saving || !videoData.videoUrl} className="w-full bg-[#D4AF37] text-black py-4 text-sm font-medium tracking-widest uppercase flex items-center justify-center space-x-2 hover:bg-white transition-colors disabled:opacity-50">
                {saving && uploadProgress === 0 ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Video Metadata</span>
              </button>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-4">Preview</label>
              <div className="bg-black/50 border border-white/10 rounded-xl p-4">
                {videoData.videoUrl ? (
                  <div className="w-full aspect-video rounded object-cover overflow-hidden relative">
                    <HeadlessVideoPlayer url={videoData.videoUrl} brightnessClass="brightness-[0.9]" />
                  </div>
                ) : (
                  <div className="aspect-video bg-white/5 flex items-center justify-center">
                    <p className="text-xs text-white/30 tracking-widest uppercase">No Video Configured</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
