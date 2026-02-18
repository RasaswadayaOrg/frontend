"use client";

import {
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  BadgeCheck,
} from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useState } from "react";

interface PostProps {
  post: {
    id: string;
    author: {
      name: string;
      handle: string;
      avatar: string;
      isVerified?: boolean;
    };
    content: string;
    timestamp: string;
    image?: string;
    video?: string;
    likes: number;
    comments: number;
    collaborator?: {
      name: string;
      role: string;
    };
  };
}

export function FeedPost({ post }: PostProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const getYouTubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = post.video ? getYouTubeID(post.video) : null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
      <div className="p-5">
        {/* Author */}
        <div className="flex justify-between items-start mb-3.5">
          <div className="flex gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <ImageWithFallback
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              {post.collaborator && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-100 dark:bg-violet-900/30 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px]">
                  🤝
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  {post.author.name}
                </h3>
                {post.author.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-violet-500" />
                )}
                {post.collaborator && (
                  <span className="text-xs text-neutral-500">
                    with{" "}
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {post.collaborator.name}
                    </span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                <span>@{post.author.handle}</span>
                <span>·</span>
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>
          <button className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed mb-3.5">
          {post.content}
        </div>

        {/* Image */}
        {post.image && (
          <div className="rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800/60 -mx-1">
            {/* Use native img tag to avoid Next.js Image optimization issues with external URLs */}
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Video */}
        {post.video && videoId ? (
          <div className="rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800/60 aspect-video relative bg-black -mx-1">
             <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
          </div>
        ) : post.video && (
             <div className="rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800/60 p-4 bg-neutral-50 dark:bg-neutral-800/30 text-center text-sm text-neutral-500">
                <a href={post.video} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                    Watch Video on YouTube
                </a>
             </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-neutral-100 dark:border-neutral-800/60">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-all duration-200 ${
            liked
              ? "text-pink-500"
              : "text-neutral-500 hover:text-pink-500"
          }`}
        >
          <Heart className={`w-[18px] h-[18px] ${liked ? "fill-current" : ""}`} />
          <span className="text-xs font-medium">{likeCount}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-violet-500 transition-colors duration-200">
          <MessageCircle className="w-[18px] h-[18px]" />
          <span className="text-xs font-medium">{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-blue-500 transition-colors duration-200">
          <Share2 className="w-[18px] h-[18px]" />
          <span className="text-xs font-medium">Share</span>
        </button>
      </div>
    </div>
  );
}
