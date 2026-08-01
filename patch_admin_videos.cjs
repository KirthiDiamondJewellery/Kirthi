const fs = require('fs');
let content = fs.readFileSync('src/components/AdminVideos.tsx', 'utf8');

content = content.replace("import { db } from '../lib/firebase';", "import { db, storage } from '../lib/firebase';\nimport { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';");

const newAdminVideos = `
  const [videoData, setVideoData] = useState({
    videoUrl: '',
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
          posterUrl: data.posterUrl || '',
          title: data.title || '',
          description: data.description || '',
          uploadDate: data.uploadDate || '',
          duration: data.duration || ''
        });
      } else {
        setVideoData({ videoUrl: '', posterUrl: '', title: '', description: '', uploadDate: '', duration: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'poster') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'video') {
      if (file.type !== 'video/mp4' && file.type !== 'video/webm') {
        setUploadError('Only MP4 and WebM videos are supported.');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setUploadError('Video size must be less than 100MB.');
        return;
      }
    }

    setUploadError('');
    setSaving(true);
    
    const storageRef = ref(storage, \`videos/\${selectedPage}_\${type}_\${Date.now()}\`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (type === 'video') setUploadProgress(progress);
      }, 
      (error) => {
        console.error('Upload failed', error);
        setUploadError('Upload failed: ' + error.message);
        setSaving(false);
        setUploadProgress(0);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setVideoData(prev => ({
          ...prev,
          [type === 'video' ? 'videoUrl' : 'posterUrl']: downloadURL
        }));
        setSaving(false);
        setUploadProgress(0);
      }
    );
  };
`;

content = content.replace(/const \[videoData[\s\S]*?fetchVideoData = async[\s\S]*?catch \(e\) {[\s\S]*?console\.error\(e\);\n    }\n    \/\/ setLoading\(false\);\n  };/, newAdminVideos);

const newUI = `
      <div className="flex space-x-4 mb-6">
        {PAGE_KEYS.map(p => (
          <button 
            key={p.id}
            onClick={() => setSelectedPage(p.id)}
            className={\`px-4 py-2 text-xs uppercase tracking-widest border rounded \${selectedPage === p.id ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/10 text-white/50'}\`}
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
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Upload Video (MP4/WebM, max 100MB)</label>
                <input type="file" accept="video/mp4,video/webm" onChange={e => handleFileChange(e, 'video')} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors" disabled={saving} />
                {uploadProgress > 0 && <p className="text-xs text-[#D4AF37] mt-2">Uploading: {Math.round(uploadProgress)}%</p>}
                {videoData.videoUrl && <p className="text-xs text-green-500/70 mt-2 truncate">Current: {videoData.videoUrl}</p>}
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Upload Poster Image</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'poster')} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors" disabled={saving} />
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
                  <video 
                    controls 
                    playsInline 
                    preload="metadata" 
                    poster={videoData.posterUrl}
                    className="w-full aspect-video rounded object-cover"
                  >
                    <source src={videoData.videoUrl} type={videoData.videoUrl.includes('webm') ? 'video/webm' : 'video/mp4'} />
                    Your browser does not support the video tag.
                  </video>
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
`;

content = content.replace(/<div className="flex space-x-4 mb-6">[\s\S]*?<\/div>\s*<\/div>\s*\)}/m, newUI + "\n    </div>\n  )}");

// Remove extractVideoId usage
content = content.replace(/const videoId = extractVideoId\(videoData\.youtubeUrl\);/, "");
content = content.replace(/const extractVideoId = [\s\S]*?};\n/, "");
fs.writeFileSync('src/components/AdminVideos.tsx', content);
