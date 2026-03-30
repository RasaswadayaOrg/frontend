"use client";

import { useState, useEffect, useRef } from "react";
import { X, Heart, MessageCircle, Send, User, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Artist {
  id: string;
  name: string;
  photoUrl: string | null;
  genre: string | null;
  bio?: string;
  followersCount?: number;
  isFollowing?: boolean;
}

interface Song {
  id: string;
  title: string | null;
  content: string | null;
  imageUrl: string;
  videoUrl: string | null;
  publishedAt: string;
  artist: Artist;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

interface SongDetailModalProps {
  song: Song;
  onClose: () => void;
  onLikeUpdate: (songId: string, isLiked: boolean, likesCount: number) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("rasas_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

export function SongDetailModal({ song: initialSong, onClose, onLikeUpdate }: SongDetailModalProps) {
  const { user, openAuthModal } = useAuth();
  const [song, setSong] = useState(initialSong);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followState, setFollowState] = useState(song.artist.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(song.artist.followersCount || 0);
  const modalRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const youtubeId = song.videoUrl ? extractYouTubeId(song.videoUrl) : null;

  useEffect(() => {
    fetchSongDetails();
    fetchComments();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const fetchSongDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/songs/${song.id}`, {
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSong(data);
        setFollowState(data.artist.isFollowing || false);
        setFollowersCount(data.artist.followersCount || 0);
      }
    } catch (error) {
      console.error("Error fetching song details:", error);
    }
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/songs/${song.id}/comments`, {
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/songs/${song.id}/like`, {
        method: song.isLiked ? "DELETE" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSong(prev => ({ ...prev, isLiked: data.liked, likesCount: data.likesCount }));
        onLikeUpdate(song.id, data.liked, data.likesCount);
      }
    } catch (error) {
      console.error("Error liking song:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (isFollowing) return;
    setIsFollowing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/songs/artists/${song.artist.id}/follow`, {
        method: followState ? "DELETE" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFollowState(data.following);
        setFollowersCount(data.followersCount);
      }
    } catch (error) {
      console.error("Error following artist:", error);
    } finally {
      setIsFollowing(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      openAuthModal();
      return;
    }

    if (!newComment.trim() || isSubmittingComment) return;
    setIsSubmittingComment(true);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/songs/${song.id}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [comment, ...prev]);
        setNewComment("");
        setSong(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/songs/${song.id}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (response.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        setSong(prev => ({ ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) }));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-zinc-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
      >
        {/* Left: Media Section */}
        <div className="md:w-3/5 bg-black flex items-center justify-center relative">
          {youtubeId ? (
            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={song.title || "Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <img
              src={song.imageUrl}
              alt={song.title || "Song"}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/600x600?text=No+Image";
              }}
            />
          )}
          
          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:hidden bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Info & Comments Section */}
        <div className="md:w-2/5 flex flex-col max-h-[90vh] md:max-h-none">
          {/* Header with close button */}
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={`/artists/${song.artist.id}`}>
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-700 overflow-hidden">
                    {song.artist.photoUrl ? (
                      <img
                        src={song.artist.photoUrl}
                        alt={song.artist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                </Link>
                <div>
                  <Link href={`/artists/${song.artist.id}`} className="font-semibold text-slate-900 dark:text-white hover:text-brand-600">
                    {song.artist.name}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {followersCount} followers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFollow}
                  disabled={isFollowing}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    followState
                      ? "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {isFollowing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : followState ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="hidden md:block p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Song Info */}
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {song.title || "Untitled"}
            </h2>
            {song.content && (
              <p className="text-sm text-slate-600 dark:text-zinc-400 whitespace-pre-wrap line-clamp-3">
                {song.content}
              </p>
            )}
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
              {new Date(song.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-6">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 transition-colors ${
                song.isLiked
                  ? "text-red-500"
                  : "text-slate-600 dark:text-zinc-400 hover:text-red-500"
              }`}
            >
              <Heart 
                className={`w-6 h-6 ${isLiking ? "animate-pulse" : ""}`}
                fill={song.isLiked ? "currentColor" : "none"}
              />
              <span className="font-medium">{song.likesCount}</span>
            </button>

            <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{song.commentsCount}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoadingComments ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-slate-400 dark:text-zinc-500 py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                    {comment.user.avatarUrl ? (
                      <img
                        src={comment.user.avatarUrl}
                        alt={comment.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-slate-900 dark:text-white">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-zinc-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-zinc-400 mt-0.5">
                      {comment.content}
                    </p>
                    {user && comment.user.id === user.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-500 hover:text-red-600 mt-1"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <form 
            onSubmit={handleSubmitComment}
            className="p-4 border-t border-slate-200 dark:border-zinc-800"
          >
            <div className="flex gap-3">
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Add a comment..." : "Login to comment"}
                disabled={!user}
                className="flex-1 resize-none rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                rows={2}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmittingComment || !user}
                className="self-end px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
