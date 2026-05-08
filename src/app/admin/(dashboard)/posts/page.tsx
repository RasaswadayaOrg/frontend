import { getAdminPosts, getAdminPostsCount } from "@/lib/db";
import { format } from "date-fns";
import { Search, Image as ImageIcon, Play, Heart, MessageCircle, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { DeletePostButton } from "@/app/admin/(dashboard)/posts/DeletePostButton";
import { EditPostButton } from "@/app/admin/(dashboard)/posts/EditPostButton";
import Link from "next/link";

export const dynamic = 'force-dynamic';

// Helper to extract YouTube video ID
function getYouTubeVideoId(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

// Helper to get source badge color
function getSourceBadgeClass(source: string): string {
  switch (source) {
    case 'FACEBOOK':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'INSTAGRAM':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
    default:
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  }
}

export default async function AdminPostsPage() {
  const { posts, pagination } = await getAdminPosts(50, 1);
  const totalCount = await getAdminPostsCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Posts Management</h1>
          <p className="text-sm text-slate-500">{totalCount} total posts from all artists.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
         
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Post</th>
                <th className="px-6 py-4">Artist</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Media</th>
                <th className="px-6 py-4">Engagement</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {posts.map((post: any) => {
                const youtubeId = getYouTubeVideoId(post.videoUrl);
                const hasImage = !!post.imageUrl;
                const hasVideo = !!youtubeId;

                return (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 bg-slate-200 dark:bg-zinc-800 rounded-lg relative overflow-hidden flex-shrink-0">
                          {hasVideo ? (
                            <img 
                              src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                              alt="Video thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : hasImage ? (
                            <ImageWithFallback 
                              src={post.imageUrl}
                              alt={post.title || "Post image"}
                              fill 
                              className="object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          {hasVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate">
                            {post.title || "Untitled Post"}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">
                            {post.content?.substring(0, 60) || 'No content'}
                            {post.content?.length > 60 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-zinc-800 rounded-full relative overflow-hidden flex-shrink-0">
                          <ImageWithFallback 
                            src={post.artist?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.artist?.name || 'A')}&background=random`}
                            alt={post.artist?.name || "Artist"}
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                          {post.artist?.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceBadgeClass(post.source)}`}>
                        {post.source === 'RASASWADAYA' ? 'Native' : post.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {hasImage && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <ImageIcon className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {hasVideo && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Play className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {!hasImage && !hasVideo && (
                          <span className="text-slate-400 italic text-xs">Text only</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-slate-500">
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Heart className="w-3.5 h-3.5" />
                          {post.likesCount || 0}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {post.commentsCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
                      {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : "—"}
                      <br />
                      <span className="text-slate-400">
                        {post.publishedAt ? format(new Date(post.publishedAt), "h:mm a") : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {post.videoUrl && (
                          <a 
                            href={post.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                            title="View video"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <EditPostButton post={post} />
                        <DeletePostButton postId={post.id} postTitle={post.title || "Untitled"} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No posts found. Artists can create posts from their dashboard.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-sm text-slate-500">
            <span>
              Showing {posts.length} of {pagination.total} posts
            </span>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
