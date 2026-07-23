import React, { useState } from 'react';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../lib/firebase';
import { doc, getDoc, collection, getDocs, deleteDoc, setDoc, query, startAfter, limit } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useContent, SiteContent } from '../contexts/ContentContext';
import { X, Plus, Trash2, Image as ImageIcon, Loader2, Star, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminOrders from './AdminOrders';
import AdminAnalytics from './AdminAnalytics';
import AdminBridalSubmissions from './AdminBridalSubmissions';
import AdminConsultations from './AdminConsultations';
import AdminAccessControl from './AdminAccessControl';
import AdminSEO from './AdminSEO';

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      
      // If SVG or GIF, avoid canvas to preserve vectors/animations
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 3000;
        const MAX_HEIGHT = 3000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        const isPng = file.type === 'image/png';
        const format = isPng ? 'image/png' : 'image/webp';
        const quality = 0.95;
        
        const tryCompress = (w: number, h: number, q: number) => {
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, w, h);
          ctx?.drawImage(img, 0, 0, w, h);
          return canvas.toDataURL(format, q);
        };
        
        const base64 = tryCompress(width, height, quality);
        
        // Remove aggressive downscaling since this goes to Firebase Storage
        resolve(base64);
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to upload image");
  }
  
  const data = await res.json();
  return data.url;
};

function ImageUpload({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch(err: any) {
      alert(err.message || "Error processing image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 md:space-y-4 max-w-sm">
      <div className={`relative w-full aspect-square md:aspect-[4/3] border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 ${uploading ? 'opacity-50' : ''} ${value ? 'bg-black/40' : 'bg-black/20'}`}>
        {value ? (
          <>
            <img src={value || undefined} alt="Uploaded Image" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-black/60 px-2 py-3 md:py-1 text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37] backdrop-blur-md">
              Current
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-white/30 space-y-3">
             <ImageIcon size={32} strokeWidth={1} />
             <span className="text-xs md:text-[10px] uppercase tracking-widest">No Image</span>
          </div>
        )}
        
        {uploading && (
           <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 space-y-3">
             <Loader2 size={24} className="animate-spin text-[#D4AF37]" />
             <span className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Processing...</span>
           </div>
        )}
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <label className="flex-1 flex justify-center items-center space-x-2 text-xs md:text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] transition-all border border-[#D4AF37]/50 px-4 py-3">
          <ImageIcon size={14} />
          <span>{value ? 'Replace Image' : 'Upload Image'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      </div>

      <div className="flex items-end space-x-2 border-t border-white/5 pt-4">
        <div className="flex-1 space-y-2">
          <span className="text-xs md:text-[10px] opacity-30 block uppercase tracking-widest">Or paste URL</span>
          <input type="text" value={value} onChange={e => !uploading && onChange(e.target.value)} disabled={uploading} className="bg-transparent border-b border-white/20 text-xs w-full focus:border-[#D4AF37] transition-colors outline-none placeholder:opacity-20 p-2" placeholder="https://" />
        </div>
      </div>
    </div>
  );
}

function sanitizeAndNormalizeSVG(svgContent: string): string {
  try {
    let cleanedText = svgContent;
    
    // Remove XML declaration or other header wrappers
    cleanedText = cleanedText.replace(/^[\s\S]*?(<svg)/i, '$1');
    
    // Strip external CSS imports/links that trigger security blocks in canvas rendering
    cleanedText = cleanedText.replace(/@import\s+url\([^)]+\);?/gi, '');
    cleanedText = cleanedText.replace(/<link\s+[^>]*href=["'][^"']*["'][^>]*>/gi, '');

    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanedText, "image/svg+xml");
    
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      console.warn("DOMParser error for SVG, returning cleaned string directly:", parserError.textContent);
      return cleanedText;
    }
    
    const svgEl = doc.querySelector("svg");
    if (!svgEl) {
      return cleanedText;
    }

    // 1. Ensure xmlns is present
    if (!svgEl.getAttribute("xmlns")) {
      svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }

    // 2. Read attributes
    const widthAttr = svgEl.getAttribute("width");
    const heightAttr = svgEl.getAttribute("height");
    const viewBoxAttr = svgEl.getAttribute("viewBox");

    // Clean up width/height (remove "px", "%", etc.)
    const parseDim = (val: string | null): number | null => {
      if (!val) return null;
      if (val.includes('%')) return null; // percent sizes won't help canvas
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    };

    let width = parseDim(widthAttr);
    let height = parseDim(heightAttr);

    let vbX = 0, vbY = 0, vbW = 0, vbH = 0;
    let hasViewBox = false;
    if (viewBoxAttr) {
      const parts = viewBoxAttr.trim().split(/[\s,]+/);
      if (parts.length === 4) {
        vbX = parseFloat(parts[0]);
        vbY = parseFloat(parts[1]);
        vbW = parseFloat(parts[2]);
        vbH = parseFloat(parts[3]);
        if (!isNaN(vbX) && !isNaN(vbY) && !isNaN(vbW) && !isNaN(vbH)) {
          hasViewBox = true;
        }
      }
    }

    // Normalize width, height, and viewBox
    if (!width && !height && !hasViewBox) {
      width = 512;
      height = 512;
      svgEl.setAttribute("width", "512");
      svgEl.setAttribute("height", "512");
      svgEl.setAttribute("viewBox", "0 0 512 512");
    } else if (hasViewBox && (!width || !height)) {
      svgEl.setAttribute("width", vbW.toString());
      svgEl.setAttribute("height", vbH.toString());
    } else if ((width && height) && !hasViewBox) {
      svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);
    } else if (hasViewBox && width && height) {
      svgEl.setAttribute("width", width.toString());
      svgEl.setAttribute("height", height.toString());
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (e) {
    console.warn("SVG normalization failed:", e);
    return svgContent;
  }
}

