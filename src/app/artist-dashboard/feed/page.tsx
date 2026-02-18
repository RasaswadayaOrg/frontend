"use client";

import { useEffect, useState, useCallback } from "react";
import { CreatePost } from "@/components/artist-dashboard/CreatePost";
import { FeedPost } from "@/components/artist-dashboard/FeedPost";
import { Loader2 } from "lucide-react";

interface Artist {
  id: string;
  name: string;
  photoUrl?: string; 
  // Add other fields as per backend response
}

interface Post {
  id: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  publishedAt: string;
  likes?: number;
  comments?: number;
}

const TRENDS = [
  { title: "#TraditionalArts", count: "12.5k posts" },
  { title: "#ColomboJazz", count: "8.2k posts" },
  { title: "Kandy Esala Perahera", count: "Trending in Events" },
  { title: "#ModernFusion", count: "5.1k posts" },
  { title: "Street Food Festival", count: "Coming soon" },
];

export default function ArtistFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("rasas_token");
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      
      // 1. Fetch Artist
      const artistRes = await fetch(`${API_URL}/artists/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!artistRes.ok) {
        setError("Failed to fetch artist profile");
        setLoading(false);
        return;
      }
      
      const artistData = await artistRes.json();
      setArtist(artistData);

      // 2. Fetch Posts
      const postsRes = await fetch(`${API_URL}/artists/${artistData.id}/posts`, {
        headers: { Authorization: `Bearer ${token}` } // posts endpoint might be public, but send token anyway
      });

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePostCreated = () => {
    fetchData();
  };

  if (loading && !posts.length) {
      return (
          <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Feed Column */}
      <div className="lg:col-span-2 space-y-4">
        {/* Pass callback to refresh posts after creation */}
        <CreatePost onPostCreated={handlePostCreated} />
        
        {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}

        {posts.length === 0 && !loading && !error && (
            <div className="text-center py-8 text-neutral-500">
                No posts yet. Create your first post above!
            </div>
        )}

        {posts.map((post) => (
          <FeedPost 
            key={post.id} 
            post={{
                id: post.id,
                author: {
                    name: artist?.name || "Artist",
                    handle: artist?.name?.toLowerCase().replace(/\s+/g, "") || "artist",
                    avatar: artist?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist?.name || "A")}&background=random`,
                    isVerified: true
                },
                content: post.title ? `**${post.title}**\n\n${post.content || ''}` : (post.content || ''),
                timestamp: new Date(post.publishedAt).toLocaleDateString(), 

                // Use a helper to determine correct image URL
                image: post.imageUrl ? (
                    post.imageUrl.startsWith("http") 
                        ? post.imageUrl 
                        : `${API_URL.replace("/api", "")}${post.imageUrl}`
                ) : undefined,
                video: post.videoUrl,
                likes: post.likes || 0,
                comments: post.comments || 0,
            }} 
          />
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-5">
          {/* Trends */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/60">
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                Trends for you
              </h3>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {TRENDS.map((trend, i) => (
                <div
                  key={i}
                  className="px-5 py-3 hover:bg-neutral-50/80 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors duration-200"
                >
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-violet-600 transition-colors">
                    {trend.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    {trend.count}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800/60">
              <button className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">
                Show more →
              </button>
            </div>
          </div>

          {/* Who to Follow */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/60">
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                Who to follow
              </h3>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {[
                { name: "Sithara Madushani", role: "Classical Vocalist" },
                { name: "Kasun Kalhara", role: "Composer" },
                { name: "Umaria", role: "Pop Artist" },
              ].map((person, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {person.name}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {person.role}
                      </div>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-violet-600 hover:text-violet-700 px-3 py-1.5 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}