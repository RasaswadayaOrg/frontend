"use client";

import { useState, useEffect } from "react";

interface Props {
  artistId: string;
  initialCount: number;
}

export function ArtistFollowerCount({ artistId, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ artistId: string; delta: number }>).detail;
      if (detail.artistId === artistId) {
        setCount((c) => c + detail.delta);
      }
    };
    window.addEventListener("artistFollowChanged", handler);
    return () => window.removeEventListener("artistFollowChanged", handler);
  }, [artistId]);

  return <>{count}</>;
}