function FaviconUpload({ 
  svgValue, 
  fav32,
  fav192,
  fav512,
  favApple,
  onChange 
}: { 
  svgValue: string; 
  fav32: string;
  fav192: string;
  fav512: string;
  favApple: string;
  onChange: (vals: { svg: string; fav32: string; fav192: string; fav512: string; favApple: string }) => void 
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
      setError("Please upload a valid SVG file (.svg). Only vector format is eligible for perfect responsive favicon generation.");
      return;
    }
    
    setProcessing(true);
    setError(null);
    setInfo(null);
    
    try {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onerror = () => {
        setError("Could not read uploaded SVG file.");
        setProcessing(false);
      };
      reader.onload = async (event) => {
        const svgContent = event.target?.result as string;
        
        if (!svgContent.trim().includes('<svg')) {
          setError("Invalid SVG format. The uploaded file must contain an <svg> tag.");
          setProcessing(false);
          return;
        }
        
        const normalizedSvg = sanitizeAndNormalizeSVG(svgContent);
        
        // Convert to Unicode-safe Base64 data URL to avoid iframe sandboxing/origin restrictions
        let base64Svg: string;
        try {
          base64Svg = btoa(unescape(encodeURIComponent(normalizedSvg)));
        } catch (e) {
          base64Svg = btoa(normalizedSvg);
        }
        const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;
        
        const saveWithFallback = (svgStr: string, warningMsg: string) => {
          onChange({
            svg: svgStr,
            fav32: '',
            fav192: '',
            fav512: '',
            favApple: ''
          });
          setInfo(warningMsg);
          setProcessing(false);
        };

        const tryLoadAndRasterize = (srcUrl: string, useFallbackOnFailure: boolean) => {
          const img = new Image();
          img.src = srcUrl;
          
          img.onload = () => {
            try {
              const sizes = {
                fav32: 32,
                fav180: 180,
                fav192: 192,
                fav512: 512
              };
              
              const results = {
                svg: normalizedSvg,
                fav32: '',
                fav192: '',
                fav512: '',
                favApple: ''
              };
              
              const canvas32 = document.createElement('canvas');
              canvas32.width = sizes.fav32;
              canvas32.height = sizes.fav32;
              const ctx32 = canvas32.getContext('2d');
              if (ctx32) {
                ctx32.clearRect(0, 0, 32, 32);
                ctx32.drawImage(img, 0, 0, 32, 32);
                results.fav32 = canvas32.toDataURL('image/png');
              }
              
              const canvas192 = document.createElement('canvas');
              canvas192.width = sizes.fav192;
              canvas192.height = sizes.fav192;
              const ctx192 = canvas192.getContext('2d');
              if (ctx192) {
                ctx192.clearRect(0, 0, 192, 192);
                ctx192.drawImage(img, 0, 0, 192, 192);
                results.fav192 = canvas192.toDataURL('image/png');
              }
              
              const canvas512 = document.createElement('canvas');
              canvas512.width = sizes.fav512;
              canvas512.height = sizes.fav512;
              const ctx512 = canvas512.getContext('2d');
              if (ctx512) {
                ctx512.clearRect(0, 0, 512, 512);
                ctx512.drawImage(img, 0, 0, 512, 512);
                results.fav512 = canvas512.toDataURL('image/png');
              }
              
              const canvasApple = document.createElement('canvas');
              canvasApple.width = sizes.fav180;
              canvasApple.height = sizes.fav180;
              const ctxApple = canvasApple.getContext('2d');
              if (ctxApple) {
                ctxApple.clearRect(0, 0, 180, 180);
                ctxApple.drawImage(img, 0, 0, 180, 180);
                results.favApple = canvasApple.toDataURL('image/png');
              }
              
              if (srcUrl.startsWith('blob:')) {
                URL.revokeObjectURL(srcUrl);
              }
              
              onChange(results);
              setInfo("Vector and responsive favicon sizes compiled successfully!");
              setProcessing(false);
            } catch (err: any) {
              console.error("Rasterization failed:", err);
              if (srcUrl.startsWith('blob:')) {
                URL.revokeObjectURL(srcUrl);
              }
              saveWithFallback(normalizedSvg, "SVG parsed but canvas rasterization failed. Vector SVG favicon is fully loaded, but responsive PNG copies were skipped.");
            }
          };
          
          img.onerror = (err) => {
            console.warn(`Failed to load SVG source image (${srcUrl.startsWith('data:') ? 'data url' : 'blob url'}):`, err);
            if (srcUrl.startsWith('blob:')) {
              URL.revokeObjectURL(srcUrl);
            }
            
            if (useFallbackOnFailure) {
              // Try standard Blob URL as a secondary attempt
              try {
                const blob = new Blob([normalizedSvg], { type: 'image/svg+xml;charset=utf-8' });
                const blobUrl = URL.createObjectURL(blob);
                tryLoadAndRasterize(blobUrl, false);
              } catch (blobErr) {
                saveWithFallback(normalizedSvg, "SVG uploaded! Direct SVG favicon is active, but PNG rasterization was bypassed in this preview environment.");
              }
            } else {
              // Gracefully fallback instead of throwing error and blocking
              saveWithFallback(normalizedSvg, "SVG uploaded! Direct SVG favicon is active, but PNG rasterization was bypassed in this preview environment.");
            }
          };
        };
        
        tryLoadAndRasterize(dataUrl, true);
      };
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during processing.");
      setProcessing(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to restore the default branded Kirthi Diamonds favicon?")) {
      setInfo(null);
      setError(null);
      onChange({
        svg: '',
        fav32: '',
        fav192: '',
        fav512: '',
        favApple: ''
      });
    }
  };

  return (
    <div className="space-y-6 bg-black/30 border border-white/5 p-6 rounded-sm">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-xs font-serif text-white uppercase tracking-widest">Dynamic Favicon Studio</h3>
          <p className="text-[10px] opacity-40 uppercase tracking-widest">Supports .svg vectors for perfect scaling</p>
        </div>
        {(svgValue || fav32) && (
          <button 
            type="button" 
            onClick={handleReset}
            className="text-[9px] uppercase tracking-widest text-[#D4AF37]/70 hover:text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-1 transition-colors"
          >
            Reset to Default
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* SVG Display & Upload Box */}
        <div className="space-y-4">
          <div className="relative aspect-square border border-white/10 flex items-center justify-center overflow-hidden bg-white/5 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] p-8">
            {svgValue ? (
              <div 
                className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:max-w-full [&_svg]:max-h-full"
                dangerouslySetInnerHTML={{ __html: svgValue }}
              />
            ) : (
              <img src="/favicon.svg" alt="Default Favicon Preview" className="w-1/2 h-1/2 object-contain" />
            )}
            
            <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 text-[8px] uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30">
              {svgValue ? 'SVG Active' : 'Default Preset'}
            </div>

            {processing && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 space-y-3">
                <Loader2 size={24} className="animate-spin text-[#D4AF37]" />
                <span className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Rendering assets...</span>
              </div>
            )}
          </div>

          <label className="flex justify-center items-center space-x-2 text-xs md:text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] transition-all border border-[#D4AF37]/50 px-4 py-3 bg-black">
            <Plus size={14} />
            <span>Upload SVG Favicon</span>
            <input type="file" accept="image/svg+xml" className="hidden" onChange={handleFileChange} disabled={processing} />
          </label>
        </div>

        {/* Resolved Resolutions Preview */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] opacity-45 block">Multi-Size Outputs</label>
          
          <div className="space-y-3 bg-black/40 p-4 border border-white/5 rounded-sm">
            {/* 32x32 */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-black overflow-hidden p-1">
                  <img src={fav32 || "/favicon-32x32.png"} alt="32x32 Favicon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-xs text-white/80 font-mono">favicon-32x32.png</div>
                  <div className="text-[9px] opacity-40">Tab bar, bookmark folders</div>
                </div>
              </div>
              <span className="text-[9px] font-mono opacity-50">32 × 32</span>
            </div>

            {/* 192x192 */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-black overflow-hidden p-1">
                  <img src={fav192 || "/favicon.png"} alt="192x192 Favicon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-xs text-white/80 font-mono">favicon.png</div>
                  <div className="text-[9px] opacity-40">Google search Symbol, PWA</div>
                </div>
              </div>
              <span className="text-[9px] font-mono opacity-50">192 × 192</span>
            </div>

            {/* Apple touch */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-black overflow-hidden p-1">
                  <img src={favApple || "/apple-touch-icon.png"} alt="180x180 Favicon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-xs text-white/80 font-mono">apple-touch-icon.png</div>
                  <div className="text-[9px] opacity-40">iOS Homescreen / Bookmarks</div>
                </div>
              </div>
              <span className="text-[9px] font-mono opacity-50">180 × 180</span>
            </div>

            {/* 512x512 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-black overflow-hidden p-1">
                  <img src={fav512 || "/favicon-512.png"} alt="512x512 Favicon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-xs text-white/80 font-mono">favicon-512.png</div>
                  <div className="text-[9px] opacity-40">PWA Splash / Large screens</div>
                </div>
              </div>
              <span className="text-[9px] font-mono opacity-50">512 × 512</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {info && (
        <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono">
          {info}
        </div>
      )}
    </div>
  );
}

function MultiImageGallery({ images, heroImage, onChange, arMode = false }: { images: string[], heroImage: string, onChange: (images: string[], heroImage: string) => void, arMode?: boolean }) {
  const [uploading, setUploading] = useState(false);

  // Ensure heroImage is part of the gallery if it exists
  const displayImages = [...new Set([...(heroImage ? [heroImage] : []), ...(images || [])])];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newImages = [...displayImages];
      let newHero = heroImage;
      for (let i = 0; i < files.length; i++) {
         const url = await uploadImage(files[i]);
         newImages.push(url);
         if (!newHero) newHero = url; 
      }
      onChange(newImages, newHero);
      
    } catch(err: any) {
      alert(err.message || "Error processing images.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    const toRemove = displayImages[idx];
    const newImages = displayImages.filter((_, i) => i !== idx);
    let newHero = heroImage;
    if (heroImage === toRemove) {
      newHero = newImages[0] || '';
    }
    onChange(newImages, newHero);
  };

  return (
    <div className="space-y-6 md:space-y-4">
      {arMode && (
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-4 text-xs text-[#D4AF37] mb-4">
          <strong>AR Try-On Instruction:</strong> For AR Try-On to function correctly, please ensure the <strong>Hero Image</strong> is a top-down, direct view with a transparent background (.png).
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-2">
         {displayImages.map((img, idx) => (
           <div key={idx} className={`relative group transition-all duration-300 ${heroImage === img ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#0A0A0A] shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border border-white/10 hover:border-[#D4AF37]/50'}`}>
             {heroImage === img && (
               <div className="absolute -top-3 -left-3 z-10 bg-[#D4AF37] text-black text-xs md:text-[10px] font-bold uppercase tracking-widest px-3 py-3 md:py-1.5 shadow-lg flex items-center space-x-1">
                 <Star size={10} className="fill-black" />
                 <span>Hero</span>
               </div>
             )}
             <img src={img || undefined} alt={`Gallery Image ${idx + 1}`} className="w-full h-32 object-cover bg-black/20" />
             <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-3">
                {heroImage !== img && (
                   <button type="button" onClick={() => onChange(displayImages, img)} className="text-xs md:text-[10px] uppercase tracking-widest bg-white/10 px-4 py-3 md:py-2 border border-white/20 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-colors w-28">Set Hero</button>
                )}
                <button type="button" onClick={() => removeImage(idx)} className="text-xs md:text-[10px] uppercase tracking-widest bg-red-500/10 px-4 py-3 md:py-2 border border-red-500/30 hover:bg-red-500 hover:border-red-500 text-white transition-colors w-28">Remove</button>
             </div>
           </div>
         ))}
         
         <label className={`border border-white/10 border-dashed h-32 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${uploading ? 'bg-black/40 pointer-events-none' : 'hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-white/50 hover:text-[#D4AF37] bg-black/20'}`}>
            {uploading ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <Loader2 size={24} className="animate-spin text-[#D4AF37]" />
                <span className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Processing...</span>
              </div>
            ) : (
              <>
                <ImageIcon size={24} className="mb-3 group-hover:scale-110 transition-transform opacity-70 group-hover:opacity-100" />
                <span className="text-xs md:text-[10px] uppercase tracking-widest text-center px-4 font-medium">Upload Photos</span>
              </>
            )}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} disabled={uploading} />
         </label>
      </div>
      
      <div className="flex items-center space-x-2 pt-4 border-t border-white/5">
         <span className="text-xs md:text-[10px] opacity-30 mt-1 block w-max uppercase tracking-widest">Add by URL: </span>
         <input type="text" onKeyDown={(e) => {
           if (e.key === 'Enter') {
             e.preventDefault();
             const val = e.currentTarget.value.trim();
             if (val && !uploading) {
               onChange([...displayImages, val], heroImage);
               if (!heroImage) onChange([...displayImages, val], val);
               e.currentTarget.value = '';
             }
           }
         }} disabled={uploading} className="bg-transparent border-b border-white/20 text-xs w-full focus:border-[#D4AF37] outline-none transition-colors placeholder:opacity-30 p-2" placeholder="Paste image URL and press Enter..." />
      </div>
    </div>
  );
}

function PaginatedArrayEditor({ collectionName, schema, title }: { collectionName: string, schema: any, title: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [pageTokens, setPageTokens] = useState<any[]>([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [saving, setSaving] = useState(false);
  const PAGE_SIZE = 10;

  const fetchPage = async (pageIdx: number) => {
    setLoading(true);
    try {
      let q;
      if (pageTokens[pageIdx]) {
        q = query(collection(db, collectionName), startAfter(pageTokens[pageIdx]), limit(PAGE_SIZE));
      } else {
        q = query(collection(db, collectionName), limit(PAGE_SIZE));
      }
      const snap = await getDocs(q);
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setItems(fetched);
      setLastVisible(snap.docs[snap.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPage(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  const handleNext = () => {
    if (lastVisible) {
      const newPage = currentPage + 1;
      const newTokens = [...pageTokens];
      newTokens[newPage] = lastVisible;
      setPageTokens(newTokens);
      setCurrentPage(newPage);
      fetchPage(newPage);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchPage(newPage);
    }
  };

  const handleAdd = () => {
    const newItem: any = {};
    Object.keys(schema).forEach(key => {
      if (key === 'id') {
        newItem[key] = `id-${Math.random().toString(36).substr(2, 9)}`;
      } else {
        newItem[key] = schema[key] === 'array' ? [] : '';
      }
    });
    setItems([newItem, ...items]);
  };

  const handleUpdate = (idx: number, key: string, value: any) => {
    const newItems = [...items];
    newItems[idx][key] = value;
    setItems(newItems);
  };

  const handleRemove = async (idx: number) => {
    if (!window.confirm("Delete this item?")) return;
    const item = items[idx];
    if (item.id) {
      setSaving(true);
      try {
        await deleteDoc(doc(db, collectionName, item.id));
      } catch (e) {
        console.error(e);
      }
      setSaving(false);
    }
    setItems(items.filter((_, i) => i !== idx));
  };

  const saveBatch = async () => {
    setSaving(true);
    try {
      const promises = items.map(item => {
        const id = item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return setDoc(doc(db, collectionName, id), { ...item, id });
      });
      await Promise.all(promises);
      alert('Saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save batch');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="text-sm uppercase tracking-[0.3em] font-light">{title} (Page {currentPage + 1})</h2>
        <div className="flex items-center space-x-4">
          <button type="button" onClick={saveBatch} disabled={saving} className="flex items-center space-x-2 bg-[#D4AF37] text-black hover:bg-white transition-colors text-xs uppercase tracking-widest px-4 py-2 disabled:opacity-50">
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}<span>Save Changes</span>
          </button>
          <button type="button" onClick={handleAdd} className="flex items-center space-x-2 text-[#D4AF37] hover:text-white transition-colors text-xs md:text-[10px] uppercase tracking-widest px-3 py-3 md:py-1 border border-[#D4AF37]/50">
            <Plus size={12} /><span>Add New</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={item.id || index} className="bg-black/40 border border-white/5 p-6 space-y-6 relative group">
            <button type="button" onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
            <div className="text-xs md:text-[10px] opacity-30 absolute top-4 left-4">ITEM (Page {currentPage + 1})</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {Object.keys(schema).map(key => {
                const hasGallery = Object.values(schema).includes('imageGallery');
                if (key === 'image' && hasGallery) return null; // Let imageGallery handle 'image'
                           
                if (schema[key] === 'imageGallery') {
                  const arMode = title.toLowerCase().includes('boutique') || title.toLowerCase().includes('shop');
                  return (
                    <div key={key} className="space-y-6 md:space-y-4 md:col-span-2 border border-white/5 p-4 rounded-sm bg-black/20">
                       <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 flex justify-between">
                         {key} (Image Gallery & Hero)
                       </label>
                       <MultiImageGallery 
                          images={item[key] || []}
                          heroImage={item.image || ''}
                          onChange={(vals, val) => {
                            setItems(prev => {
                              const newItems = [...prev];
                              newItems[index] = { ...newItems[index], [key]: vals, image: val };
                              return newItems;
                            });
                          }}
                          arMode={arMode}
                       />
                    </div>
                  );
                }

                if (key === 'image' || key === 'logoUrl' || key.toLowerCase().includes('image')) {
                  return (
                    <div key={key} className="space-y-2 md:col-span-2">
                       <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">{key}</label>
                       <ImageUpload value={item[key] || ''} onChange={(val) => handleUpdate(index, key, val)} />
                    </div>
                  );
                }
                if (key === 'id') {
                  return null; // hide ID generator
                }
                if (schema[key] === 'array') { // e.g. details, angles
                  return (
                    <div key={key} className="space-y-2 md:col-span-2 border border-white/5 p-4 rounded-sm">
                      <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 flex justify-between">
                        {key} (Comma/Newline separated list)
                      </label>
                      <textarea 
                        value={Array.isArray(item[key]) ? item[key].join(', ') : ''}
                        onChange={(e) => {
                          const arr = e.target.value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
                          handleUpdate(index, key, arr);
                        }}
                        className="w-full bg-black/50 border border-white/10 p-3 text-xs font-mono focus:border-[#D4AF37] outline-none h-24"
                      />
                    </div>
                  );
                }
                const isLongText = key === 'content' || key === 'description' || key === 'excerpt' || key === 'longDescription';
                const insertMarkdown = (prefix: string, suffix: string = '') => {
                   const textarea = document.getElementById(`textarea-paginated-${index}-${key}`) as HTMLTextAreaElement;
                   if (!textarea) return;
                   const start = textarea.selectionStart;
                   const end = textarea.selectionEnd;
                   const currentVal = item[key] || '';
                   const selectedText = currentVal.substring(start, end);
                   const replacement = prefix + selectedText + suffix;
                   const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
                   handleUpdate(index, key, newVal);
                   setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
                   }, 0);
                };

                return (
                  <div key={key} className={`space-y-2 ${isLongText ? 'md:col-span-2' : ''}`}>
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 flex justify-between items-center">
                       <span>{key}</span>
                       {isLongText && (
                         <div className="flex gap-2">
                           <button type="button" onClick={() => insertMarkdown('## ', '')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">H2</button>
                           <button type="button" onClick={() => insertMarkdown('### ', '')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">H3</button>
                           <button type="button" onClick={() => insertMarkdown('**', '**')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">B</button>
                           <button type="button" onClick={() => insertMarkdown('*', '*')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">I</button>
                           <button type="button" onClick={() => insertMarkdown('[', '](https://)')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">Link</button>
                           <button type="button" onClick={() => insertMarkdown('- ', '')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">List</button>
                         </div>
                       )}
                    </label>
                    {isLongText ? (
                      <textarea 
                        id={`textarea-paginated-${index}-${key}`}
                        value={item[key] || ''} 
                        onChange={e => handleUpdate(index, key, e.target.value)} 
                        className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-48 font-mono text-[10px] md:text-xs" 
                      />
                    ) : (
                      <input 
                        type={schema[key] === 'number' ? 'number' : 'text'}
                        value={item[key] || ''} 
                        onChange={e => handleUpdate(index, key, schema[key] === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)} 
                        className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" 
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && (
           <div className="text-center py-12 border border-white/5 opacity-50 text-xs uppercase tracking-widest">No Items Found</div>
        )}
        {loading && (
           <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#D4AF37]" /></div>
        )}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-white/10">
        <button type="button" onClick={handlePrev} disabled={currentPage === 0 || loading} className="flex items-center space-x-2 uppercase tracking-widest text-xs opacity-50 hover:opacity-100 disabled:opacity-20 transition-all">
          <ChevronLeft size={16} /> <span>Previous Page</span>
        </button>
        <span className="text-[10px] opacity-40 uppercase tracking-widest">Page {currentPage + 1}</span>
        <button type="button" onClick={handleNext} disabled={!lastVisible || loading} className="flex items-center space-x-2 uppercase tracking-widest text-xs opacity-50 hover:opacity-100 disabled:opacity-20 transition-all">
          <span>Next Page</span> <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ArrayEditor({ items, schema, onChange, title }: { items: any[], schema: any, onChange: (items: any[]) => void, title: string }) {
  const handleAdd = () => {
    const newItem: any = {};
    Object.keys(schema).forEach(key => {
      if (key === 'id') {
        newItem[key] = `id-${Math.random().toString(36).substr(2, 9)}`;
      } else {
        newItem[key] = schema[key] === 'array' ? [] : '';
      }
    });
    onChange([...items, newItem]);
  };

  const handleUpdate = (idx: number, key: string, value: any) => {
    const newItems = [...items];
    newItems[idx][key] = value;
    onChange(newItems);
  };

  const handleRemove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="text-sm uppercase tracking-[0.3em] font-light">{title} ({items.length})</h2>
        <button type="button" onClick={handleAdd} className="flex items-center space-x-2 text-[#D4AF37] hover:text-white transition-colors text-xs md:text-[10px] uppercase tracking-widest px-3 py-3 md:py-1 border border-[#D4AF37]/50">
          <Plus size={12} /><span>Add New</span>
        </button>
      </div>

      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={index} className="bg-black/40 border border-white/5 p-6 space-y-6 relative group">
            <button type="button" onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
            <div className="text-xs md:text-[10px] opacity-30 absolute top-4 left-4">ITEM #{index + 1}</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {Object.keys(schema).map(key => {
                const hasGallery = Object.values(schema).includes('imageGallery');
                if (key === 'image' && hasGallery) return null; // Let imageGallery handle 'image'
                           
                if (schema[key] === 'imageGallery') {
                  const arMode = title.toLowerCase().includes('boutique') || title.toLowerCase().includes('shop');
                  return (
                    <div key={key} className="space-y-6 md:space-y-4 md:col-span-2 border border-white/5 p-4 rounded-sm bg-black/20">
                       <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 flex justify-between">
                         {key} (Image Gallery & Hero)
                       </label>
                       <MultiImageGallery 
                          images={item[key] || []}
                          heroImage={item.image || ''}
                          onChange={(vals, val) => {
                            const newItems = [...items];
                            newItems[index] = { ...newItems[index], [key]: vals, image: val };
                            onChange(newItems);
                          }}
                          arMode={arMode}
                       />
                    </div>
                  );
                }

                if (key === 'image' || key === 'logoUrl' || key.toLowerCase().includes('image')) {
                  return (
                    <div key={key} className="space-y-2 md:col-span-2">
                       <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">{key}</label>
                       <ImageUpload value={item[key] || ''} onChange={(val) => handleUpdate(index, key, val)} />
                    </div>
                  );
                }
                if (key === 'id') {
                  return null; // hide ID generator
                }
                if (schema[key] === 'array') { // e.g. details, angles
                  return (
                    <div key={key} className="space-y-2 md:col-span-2 border border-white/5 p-4 rounded-sm">
                      <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 flex justify-between">
                        {key} (Comma/Newline separated list)
                      </label>
                      <textarea 
                        value={Array.isArray(item[key]) ? item[key].join(', ') : ''}
                        onChange={(e) => {
                          const arr = e.target.value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
                          handleUpdate(index, key, arr);
                        }}
                        className="w-full bg-black/50 border border-white/10 p-3 text-xs font-mono focus:border-[#D4AF37] outline-none h-24"
                      />
                    </div>
                  );
                }
                const isLongText = key === 'content' || key === 'description' || key === 'excerpt' || key === 'longDescription';
                const insertMarkdown = (prefix: string, suffix: string = '') => {
                   const textarea = document.getElementById(`textarea-${index}-${key}`) as HTMLTextAreaElement;
                   if (!textarea) return;
                   const start = textarea.selectionStart;
                   const end = textarea.selectionEnd;
                   const currentVal = item[key] || '';
                   const selectedText = currentVal.substring(start, end);
                   const replacement = prefix + selectedText + suffix;
                   const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
                   handleUpdate(index, key, newVal);
                   setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
                   }, 0);
                };

                return (
                  <div key={key} className={`space-y-2 ${isLongText ? 'md:col-span-2' : ''}`}>
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 flex justify-between items-center">
                       <span>{key}</span>
                       {isLongText && (
                         <div className="flex gap-2">
                           <button type="button" onClick={() => insertMarkdown('## ', '')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">H2</button>
                           <button type="button" onClick={() => insertMarkdown('### ', '')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">H3</button>
                           <button type="button" onClick={() => insertMarkdown('**', '**')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">B</button>
                           <button type="button" onClick={() => insertMarkdown('*', '*')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">I</button>
                           <button type="button" onClick={() => insertMarkdown('[', '](https://)')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">Link</button>
                           <button type="button" onClick={() => insertMarkdown('- ', '')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">List</button>
                           <button type="button" onClick={() => insertMarkdown('\n| Column 1 | Column 2 |\n|---|---|\n| Value | Value |\n', '')} className="hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm">Table</button>
                           <label className="cursor-pointer hover:text-white transition-colors border border-white/20 px-1 py-0.5 rounded-sm flex items-center">
                             Upload
                             <input 
                               type="file" 
                               className="hidden" 
                               accept=".html,.htm,.md,.txt" 
                               onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 const reader = new FileReader();
                                 reader.onload = (event) => {
                                   const text = event.target?.result as string;
                                   if (file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.htm')) {
                                     const turndownService = new TurndownService({ headingStyle: 'atx' });
                                     turndownService.use(gfm);
                                     const markdown = turndownService.turndown(text);
                                     insertMarkdown(markdown, '');
                                   } else {
                                     insertMarkdown(text, '');
                                   }
                                 };
                                 reader.readAsText(file);
                                 e.target.value = '';
                               }} 
                             />
                           </label>
                         </div>
                       )}
                    </label>
                    {isLongText ? (
                       <textarea 
                         id={`textarea-${index}-${key}`}
                         value={item[key] || ''} 
                         onChange={(e) => handleUpdate(index, key, e.target.value)}
                         onPaste={(e) => {
                           const html = e.clipboardData.getData('text/html');
                           if (html) {
                             e.preventDefault();
                             const turndownService = new TurndownService({ headingStyle: 'atx' });
                             turndownService.use(gfm);
                             const markdown = turndownService.turndown(html);
                             const textarea = e.currentTarget;
                             const start = textarea.selectionStart;
                             const end = textarea.selectionEnd;
                             const currentVal = item[key] || '';
                             const newVal = currentVal.substring(0, start) + markdown + currentVal.substring(end);
                             handleUpdate(index, key, newVal);
                             setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + markdown.length, start + markdown.length);
                             }, 0);
                           }
                         }}
                         className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-32 font-mono leading-relaxed"
                       />
                    ) : (
                       <input 
                         type={schema[key] === 'number' ? 'number' : 'text'}
                         step={schema[key] === 'number' ? '0.001' : undefined}
                         min={schema[key] === 'number' ? '0' : undefined}
                         value={item[key] === 0 ? 0 : (item[key] || '')} 
                         onChange={(e) => handleUpdate(index, key, schema[key] === 'number' ? (e.target.value ? parseFloat(e.target.value) : '') : e.target.value)}
                         className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none"
                       />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center py-3 md:py-12 text-white/30 text-xs italic">No items created yet.</div>}
      </div>
    </div>
  )
}


export default function AdminView() {
  const [user, authLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckDone, setAdminCheckDone] = useState(false);
  const [checkedUid, setCheckedUid] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Email login failed:", err);
      let msg = err.message || "An unexpected error occurred.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = "Invalid email or password combination.";
      } else if (err.code === 'auth/invalid-email') {
        msg = "Please enter a valid email address.";
      } else if (err.code === 'auth/invalid-credential') {
        msg = "Invalid credentials. Please double-check your email and password.";
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = "Email/Password login is currently disabled in your Firebase Authentication settings. Please enable it in Firebase Console > Authentication > Sign-in method.";
      }
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAuthSuccess("Account registered successfully! Checking admin status...");
    } catch (err: any) {
      console.error("Email registration failed:", err);
      let msg = err.message || "Could not register account.";
      if (err.code === 'auth/email-already-in-use') {
        // Self-healing fallback: if account already exists, log in with the provided password
        try {
          setAuthSuccess("Account already exists. Authenticating with credentials...");
          await signInWithEmailAndPassword(auth, email, password);
          return;
        } catch (loginErr: any) {
          msg = `This email is already registered, and the automatic sign-in attempt failed: ${loginErr.message || loginErr.code}`;
        }
      } else if (err.code === 'auth/weak-password') {
        msg = "Password must be at least 6 characters long.";
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = "Email/Password registration is currently disabled in your Firebase Authentication settings. Please enable it in Firebase Console > Authentication > Sign-in method.";
      }
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthSuccess("A password reset email has been sent to your inbox.");
    } catch (err: any) {
      console.error("Password reset failed:", err);
      let msg = err.message || "Could not send reset link.";
      if (err.code === 'auth/operation-not-allowed') {
        msg = "Email/Password authentication is disabled in your Firebase Authentication settings. Please enable it in Firebase Console.";
      }
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!authLoading) {
      if (user) {
        if (checkedUid !== user.uid) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAdminCheckDone(false);
          if (user.email && user.email.toLowerCase() === 'shekar.v.menon@gmail.com') {
            setIsAdmin(true);
            setCheckedUid(user.uid);
            setAdminCheckDone(true);
          } else {
            getDoc(doc(db, 'admins', user.uid)).then(snap => {
              setIsAdmin(snap.exists());
              setCheckedUid(user.uid);
              setAdminCheckDone(true);
            }).catch((err) => {
              console.error("Error checking admin status", err);
              setIsAdmin(false);
              setCheckedUid(user.uid);
              setAdminCheckDone(true);
            });
          }
        }
      } else {
        setIsAdmin(false);
        setCheckedUid(null);
        getRedirectResult(auth).then((result) => {
          if (result) {
            console.log("Found redirect result:", result.user);
          } else {
            setAdminCheckDone(true);
          }
        }).catch((err) => {
          console.error("Redirect result error:", err);
          setAuthError(err.message || "Failed to complete redirect login.");
          setAdminCheckDone(true);
        });
      }
      setLoading(false);
      return;
    }
    const timeout = setTimeout(() => {
      setLoading(false);
      setAdminCheckDone(true);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [authLoading, user, checkedUid]);
  const { content, updateContent, loading: contentLoading } = useContent();
  const [formData, setFormData] = useState<SiteContent>(content);

  React.useEffect(() => {
    if (!contentLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(content);
    }
  }, [contentLoading, content]);

  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'access' | 'global' | 'blogs' | 'trends' | 'contact_page' | 'shop' | 'heritage' | 'maison' | 'brides' | 'submissions' | 'consultations' | 'orders' | 'analytics' | 'exchange' | 'seo'>('analytics');

  if (loading || (user && !adminCheckDone)) return <div className="p-20 text-center">Loading security protocols...</div>;

  if (!user) {
    const isIframe = window !== window.top;

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 pt-10 px-4">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-serif italic text-white/95 tracking-wide">Maison Admin Portal</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] opacity-85">Restricted Access</p>
        </div>

        <div className="w-full max-w-md bg-black/60 border border-white/10 p-8 rounded-sm space-y-6 shadow-2xl backdrop-blur-md">
          {authMode === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-serif text-white uppercase tracking-wider">Maison Sign In</h3>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">Sign in with your credentials</p>
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {authSuccess}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] opacity-50 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/90 font-light"
                    placeholder="shekar.v.menon@gmail.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">Password</label>
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode('forgot'); setAuthError(null); setAuthSuccess(null); }}
                      className="text-[9px] uppercase tracking-[0.15em] text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/90 font-light"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-[#D4AF37] hover:bg-white text-black font-medium text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 cursor-pointer"
              >
                {authSubmitting ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] tracking-wider text-white/40">
                <span>Need an account?</span>
                <button 
                  type="button" 
                  onClick={() => { setAuthMode('register'); setAuthError(null); setAuthSuccess(null); }}
                  className="text-[#D4AF37]/80 hover:text-[#D4AF37] underline transition-colors"
                >
                  Create Admin Account
                </button>
              </div>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-serif text-white uppercase tracking-wider">Create Admin Account</h3>
                <p className="text-[10px] opacity-40 uppercase tracking-widest font-mono">Create direct password credentials</p>
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {authSuccess}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] opacity-50 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/90 font-light"
                    placeholder="shekar.v.menon@gmail.com"
                  />
                  <span className="text-[8px] text-[#D4AF37]/70 block mt-1 uppercase tracking-widest">Use your primary admin email for permissions</span>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] opacity-50 block mb-1">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/90 font-light"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-[#D4AF37] hover:bg-white text-black font-medium text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 cursor-pointer"
              >
                {authSubmitting ? 'Creating account...' : 'Create Account'}
              </button>

              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] tracking-wider text-white/40">
                <span>Already have an account?</span>
                <button 
                  type="button" 
                  onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccess(null); }}
                  className="text-[#D4AF37]/80 hover:text-[#D4AF37] underline transition-colors"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-serif text-white uppercase tracking-wider">Reset Password</h3>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">Receive a recovery link via email</p>
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {authSuccess}
                </div>
              )}

              <div>
                <label className="text-[9px] uppercase tracking-[0.2em] opacity-50 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/90 font-light"
                  placeholder="name@kirthidiamonds.com"
                />
              </div>

              <button 
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-[#D4AF37] hover:bg-white text-black font-medium text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 cursor-pointer"
              >
                {authSubmitting ? 'Sending email...' : 'Send Recovery Link'}
              </button>

              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] tracking-wider text-white/40">
                <button 
                  type="button" 
                  onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccess(null); }}
                  className="text-[#D4AF37]/80 hover:text-[#D4AF37] underline transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Separation Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-3 bg-black text-[9px] uppercase tracking-[0.25em] text-white/40">OR</span>
          </div>

          {/* Google Sign In option */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] opacity-40 uppercase tracking-widest block">Single Sign-On</span>
            </div>

            {isIframe ? (
              <div className="space-y-3">
                <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-sm text-[10px] text-amber-300/80 leading-relaxed uppercase tracking-wider text-center">
                  Google SSO is blocked inside this preview frame due to security restrictions. Use direct Email sign-in above or open full-screen.
                </div>
                <a 
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 border border-white/10 text-white/80 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-white/5 transition-all text-[10px] tracking-[0.15em] uppercase w-full flex items-center justify-center gap-2 cursor-pointer bg-black/20"
                >
                  Open Full Screen
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={async () => {
                    const provider = new GoogleAuthProvider();
                    try {
                      await signInWithPopup(auth, provider);
                    } catch (error: any) {
                      console.error("Login failed via popup:", error);
                      
                      const isStorageOrPopupError = 
                        error.code === 'auth/popup-blocked' || 
                        error.code === 'auth/internal-error' || 
                        error.code === 'auth/web-storage-unsupported' || 
                        error.message?.toLowerCase().includes('popup') || 
                        error.message?.toLowerCase().includes('storage') || 
                        error.message?.toLowerCase().includes('cookie') || 
                        error.message?.toLowerCase().includes('iframe');

                      if (isStorageOrPopupError) {
                        try {
                          console.log("Attempting fallback to redirect login...");
                          await signInWithRedirect(auth, provider);
                        } catch (redirectError: any) {
                          console.error("Redirect login also failed", redirectError);
                          alert("Authentication blocked by browser cookie or security settings. Please check your browser settings or use Email/Password login above.");
                        }
                      } else if (error.code === 'auth/unauthorized-domain') {
                        alert(`Login failed: Your custom domain (${window.location.hostname}) is not authorized. Add it to Firebase Console > Authentication > Settings > Authorized Domains.`);
                      } else if (error.code === 'auth/popup-closed-by-user') {
                        // User closed the popup window, no alert needed
                      } else {
                        alert(`Login failed: ${error.message || error.code}. Use Email/Password login above.`);
                      }
                    }
                  }}
                  className="w-full py-3 bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37] text-white/90 hover:text-white transition-all text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>
                
                <button 
                  onClick={async () => {
                    const provider = new GoogleAuthProvider();
                    try {
                      await signInWithRedirect(auth, provider);
                    } catch (error: any) {
                      console.error("Redirect login failed", error);
                      alert(`Login failed: ${error.message || error.code}. `);
                    }
                  }}
                  className="text-[9px] uppercase tracking-widest text-white/30 hover:text-white/60 text-center transition-colors underline underline-offset-4"
                >
                  Use Redirect Method instead
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Frontend check to prevent visual access to unauthorized users
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 pt-32">
        <h2 className="text-3xl font-serif italic text-white/80">Unauthorized</h2>
        <p className="text-sm font-light opacity-50">You do not have permission to access the admin dashboard.</p>
        <button 
          onClick={() => signOut(auth)}
          className="px-8 py-3 border border-white/20 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all text-sm tracking-widest uppercase"
        >
          Sign Out ({user.email})
        </button>
      </div>
    );
  }

  const recompressBase64 = async (base64Str: string): Promise<string> => {
    if (!base64Str.startsWith('data:image/') || base64Str.length < 5000) {
      return base64Str;
    }

    try {
      // Convert base64 string to a File object
      const res = await fetch(base64Str);
      const blob = await res.blob();
      const extMatch = blob.type.match(/\/(png|jpeg|jpg|webp|gif|svg)/);
      const ext = extMatch ? extMatch[1].replace('jpeg', 'jpg') : 'webp';
      const file = new File([blob], `inline.${ext}`, { type: blob.type });

      return await uploadImage(file);
    } catch (e) {
      console.warn("Failed to upload inline base64 image", e);
      return base64Str;
    }
  };

  const traverseAndCompress = async (obj: any): Promise<any> => {
    if (!obj) return obj;
    if (typeof obj === 'string') {
      if (obj.startsWith('data:image/')) {
        return await recompressBase64(obj);
      }
      
      // Inline string replacement for base64
      if (obj.includes('data:image/')) {
        const regex = /data:image\/[^;]+;base64,[^"'\s]+/g;
        const matches = obj.match(regex);
        if (matches && matches.length > 0) {
          let newStr = obj;
          for (const match of matches) {
            const compressed = await recompressBase64(match);
            newStr = newStr.replace(match, compressed);
          }
          return newStr;
        }
      }
      
      return obj;
    }
    if (Array.isArray(obj)) {
      const arr = [];
      for (const item of obj) {
        arr.push(await traverseAndCompress(item));
      }
      return arr;
    }
    if (typeof obj === 'object') {
      const newObj: any = {};
      for (const key of Object.keys(obj)) {
        newObj[key] = await traverseAndCompress(obj[key]);
      }
      return newObj;
    }
    return obj;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const { blogPosts, journalTrends, ...restData } = formData;
      const compressedData = await traverseAndCompress(restData);
      
      console.log("Size of shopProducts after compression:", JSON.stringify(compressedData.shopProducts)?.length);
      
      await updateContent(compressedData);
      setFormData({ ...compressedData, blogPosts, journalTrends });
      alert('Content updated successfully.');
    } catch (err: any) {
      console.error(err);
      alert(`Failed to update content: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'analytics', label: 'Corporate Analytics' },
    { id: 'global', label: 'Global Setup' },
    { id: 'contact_page', label: 'Contact Us Config' },
    { id: 'blogs', label: 'Journal (Publication)' },
    { id: 'trends', label: 'Journal (Trends)' },
    { id: 'shop', label: 'Boutique (Products)' },
    { id: 'heritage', label: 'Heritage Archives' },
    { id: 'maison', label: 'Savoir Faire' },
    { id: 'brides', label: 'Patron Showcase' },
    { id: 'submissions', label: 'Patron Submissions' },
    { id: 'consultations', label: 'Bespoke Inquiries' },
    { id: 'orders', label: 'Client Orders' },
    { id: 'exchange', label: 'Exchange Rates' },
    { id: 'seo', label: 'SEO Management' },
    { id: 'access', label: 'Access Control' }
  ] as const;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pt-32 pb-32 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif italic text-[#D4AF37]">Maison Diamond Specialist</h2>
          <p className="text-xs uppercase tracking-[0.2em] opacity-40">Dynamic Data Management System</p>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-xs opacity-50">{user.email}</span>
          <button onClick={() => signOut(auth)} className="text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors">Sign Out</button>
        </div>
      </div>

      <div className="flex space-x-6 border-b border-white/10 mb-8 overflow-x-auto custom-scrollbar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-4 text-xs md:text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${tab === t.id ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-white/50 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.01] border border-white/5 p-6 md:p-12 mb-20 relative">
        <React.Suspense fallback={<div className="p-12 text-center text-white/50 text-xs tracking-widest uppercase flex flex-col items-center justify-center"><Loader2 className="animate-spin w-4 h-4 mb-3" />Loading Module...</div>}>
        {tab === 'global' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Brand Identity</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block mb-2">Master Header Logo</label>
                  <ImageUpload value={formData.logoUrl || ''} onChange={(val) => setFormData({...formData, logoUrl: val})} />
                </div>
                <div>
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block mb-2">Site Favicon (Google Search & Browsers)</label>
                  <FaviconUpload 
                    svgValue={formData.customFaviconSvg || ''}
                    fav32={formData.favicon_32 || ''}
                    fav192={formData.favicon_192 || ''}
                    fav512={formData.favicon_512 || ''}
                    favApple={formData.favicon_apple || ''}
                    onChange={(vals) => setFormData({
                      ...formData, 
                      customFaviconSvg: vals.svg,
                      favicon_32: vals.fav32,
                      favicon_192: vals.fav192,
                      favicon_512: vals.fav512,
                      favicon_apple: vals.favApple
                    })}
                  />
                </div>
              </div>
            </section>
            
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Store Policies (Percentages)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Diamond Policies */}
                <div className="space-y-4 p-4 border border-white/10 bg-black/30">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] border-b border-white/5 pb-2">Diamond</h3>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Buyback (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.diamondBuybackPercentage ?? 85} onChange={e => setFormData({...formData, diamondBuybackPercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Exchange (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.diamondExchangePercentage ?? 100} onChange={e => setFormData({...formData, diamondExchangePercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                </div>

                {/* Polki Policies */}
                <div className="space-y-4 p-4 border border-white/10 bg-black/30">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] border-b border-white/5 pb-2">Polki</h3>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Buyback (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.polkiBuybackPercentage ?? 80} onChange={e => setFormData({...formData, polkiBuybackPercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Exchange (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.polkiExchangePercentage ?? 100} onChange={e => setFormData({...formData, polkiExchangePercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                </div>

                {/* Colourstone Policies */}
                <div className="space-y-4 p-4 border border-white/10 bg-black/30">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] border-b border-white/5 pb-2">Colourstone</h3>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Buyback (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.colourstoneBuybackPercentage ?? 70} onChange={e => setFormData({...formData, colourstoneBuybackPercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Exchange (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.colourstoneExchangePercentage ?? 80} onChange={e => setFormData({...formData, colourstoneExchangePercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                </div>

              </div>
            </section>
            
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Landing View</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Hero Title</label>
                  <input type="text" value={formData.landingTitle || ''} onChange={e => setFormData({...formData, landingTitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Hero Subtitle</label>
                  <textarea value={formData.landingSubtitle || ''} onChange={e => setFormData({...formData, landingSubtitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-24" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Hero Video URL</label>
                  <input type="text" value={formData.heroVideoUrl || ''} onChange={e => setFormData({...formData, heroVideoUrl: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Philosophy Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Philosophy Label (e.g. The Philosophy)</label>
                  <input type="text" value={formData.philosophyTitle || ''} onChange={e => setFormData({...formData, philosophyTitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 md:col-span-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Philosophy Subtitle (use \n for line breaks)</label>
                  <textarea value={formData.philosophySubtitle || ''} onChange={e => setFormData({...formData, philosophySubtitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-24 text-white" />
                </div>
                <div className="space-y-2 md:col-span-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Philosophy Description</label>
                  <textarea value={formData.philosophyDescription || ''} onChange={e => setFormData({...formData, philosophyDescription: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-24 text-white" />
                </div>
                <div className="space-y-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Stat 1 Value</label>
                  <input type="text" value={formData.philosophyStat1Value || ''} onChange={e => setFormData({...formData, philosophyStat1Value: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Stat 1 Label</label>
                  <input type="text" value={formData.philosophyStat1Label || ''} onChange={e => setFormData({...formData, philosophyStat1Label: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Stat 2 Value</label>
                  <input type="text" value={formData.philosophyStat2Value || ''} onChange={e => setFormData({...formData, philosophyStat2Value: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Stat 2 Label</label>
                  <input type="text" value={formData.philosophyStat2Label || ''} onChange={e => setFormData({...formData, philosophyStat2Label: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-6 md:space-y-4 md:col-span-2 text-white">
                   <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Philosophy Image</label>
                   <ImageUpload value={formData.philosophyImage || ''} onChange={(val) => setFormData({...formData, philosophyImage: val})} />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Maison Details & Location</h2>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Maison Description</label>
                    <textarea value={formData.maisonDetails || ''} onChange={e => setFormData({...formData, maisonDetails: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-32" />
                  </div>
                  <div className="space-y-6 md:space-y-4">
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Maison Image</label>
                    <ImageUpload value={formData.maisonImage || ''} onChange={(val) => setFormData({...formData, maisonImage: val})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Contact Phone</label>
                      <input type="text" value={formData.contactPhone || ''} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Contact Email</label>
                      <input type="text" value={formData.contactEmail || ''} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Location Address</label>
                      <textarea value={formData.locationDetails || ''} onChange={e => setFormData({...formData, locationDetails: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-24" />
                    </div>
                  </div>
                </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Journal Trends Content</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Content (HTML allowed)</label>
                    <textarea value={formData.journalTrendsContent || ''} onChange={e => setFormData({...formData, journalTrendsContent: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-64 font-mono text-[10px] md:text-xs" />
                  </div>
                </div>
            </section>
          </div>
        )}

        {tab === 'contact_page' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4 text-[#D4AF37]">Contact Page Headers & Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Contact Page Title</label>
                  <input type="text" value={formData.contactTitle || ''} onChange={e => setFormData({...formData, contactTitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Contact Page Subtitle</label>
                  <input type="text" value={formData.contactSubtitle || ''} onChange={e => setFormData({...formData, contactSubtitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Contact Page Description</label>
                  <textarea value={formData.contactDescription || ''} onChange={e => setFormData({...formData, contactDescription: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-24 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Contact Phone Number</label>
                  <input type="text" value={formData.contactPhone || ''} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Contact Email Address</label>
                  <input type="text" value={formData.contactEmail || ''} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">WhatsApp Number (eg. +919847086990)</label>
                  <input type="text" value={formData.contactWhatsApp || ''} onChange={e => setFormData({...formData, contactWhatsApp: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Mailing / General Address</label>
                  <input type="text" value={formData.locationDetails || ''} onChange={e => setFormData({...formData, locationDetails: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4 text-[#D4AF37]">Kochi Showroom Location Coordinates & Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Showroom Label</label>
                  <input type="text" value={formData.kochiName || ''} onChange={e => setFormData({...formData, kochiName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Opening Hours</label>
                  <input type="text" value={formData.kochiHours || ''} onChange={e => setFormData({...formData, kochiHours: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Showroom Address (use \n for line breaks)</label>
                  <textarea value={formData.kochiAddress || ''} onChange={e => setFormData({...formData, kochiAddress: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-20 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Latitude Coordinate (eg. 10.00394)</label>
                  <input type="number" step="0.00001" value={formData.kochiLat ?? 10.00394} onChange={e => setFormData({...formData, kochiLat: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Longitude Coordinate (eg. 76.31155)</label>
                  <input type="number" step="0.00001" value={formData.kochiLng ?? 76.31155} onChange={e => setFormData({...formData, kochiLng: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white font-mono" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Google Maps Link</label>
                  <input type="text" value={formData.kochiMapsLink || ''} onChange={e => setFormData({...formData, kochiMapsLink: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4 text-[#D4AF37]">Calicut Showroom Location Coordinates & Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Showroom Label</label>
                  <input type="text" value={formData.calicutName || ''} onChange={e => setFormData({...formData, calicutName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Opening Hours</label>
                  <input type="text" value={formData.calicutHours || ''} onChange={e => setFormData({...formData, calicutHours: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Showroom Address (use \n for line breaks)</label>
                  <textarea value={formData.calicutAddress || ''} onChange={e => setFormData({...formData, calicutAddress: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-20 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Latitude Coordinate (eg. 11.25052)</label>
                  <input type="number" step="0.00001" value={formData.calicutLat ?? 11.25052} onChange={e => setFormData({...formData, calicutLat: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Longitude Coordinate (eg. 75.79251)</label>
                  <input type="number" step="0.00001" value={formData.calicutLng ?? 75.79251} onChange={e => setFormData({...formData, calicutLng: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white font-mono" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Google Maps Link</label>
                  <input type="text" value={formData.calicutMapsLink || ''} onChange={e => setFormData({...formData, calicutMapsLink: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'blogs' && (
          <PaginatedArrayEditor 
            title="Journal Entries (Publication)"
            collectionName="site_content_blogPosts"
            schema={{ id: 'string', title: 'string', date: 'string', excerpt: 'string', content: 'string', image: 'image', featuredImage: 'image', images: 'imageGallery' }}
          />
        )}

        {tab === 'trends' && (
          <PaginatedArrayEditor 
            title="Journal Entries (Trends)"
            collectionName="site_content_journalTrends"
            schema={{ id: 'string', title: 'string', date: 'string', excerpt: 'string', content: 'string', image: 'image', featuredImage: 'image', images: 'imageGallery' }}
          />
        )}

        {tab === 'shop' && (
           <ArrayEditor 
            title="Boutique Products"
            items={formData.shopProducts || []}
            onChange={(items) => setFormData({...formData, shopProducts: items})}
            schema={{ id: 'string', name: 'string', price: 'number', category: 'string', description: 'string', longDescription: 'string', image: 'image', angles: 'imageGallery', metalWeight: 'number', diamondWeight: 'number', polkiWeight: 'number', metalQuality: 'string', diamondQuality: 'string', colourStoneWeight: 'number', availableMetals: 'array', availableSizes: 'array', details: 'array' }}
          />
        )}

        {tab === 'heritage' && (
          <ArrayEditor 
            title="Heritage Archive Items"
            items={formData.heritageItems || []}
            onChange={(items) => setFormData({...formData, heritageItems: items})}
            schema={{ id: 'string', title: 'string', era: 'string', year: 'string', description: 'string', materials: 'string', image: 'image' }}
          />
        )}

        {tab === 'maison' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Video Settings</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Savoir Faire Description</label>
                  <textarea value={formData.methodologyDescription || ''} onChange={e => setFormData({...formData, methodologyDescription: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white h-24" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Savoir Faire Video URL</label>
                  <input type="text" value={formData.methodologyVideoUrl || ''} onChange={e => setFormData({...formData, methodologyVideoUrl: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
              </div>
            </section>
            
            <ArrayEditor 
              title="Savoir Faire (Methodology)"
              items={formData.methodologySteps || []}
              onChange={(items) => setFormData({...formData, methodologySteps: items})}
              schema={{ id: 'string', title: 'string', subtitle: 'string', text: 'string', detail: 'string', image: 'image' }}
            />
          </div>
        )}

        {tab === 'brides' && (
           <ArrayEditor 
            title="Bridal Showcase Gallery"
            items={formData.brideGallery || []}
            onChange={(items) => setFormData({...formData, brideGallery: items})}
            schema={{ id: 'string', name: 'string', story: 'string', description: 'string', image: 'image', images: 'imageGallery' }}
          />
        )}

        {tab === 'submissions' && (
          <AdminBridalSubmissions />
        )}

        {tab === 'consultations' && (
          <AdminConsultations />
        )}

        {tab === 'orders' && (
          <AdminOrders />
        )}

        {tab === 'seo' && (
          <AdminSEO formData={formData} setFormData={setFormData} />
        )}

        {tab === 'exchange' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Base Valuation Rates</h2>
              <p className="text-xs opacity-50 font-light mb-8">Set the default per-carat base rates for gemstones used in the Exchange Calculator. Gold rates are automatically fetched live.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Diamond Rate (₹/Carat)</label>
                  <input 
                    type="number" 
                    value={formData.baseDiamondRate || ''} 
                    onChange={e => setFormData({...formData, baseDiamondRate: Number(e.target.value)})} 
                    placeholder="e.g. 80000"
                    className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Polki Rate (₹/Carat)</label>
                  <input 
                    type="number" 
                    value={formData.basePolkiRate || ''} 
                    onChange={e => setFormData({...formData, basePolkiRate: Number(e.target.value)})} 
                    placeholder="e.g. 30000"
                    className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Colourstone Rate (₹/Carat)</label>
                  <input 
                    type="number" 
                    value={formData.baseColorstoneRate || ''} 
                    onChange={e => setFormData({...formData, baseColorstoneRate: Number(e.target.value)})} 
                    placeholder="e.g. 1000"
                    className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" 
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'analytics' && (
          <AdminAnalytics />
        )}

        {tab === 'access' && user && (
          <AdminAccessControl currentUserEmail={user.email || ''} />
        )}
        </React.Suspense>
      </div>
      
      {/* Floating Save Bar */}
      {['global', 'contact_page', 'shop', 'heritage', 'maison', 'brides', 'exchange'].includes(tab) && (
      <div className="fixed bottom-0 left-0 w-full bg-[#050505]/90 backdrop-blur-md border-t border-white/5 py-4 px-6 md:px-12 z-[100] flex justify-between items-center">
        <span className="text-xs md:text-[10px] uppercase font-light tracking-widest opacity-50">All changes immediately reflect on the live preview upon deployment.</span>
        <button 
          onClick={() => handleSave()}
          disabled={saving}
          className="px-12 py-4 bg-[#D4AF37] text-black text-sm md:text-[11px] uppercase tracking-[0.4em] font-medium hover:bg-white transition-all disabled:opacity-50"
        >
          {saving ? 'Syncing Base64 to Network...' : 'Deploy Database'}
        </button>
      </div>
      )}
    </div>
  );
}

