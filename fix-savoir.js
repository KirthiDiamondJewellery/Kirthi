const fs = require('fs');

let content = fs.readFileSync('src/components/SavoirFaire.tsx', 'utf8');

// 1. Update imports
if (!content.includes('HeadlessVideoPlayer')) {
  content = content.replace(/import \{ VideoFacade \} from '\.\/VideoFacade';/, "import { VideoFacade } from './VideoFacade';\nimport { HeadlessVideoPlayer } from './HeadlessVideoPlayer';");
}

// 2. Fix videoUrl to prioritize pageVideo
content = content.replace(
  /const videoUrl = content\.methodologyVideoUrl \|\| 'https:\/\/youtu\.be\/cGrZrg3_BQw';/,
  "const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;\n  const videoUrl = (isMobile && pageVideo?.mobileVideoUrl) ? pageVideo.mobileVideoUrl : (pageVideo?.videoUrl || pageVideo?.youtubeUrl || content.methodologyVideoUrl || 'https://youtu.be/cGrZrg3_BQw');"
);

// 3. Add background video
content = content.replace(
  /<section className="relative w-full min-h-\[90vh\] flex flex-col justify-center items-center px-6 md:px-28 shrink-0">/,
  `<section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center px-6 md:px-28 shrink-0">
            {videoUrl && (
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <HeadlessVideoPlayer url={videoUrl} brightnessClass="brightness-[0.4]" />
              </div>
            )}`
);

// 4. Remove VideoFacade
content = content.replace(
  /<div className="mt-16 w-full">\s*<VideoFacade videoId=\{videoIdStr\} title="Kirthi Diamonds Methodology" \/>\s*<\/div>/g,
  ''
);

fs.writeFileSync('src/components/SavoirFaire.tsx', content);
