import React from 'react';

export function VideoFacade({ videoId, title }: { videoId: string, title?: string }) {
  if (!videoId) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video bg-black border border-white/10 overflow-hidden group pointer-events-none">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&controls=0`}
        title={title || "YouTube video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
        style={{ border: 0 }}
      />
    </div>
  );
}
