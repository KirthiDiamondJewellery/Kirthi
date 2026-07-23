const fs = require("fs");
const path = require("path");

const componentsDir = path.join(__dirname, "src", "components");
const appFile = path.join(__dirname, "src", "App.tsx");
const mainFile = path.join(__dirname, "src", "main.tsx");

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  
  // Replace text-[10px] with text-xs md:text-[10px]
  content = content.replace(/text-\[10px\]/g, "text-xs md:text-[10px]");
  // Replace text-[11px] with text-sm md:text-[11px]
  content = content.replace(/text-\[11px\]/g, "text-sm md:text-[11px]");
  // Replace text-[12px] with text-sm md:text-[12px]
  content = content.replace(/text-\[12px\]/g, "text-sm md:text-[12px]");
  // Replace text-[9px] with text-xs md:text-[10px]
  content = content.replace(/text-\[9px\]/g, "text-xs md:text-[10px]");

  // Space out buttons and add padding to small buttons on mobile
  // e.g., py-2 to py-3 md:py-2
  content = content.replace(/py-1/g, "py-3 md:py-1");
  content = content.replace(/py-2 /g, "py-3 md:py-2 ");
  
  // Some places might have gap-2, increase to gap-4 on mobile
  content = content.replace(/gap-2/g, "gap-4 md:gap-2");
  content = content.replace(/gap-3/g, "gap-4 md:gap-3");

  // Fix up spacing (space-y/x)
  content = content.replace(/space-y-4/g, "space-y-6 md:space-y-4");
  content = content.replace(/space-x-4/g, "space-x-4 md:space-x-6");

  fs.writeFileSync(filePath, content, "utf-8");
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      processFile(fullPath);
    }
  }
}

if (fs.existsSync(componentsDir)) processDirectory(componentsDir);
if (fs.existsSync(appFile)) processFile(appFile);
if (fs.existsSync(mainFile)) processFile(mainFile);

// Also update index.css for better minimum tap target
const indexCssPath = path.join(__dirname, "src", "index.css");
if (fs.existsSync(indexCssPath)) {
  let css = fs.readFileSync(indexCssPath, "utf-8");
  css = css.replace(/min-height: 44px;/g, "min-height: 48px;");
  css = css.replace(/min-width: 44px;/g, "min-width: 48px;");
  fs.writeFileSync(indexCssPath, css, "utf-8");
}

console.log("Done upgrading mobile responsiveness");
