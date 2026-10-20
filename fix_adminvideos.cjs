const fs = require('fs');
let content = fs.readFileSync('src/components/AdminVideos.tsx', 'utf8');

const oldVideoTag = `                  <video 
                     controls 
                     playsInline 
                     preload="metadata" 
                     poster={videoData.posterUrl}
                    className="w-full aspect-video rounded object-cover"
                  >
                    <source src={videoData.videoUrl} type={videoData.videoUrl.includes('webm') ? 'video/webm' : 'video/mp4'} />
                    Your browser does not support the video tag.
                  </video>`;

const newVideoPreview = `<div className="w-full aspect-video rounded object-cover overflow-hidden relative">
                    <HeadlessVideoPlayer url={videoData.videoUrl} brightnessClass="brightness-[0.9]" />
                  </div>`;

if (content.includes(oldVideoTag)) {
  content = content.replace(oldVideoTag, newVideoPreview);
} else {
  // Regex fallback
  content = content.replace(/<video[\s\S]*?<\/video>/, newVideoPreview);
}

if (!content.includes('import { HeadlessVideoPlayer }')) {
  content = content.replace("import { Loader2, Save } from 'lucide-react';", "import { Loader2, Save } from 'lucide-react';\nimport { HeadlessVideoPlayer } from './HeadlessVideoPlayer';");
}

fs.writeFileSync('src/components/AdminVideos.tsx', content);
