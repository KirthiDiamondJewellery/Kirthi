// Bulletproof, cross-platform client-side image compression & upload
export const compressImageToDataUrl = (file: File, maxDim = 1200, quality = 0.85): Promise<string> => {
  if (file.type === "image/svg+xml" || file.size < 40000) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(e.target?.result as string);
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Try webp first, fallback to jpeg
        try {
          const webpData = canvas.toDataURL("image/webp", quality);
          if (webpData && webpData.startsWith("data:image/webp")) {
            return resolve(webpData);
          }
        } catch (err) {}

        const jpegData = canvas.toDataURL("image/jpeg", quality);
        resolve(jpegData);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      resolve("");
    };
    reader.readAsDataURL(file);
  });
};

export const compressImage = async (file: File): Promise<File> => {
  return file;
};

export const uploadImage = async (file: File): Promise<string> => {
  // 1. First generate compressed data URL (guaranteed fallback)
  const dataUrl = await compressImageToDataUrl(file);

  // 2. Try server-side persistent upload (/api/upload)
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: bodyFormData,
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn("Server upload endpoint unavailable, using compressed data URL:", err);
  }

  // Fallback directly to compressed data URL
  return dataUrl;
};
