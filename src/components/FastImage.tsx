import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface FastImageProps extends HTMLMotionProps<"img"> {
  src?: string;
  alt?: string;
  containerClassName?: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
}

const GOLD_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImciIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzFjMTgxMCIvPjxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjMGEwOTA3Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDMwMzAzIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=";

export const FastImage = forwardRef<HTMLImageElement, FastImageProps>(({ 
  src, 
  alt, 
  className, 
  containerClassName, 
  sizes, 
  loading, 
  decoding, 
  draggable, 
  fetchPriority,
  onLoad,
  ...props 
}, ref) => {
  const [isLoaded, setIsLoaded] = React.useState(() => src?.startsWith('data:') || false);
  const localRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (src?.startsWith('data:')) {
      setIsLoaded(true);
      return;
    }
    if (localRef.current && localRef.current.complete) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false); // Reset if it's a new image not loaded yet
    }
  }, [src]);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(event);
    }
  };

  const setRefs = React.useCallback((node: HTMLImageElement | null) => {
    localRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLImageElement | null>).current = node;
    }
  }, [ref]);

  const getOptimizedUrl = (url: string | undefined, width: number, format: string = 'webp') => {
    if (!url) return undefined;
    if (url.startsWith('data:')) return url;
    try {
      if (url.includes('unsplash.com') || url.includes('images.unsplash')) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('q', '80');
        urlObj.searchParams.set('w', width.toString());
        urlObj.searchParams.set('auto', 'format');
        urlObj.searchParams.set('fm', format);
        urlObj.searchParams.set('fit', 'crop');
        return urlObj.toString();
      }
    } catch (e) {
      // Ignore
    }
    return url;
  };

  const getLowResUrl = (url: string | undefined) => {
    if (!url) return GOLD_PLACEHOLDER;
    if (url.startsWith('data:')) return url;
    try {
      if (url.includes('unsplash.com') || url.includes('images.unsplash')) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('q', '15');
        urlObj.searchParams.set('w', '40');
        urlObj.searchParams.set('auto', 'format');
        urlObj.searchParams.set('fm', 'webp');
        urlObj.searchParams.set('fit', 'crop');
        return urlObj.toString();
      }
    } catch (e) {
      // Ignore
    }
    return GOLD_PLACEHOLDER;
  };

  const getSrcSet = (url: string | undefined, format: string = 'webp') => {
    if (!url || url.startsWith('data:')) return undefined;
    if (url.includes('unsplash.com') || url.includes('images.unsplash')) {
      return `${getOptimizedUrl(url, 400, format)} 400w, 
              ${getOptimizedUrl(url, 800, format)} 800w, 
              ${getOptimizedUrl(url, 1200, format)} 1200w, 
              ${getOptimizedUrl(url, 1600, format)} 1600w, 
              ${getOptimizedUrl(url, 2400, format)} 2400w`;
    }
    return undefined;
  };

  const isUnsplash = src && (src.includes('unsplash.com') || src.includes('images.unsplash'));
  if (!src || src.trim() === '' || isUnsplash) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden w-full h-full bg-[#050505] ${containerClassName || ''}`}>
        <img
          src="/logo.png"
          alt="Kirthi Diamonds"
          referrerPolicy="no-referrer"
          className="absolute max-w-[50%] max-h-[50%] object-contain opacity-20 grayscale filter invert brightness-200"
        />
      </div>
    );
  }

  const defaultSizes = sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
  const avifSrcSet = getSrcSet(src, 'avif');
  const webpSrcSet = getSrcSet(src, 'webp');
  const jpegSrcSet = getSrcSet(src, 'jpg');
  const lowResUrl = getLowResUrl(src);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden w-full h-full ${containerClassName || ''}`}>
      {/* Low-resolution / Base64 Blur-up Placeholder */}
      <img
        src={lowResUrl}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 transition-opacity duration-1000 pointer-events-none z-10 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <picture className="block w-full h-full z-0">
        {avifSrcSet && (
          <source
            type="image/avif"
            srcSet={avifSrcSet}
            sizes={defaultSizes}
          />
        )}
        {webpSrcSet && (
          <source
            type="image/webp"
            srcSet={webpSrcSet}
            sizes={defaultSizes}
          />
        )}
        {jpegSrcSet && (
          <source
            type="image/jpeg"
            srcSet={jpegSrcSet}
            sizes={defaultSizes}
          />
        )}
        <motion.img
          ref={setRefs}
          src={getOptimizedUrl(src, 1200, 'webp')}
          alt={alt || "Image"}
          referrerPolicy="no-referrer"
          className={`${className || 'w-full h-full object-cover'} transition-all duration-1000 ${
            isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-md'
          }`}
          onLoad={handleLoad}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loops
            target.src = "/logo.png";
            target.className = "absolute max-w-[50%] max-h-[50%] object-contain opacity-20 grayscale filter invert brightness-200 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
          }}
          loading={fetchPriority === "high" ? "eager" : (loading || "lazy")}
          decoding={decoding as any || "async"}
          draggable={draggable}
          fetchPriority={fetchPriority}
          {...props}
        />
      </picture>
    </div>
  );
});

FastImage.displayName = "FastImage";
