"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { resolveMediaUrl } from "@/lib/media";

// Simple SVG placeholder data URI (Light gray background with generic icon shape)
const DEFAULT_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Crect width='400' height='300' fill='%2318181b' fill-opacity='0.1' class='dark-rect'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%2394a3b8'%3EMISSING IMAGE%3C/text%3E%3Cstyle%3E @media (prefers-color-scheme: dark) { .dark-rect { opacity: 1; fill: %2327272a; } text { fill: %2352525b; } } %3C/style%3E%3C/svg%3E";

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

export function ImageWithFallback({ 
  src, 
  fallbackSrc = DEFAULT_FALLBACK, 
  alt, 
  ...props 
}: ImageWithFallbackProps) {
  // If the src is a third-party /_next/image?url=... proxy URL, extract the
  // underlying image URL so our own optimizer can handle it directly.
  function unwrapNextImageUrl(s: string): string {
    try {
      const parsed = new URL(s);
      if (parsed.pathname === "/_next/image") {
        const inner = parsed.searchParams.get("url");
        if (inner) return decodeURIComponent(inner);
      }
    } catch { /* not a valid URL — fall through */ }
    return s;
  }

  // Hardcoded image override for Nanda Malini
  const rawSrc = (typeof src === 'string' && src.includes('nettv4u.com/imagine/21-05-2023/nanda-malani.jpg'))
    ? '/nanda_malini.jpeg'
    : (typeof src === 'string' && src.includes('sinhabahu.jpg'))
      ? '/sinhabahu.jpg'
      : (src || fallbackSrc);

  const unwrapped = typeof rawSrc === "string" ? unwrapNextImageUrl(rawSrc) : rawSrc;
  const effectiveSrc = typeof unwrapped === "string" ? resolveMediaUrl(unwrapped) : unwrapped;

  const [imgSrc, setImgSrc] = useState(effectiveSrc);

  useEffect(() => {
    setImgSrc(effectiveSrc);
  }, [effectiveSrc]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
