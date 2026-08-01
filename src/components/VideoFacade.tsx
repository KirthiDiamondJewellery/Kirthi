import React, { useState } from 'react';
import { Play } from 'lucide-react';

export function VideoFacade({ videoId, title }: { videoId: string, title?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video bg-black border border-white/10 overflow-hidden group cursor-pointer" onClick={() => setIsPlaying(true)}>
      {!isPlaying ? (
        <>
          <img 
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
            alt={title || "Video thumbnail"} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Play className="w-8 h-8 text-white fill-white ml-2" />
            </div>
          </div>
        </>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1`}
          title={title || "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full absolute inset-0"
        />
      )}
    </div>
  );
}
