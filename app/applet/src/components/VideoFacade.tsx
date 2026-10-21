import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Maximize } from 'lucide-react';

export function VideoFacade({
  videoId,
  videoUrl,
  title,
  posterUrl,
}: {
  videoId?: string;
  videoUrl?: string;
  title?: string;
  posterUrl?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Resolve active URL or ID
  const rawTarget = videoUrl || videoId || "cGrZrg3_BQw";
  
  // Extract YouTube ID if applicable
  const ytMatch = rawTarget.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  const resolvedYtId = ytMatch ? ytMatch[1] : (rawTarget.length === 11 && !rawTarget.includes('/') ? rawTarget : null);

  const isMp4 = rawTarget.endsWith('.mp4') || rawTarget.endsWith('.webm') || rawTarget.startsWith('/uploads/');
  const isVimeo = rawTarget.includes('vimeo.com');

  const originParam = typeof window !== 'undefined' && window.location.origin ? `&origin=${encodeURIComponent(window.location.origin)}` : '';

  if (isMp4) {
    return (
      <div className="relative w-full max-w-4xl mx-auto aspect-video bg-black border border-white/10 rounded-sm overflow-hidden group shadow-2xl">
        <video
          key={rawTarget}
          src={rawTarget}
          poster={posterUrl}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          controls
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (isVimeo) {
    const vimeoId = rawTarget.match(/(?:vimeo\.com\/)(\d+)/i)?.[1] || '';
    const vimeoSrc = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=${isMuted ? 1 : 0}&loop=1`;
    return (
      <div className="relative w-full max-w-4xl mx-auto aspect-video bg-black border border-white/10 rounded-sm overflow-hidden group shadow-2xl">
        <iframe
          src={vimeoSrc}
          title={title || "Video"}
          className="w-full h-full object-cover"
          allow="autoplay; fullscreen"
          style={{ border: 0 }}
        />
      </div>
    );
  }

  // YouTube Embed
  const finalYtId = resolvedYtId || "cGrZrg3_BQw";
  const embedUrl = `https://www.youtube.com/embed/${finalYtId}?autoplay=1&mute=1&loop=1&playlist=${finalYtId}&playsinline=1&controls=1&rel=0&modestbranding=1${originParam}`;

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video bg-black border border-white/10 rounded-sm overflow-hidden group shadow-2xl">
      <iframe
        src={embedUrl}
        title={title || "Inside the Workshop - Kirthi Diamonds"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="w-full h-full object-cover"
        style={{ border: 0 }}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <p className="text-sm font-serif italic text-[#D4AF37]">Inside the Workshop</p>
          <p className="text-xs text-white/50">Experience the hand-craftsmanship of Kirthi Diamonds.</p>
          <a
            href={`https://www.youtube.com/watch?v=${finalYtId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors"
          >
            Watch On YouTube
          </a>
        </div>
      )}
    </div>
  );
}
