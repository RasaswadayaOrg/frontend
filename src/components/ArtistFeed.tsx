"use client";

import { useEffect, useState } from 'react';
import { FeedPost } from './artist-dashboard/FeedPost';

export function ArtistFeed({ artistId, artistName, artistAvatar }: { artistId: string, artistName: string, artistAvatar: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

  useEffect(() => {
    async function fetchPosts() {
        try {
            const apiUrl = API_URL;
            const res = await fetch(`${apiUrl}/artists/${artistId}/posts`);
            
            if (!res.ok) throw new Error('Failed to fetch');
            
            const data = await res.json();
            setPosts(data);
        } catch (e) {
            console.error("Error fetching posts:", e);
        } finally {
            setLoading(false);
        }
    }
    fetchPosts();
  }, [artistId]);

  if (loading) return <div className="text-center py-10 text-brand-500">Loading latest updates...</div>;
  
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-8 text-center border border-dashed border-slate-200 dark:border-zinc-700">
        <p className="text-slate-500 dark:text-zinc-400">No posts yet from {artistName}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white px-1">Latest Updates</h3>
      <div className="space-y-4 max-w-2xl">
        {posts.map((post) => (
          <FeedPost 
            key={post.id} 
            post={{
              id: post.id,
              author: {
                name: artistName,
                handle: `@${artistName.replace(/\s+/g, '').toLowerCase()}`,
                avatar: artistAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artistName)}&background=random`,
                isVerified: true 
              },
              content: post.title ? `**${post.title}**\n\n${post.content || ''}` : (post.content || ''),
              timestamp: new Date(post.publishedAt).toLocaleDateString(),
              image: post.imageUrl ? (
                post.imageUrl.startsWith("http")
                  ? post.imageUrl
                  : `${API_URL.replace("/api", "")}${post.imageUrl}`
              ) : undefined,
              video: post.videoUrl,
              likes: 0, // Placeholder
              comments: 0, // Placeholder
              // If source is facebook, show icon? FeedPost needs update potentially
            }} 
          />
        ))}
      </div>
    </div>
  );
}
