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

interface Follower {
  id: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
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
  const [followers, setFollowers] = useState<Follower[]>([]);
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

      // 3. Fetch Followers
      const followersRes = await fetch(`${API_URL}/artists/${artistData.id}/followers`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (followersRes.ok) {
        const followersData = await followersRes.json();
        setFollowers(followersData.data || []);
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

          {/* Your Followers */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/60">
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                Your Followers
              </h3>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {followers.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-neutral-500">
                  No followers yet. Share your posts to grow your audience!
                </div>
              ) : (
                followers.map((follower) => (
                  <div
                    key={follower.id}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {follower.user.avatarUrl ? (
                        <img
                          src={follower.user.avatarUrl}
                          alt={follower.user.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                          {follower.user.fullName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {follower.user.fullName}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Followed {new Date(follower.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}