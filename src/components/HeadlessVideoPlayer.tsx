import React, { useState, useEffect } from 'react';

export function HeadlessVideoPlayer({ url, brightnessClass = "brightness-[0.35]" }: { url: string, brightnessClass?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only set mounted if it isn't already mounted 
    // to avoid a synchronous re-render in the initial effect run
    // or just run this after a macro-task
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, [url]);

  if (!url || !mounted) return null;

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i)?.[1];
    if (videoId) {
      const originStr = typeof window !== "undefined" && window.location.origin ? `&origin=${encodeURIComponent(window.location.origin)}` : "";
      return (
        <div className="w-full h-full absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playsinline=1&playlist=${videoId}&controls=0&disablekb=1${originStr}`}
            title="Video"
            width="100%"
            height="100%"
            className={`w-full h-full absolute top-0 left-0 object-cover grayscale ${brightnessClass}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ border: 0 }}
          />
        </div>
      );
    }
  }

  if (url.includes("vimeo.com") && !url.includes(".mp4")) {
    const vimeoId = url.match(/(?:vimeo\.com\/)(\d+)/i)?.[1];
    const src = url.includes("player.vimeo.com") 
      ? `${url}${url.includes('?') ? '&' : '?'}autoplay=1&muted=1&loop=1`
      : `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1`;
    
    return (
      <div className="w-full h-full relative overflow-hidden pointer-events-none flex items-center justify-center bg-black">
        <iframe
          src={src}
          title="Video"
          className={`w-full h-full absolute top-0 left-0 object-cover grayscale ${brightnessClass}`}
          allow="autoplay; fullscreen"
          style={{ border: 0 }}
        />
      </div>
    );
  }

  if (url.includes("drive.google.com")) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-black pointer-events-none">
        <iframe
          src={url.includes("/file/d/") ? `https://drive.google.com/file/d/${url.split('/file/d/')[1].split('/')[0]}/preview?autoplay=1&mute=1` : `${url}${url.includes('?') ? '&' : '?'}autoplay=1&mute=1`}
          title="Google Drive Video"
          className={`w-full h-full absolute top-0 left-0 object-cover grayscale ${brightnessClass} opacity-80`}
          allow="autoplay; fullscreen"
          style={{ border: 0 }}
        />
      </div>
    );
  }

  return (
    <video
      key={url}
      autoPlay
      muted
      controls={false}
      loop
      playsInline
      className={`w-full h-full object-cover grayscale-[0.8] ${brightnessClass} select-none pointer-events-none absolute inset-0`}
    >
      <source src={url} />
    </video>
  );
}

