"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  name: string;
  label?: string;
  initialUrl?: string;
  onImageChange?: (url: string) => void;
  aspectRatio?: "square" | "video" | "banner";
}

// Compress image using canvas
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({
  name,
  label = "Cover Image",
  initialUrl,
  onImageChange,
  aspectRatio = "banner",
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(initialUrl || "");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[21/9]",
  }[aspectRatio];

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Max file size: 10MB before compression
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }

    setError("");
    setIsCompressing(true);

    try {
      const compressedUrl = await compressImage(file, 1200, 0.8);
      setImageUrl(compressedUrl);
      onImageChange?.(compressedUrl);
    } catch (err) {
      setError("Failed to process image");
      console.error("Image compression error:", err);
    } finally {
      setIsCompressing(false);
    }
  }, [onImageChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setImageUrl("");
    onImageChange?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={imageUrl} />

      {imageUrl ? (
        <div className={`relative ${aspectRatioClass} w-full rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800`}>
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={imageUrl.startsWith("data:")}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/90 hover:bg-white text-slate-900 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`${aspectRatioClass} w-full rounded-xl border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-brand-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-slate-300 dark:border-zinc-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
          }`}
        >
          {isCompressing ? (
            <>
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500">Compressing image...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-full">
                <ImageIcon className="w-8 h-8 text-slate-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Optional: Still allow URL input */}
      <div className="pt-2">
        <details className="group">
          <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
            Or enter image URL
          </summary>
          <input
            type="url"
            placeholder="https://..."
            value={imageUrl.startsWith("data:") ? "" : imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              onImageChange?.(e.target.value);
            }}
            className="mt-2 w-full px-3 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          />
        </details>
      </div>
    </div>
  );
}
