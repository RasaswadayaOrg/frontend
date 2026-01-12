"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

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
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

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
