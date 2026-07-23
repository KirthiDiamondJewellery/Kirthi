const fs = require('fs');
let code = fs.readFileSync('src/components/BlogPostView.tsx', 'utf8');

// Replace the image source logic
const targetImgLogic = `            {(() => {
              let imageSrc = (post.image && post.image !== "undefined" && post.image.trim() !== "")
                ? post.image
                : (post.images && post.images.length > 0 && post.images[0] && post.images[0] !== "undefined" && post.images[0].trim() !== "")
                ? post.images[0]
                : "https://kirthidiamonds.com/logo.png";
                
              if (imageSrc.includes('unsplash.com') || imageSrc.includes('images.unsplash')) {
                imageSrc = "https://kirthidiamonds.com/logo.png";
              }
              const isLogo = imageSrc === "https://kirthidiamonds.com/logo.png";
              return (
                <div className="aspect-[16/9] w-full overflow-hidden mb-12 rounded-sm shadow-2xl bg-[#030303] flex items-center justify-center">
                  <FastImage
                    src={imageSrc}
                    alt={post.title}
                    className={\`w-full h-full transition-all duration-1000 \${
                      isLogo 
                        ? "object-contain p-12 max-h-[60%] brightness-75 hover:brightness-100" 
                        : "object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100"
                    }\`}
                  />
                </div>
              );
            })()}`;

const newImgLogic = `            {(() => {
              let imageSrc = post.featuredImage && post.featuredImage.trim() !== "" 
                ? post.featuredImage 
                : "https://kirthidiamonds.com/og-cover.jpg";
              
              if (imageSrc === "https://kirthidiamonds.com/og-cover.jpg") {
                return null;
              }
              return (
                <div className="aspect-[16/9] w-full overflow-hidden mb-12 rounded-sm shadow-2xl bg-[#030303] flex items-center justify-center">
                  <FastImage
                    src={imageSrc}
                    alt={post.title}
                    className="w-full h-full transition-all duration-1000 object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100"
                  />
                </div>
              );
            })()}`;

code = code.replace(targetImgLogic, newImgLogic);

code = code.replace(/post\.image \? \[post\.image\] : \[\]/g, 'post.featuredImage ? [post.featuredImage] : ["https://kirthidiamonds.com/og-cover.jpg"]');

fs.writeFileSync('src/components/BlogPostView.tsx', code);
