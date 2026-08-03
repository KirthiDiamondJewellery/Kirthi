const fs = require('fs');
let code = fs.readFileSync('src/components/BridesShowcase.tsx', 'utf8');

const replacement = `  const { content } = useContent();
  const gallery = content.brideGallery || [];
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  
  const pageVideo = content.pageVideos?.find(v => v.id === 'brides') || content.pageVideos?.find(v => v.id === 'methodology');
  const videoUrl = content.methodologyVideoUrl || 'https://youtu.be/cGrZrg3_BQw';
  const videoIdMatch = videoUrl.match(/(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=|shorts\\/))([\\w-]{11})/i);
  const videoIdStr = videoIdMatch ? videoIdMatch[1] : "cGrZrg3_BQw";`;

code = code.replace(/const \{ content \} = useContent\(\);\s*const gallery = content\.brideGallery \|\| \[\];\s*const \[isSubmitModalOpen, setIsSubmitModalOpen\] = useState\(false\);/, replacement);

fs.writeFileSync('src/components/BridesShowcase.tsx', code);
