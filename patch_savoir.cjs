const fs = require('fs');
let content = fs.readFileSync('src/components/SavoirFaire.tsx', 'utf8');

const replacementTop = `
  const { content } = useContent();
  const steps = content.methodologySteps || [];
      
  const pageVideo = content.pageVideos?.find(v => v.id === 'methodology');
  const videoUrl = content.methodologyVideoUrl || 'https://youtu.be/cGrZrg3_BQw';
  const videoIdMatch = videoUrl.match(/(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=|shorts\\/))([\\w-]{11})/i);
  const videoIdStr = videoIdMatch ? videoIdMatch[1] : "cGrZrg3_BQw";
  
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
`;

content = content.replace(
  /const steps = content\.methodologySteps \|\| \[\];\s*const pageVideo = content\.pageVideos\?\.find\(v => v\.id === 'methodology'\);\s*const \[expandedStep, setExpandedStep\] = useState<string \| null>\(null\);/,
  replacementTop
);

fs.writeFileSync('src/components/SavoirFaire.tsx', content);
