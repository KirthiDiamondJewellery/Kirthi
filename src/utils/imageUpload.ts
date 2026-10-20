import imageCompression from "browser-image-compression";

export const compressImage = async (file: File): Promise<File> => {
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }
  
  const options = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: file.type === "image/png" ? "image/png" : "image/webp"
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Compression error:", error);
    return file;
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  let finalFile = file;
  try {
    finalFile = await compressImage(file);
  } catch (e) {
    console.warn("Compression warning, using original file", e);
  }

  // 1. Try server-side persistent upload (/api/upload)
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("file", finalFile);
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
    console.warn("Server upload attempt failed, falling back to base64 DataURL:", err);
  }

  // 2. Fallback to compressed base64 data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as data URL"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(finalFile);
  });
};
